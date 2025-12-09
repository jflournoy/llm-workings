import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Network } from '../network/Network';
import type { NetworkState } from '../network/Network';
import { sigmoid, binaryCrossEntropy, confidencePenalty as calcConfidencePenalty } from '../network/functions';

// The 4 canonical XOR points (for evaluation)
const CLEAN_XOR = [
  { input: [0, 0], target: [0] },
  { input: [0, 1], target: [1] },
  { input: [1, 0], target: [1] },
  { input: [1, 1], target: [0] },
];

// Seeded random for reproducibility
function seededRandom(seed: number) {
  // Seed both m_w and m_z from the input seed for proper randomization
  let m_w = (seed * 1103515245 + 12345) >>> 0;
  let m_z = (seed * 134775813 + 1) >>> 0;
  // Ensure they're non-zero
  if (m_w === 0) m_w = 1;
  if (m_z === 0) m_z = 1;
  const mask = 0xffffffff;
  const random = function () {
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    const result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    return result / 4294967296;
  };
  // Warm up the PRNG
  for (let i = 0; i < 10; i++) random();
  return random;
}

// Generate noisy XOR dataset
function generateNoisyData(
  numSamples: number,
  noiseLevel: number,
  seed: number
): { input: number[]; target: number[]; trueTarget: number[]; isNoisy: boolean }[] {
  const rand = seededRandom(seed);
  const data: { input: number[]; target: number[]; trueTarget: number[]; isNoisy: boolean }[] = [];

  for (let i = 0; i < numSamples; i++) {
    const x1 = rand();
    const x2 = rand();

    // True XOR label based on which quadrant
    const trueLabel = (x1 >= 0.5 ? 1 : 0) ^ (x2 >= 0.5 ? 1 : 0);

    // Flip label with probability noiseLevel
    const isNoisy = rand() < noiseLevel;
    const label = isNoisy ? 1 - trueLabel : trueLabel;

    data.push({
      input: [x1, x2],
      target: [label],
      trueTarget: [trueLabel],
      isNoisy,
    });
  }

  return data;
}

export interface DataPoint {
  input: number[];
  target: number[];
  trueTarget: number[];
  isNoisy: boolean;
}

export interface TrainingStep {
  step: number;
  state: NetworkState;
  loss: number;          // Training loss (on noisy data)
  cleanLoss: number;     // Loss on clean XOR points
  accuracy: number;      // Accuracy on clean XOR
  currentInputIdx: number;
}

export interface TrainingState {
  network: Network;
  steps: TrainingStep[];
  currentStep: number;
  isPlaying: boolean;
  selectedInputIdx: number;
}

// Default layer sizes - defined outside to avoid recreating on every render
const DEFAULT_LAYER_SIZES = [2, 4, 1];

export function useTraining(initialLayerSizes: number[] = DEFAULT_LAYER_SIZES) {
  const [learningRate, setLearningRate] = useState(0.5);
  const [noiseLevel, setNoiseLevel] = useState(0); // 0 to 1
  const [numSamples, setNumSamples] = useState(100);
  const [dataSeed, setDataSeed] = useState(42);
  const [confidencePenalty, setConfidencePenalty] = useState(0); // 0 = off, positive = strength

  // Generate training data based on noise level
  const trainingData = useMemo(() => {
    return generateNoisyData(numSamples, noiseLevel, dataSeed);
  }, [numSamples, noiseLevel, dataSeed]);

  // Compute loss on training data (with optional confidence penalty)
  const computeTrainLoss = useCallback((net: Network, data: DataPoint[], confPenalty: number = 0): number => {
    let totalLoss = 0;
    for (const { input, target } of data) {
      const output = net.forward(input);
      const sigmoidOutput = sigmoid(output as number[]) as number[];
      let loss = binaryCrossEntropy(sigmoidOutput, target);
      if (confPenalty > 0) {
        loss += confPenalty * calcConfidencePenalty(sigmoidOutput);
      }
      totalLoss += loss;
    }
    return totalLoss / data.length;
  }, []);

  // Compute loss and accuracy on clean XOR
  const computeCleanMetrics = useCallback((net: Network): { loss: number; accuracy: number } => {
    let totalLoss = 0;
    let correct = 0;
    for (const { input, target } of CLEAN_XOR) {
      const output = net.forward(input);
      const sigmoidOutput = sigmoid(output as number[]) as number[];
      totalLoss += binaryCrossEntropy(sigmoidOutput, target);
      const predicted = sigmoidOutput[0] >= 0.5 ? 1 : 0;
      if (predicted === target[0]) correct++;
    }
    return {
      loss: totalLoss / CLEAN_XOR.length,
      accuracy: correct / CLEAN_XOR.length,
    };
  }, []);

  const createInitialState = useCallback((seed?: number): TrainingState => {
    const net = new Network(initialLayerSizes, seed);
    const loss = computeTrainLoss(net, trainingData, confidencePenalty);
    const { loss: cleanLoss, accuracy } = computeCleanMetrics(net);
    const initialState = net.getState();
    return {
      network: net,
      steps: [{
        step: 0,
        state: initialState,
        loss,
        cleanLoss,
        accuracy,
        currentInputIdx: 0,
      }],
      currentStep: 0,
      isPlaying: false,
      selectedInputIdx: 0,
    };
  }, [initialLayerSizes, trainingData, confidencePenalty, computeTrainLoss, computeCleanMetrics]);

  const [training, setTraining] = useState<TrainingState>(() => createInitialState(123));

  // Auto-reset when training data parameters change
  // We track dataSeed separately since it's the primary trigger for data changes
  const prevDataParams = useRef({ numSamples, noiseLevel, dataSeed });
  useEffect(() => {
    const prev = prevDataParams.current;
    if (prev.numSamples === numSamples && prev.noiseLevel === noiseLevel && prev.dataSeed === dataSeed) {
      return; // No change in data parameters
    }
    prevDataParams.current = { numSamples, noiseLevel, dataSeed };
    // Reset with fixed seed when data changes
    setTraining(createInitialState(123));
  }, [numSamples, noiseLevel, dataSeed, createInitialState]);

  const trainStep = useCallback(() => {
    setTraining(prev => {
      const net = new Network(prev.network.layerSizes);
      net.setState(prev.steps[prev.currentStep].state);

      // Train one epoch on all training examples
      for (const { input, target } of trainingData) {
        net.forward(input);
        net.backward(input, target, confidencePenalty);
        net.step(learningRate);
      }

      const newState = net.getState();
      const loss = computeTrainLoss(net, trainingData, confidencePenalty);
      const { loss: cleanLoss, accuracy } = computeCleanMetrics(net);

      return {
        ...prev,
        network: net,
        steps: [
          ...prev.steps,
          {
            step: prev.currentStep + 1,
            state: newState,
            loss,
            cleanLoss,
            accuracy,
            currentInputIdx: 0,
          },
        ],
        currentStep: prev.currentStep + 1,
      };
    });
  }, [learningRate, confidencePenalty, trainingData, computeTrainLoss, computeCleanMetrics]);

  const goToStep = useCallback((step: number) => {
    setTraining(prev => {
      if (step < 0 || step >= prev.steps.length) return prev;

      const net = new Network(prev.network.layerSizes);
      net.setState(prev.steps[step].state);

      return {
        ...prev,
        network: net,
        currentStep: step,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setTraining(createInitialState(123));
  }, [createInitialState]);

  const randomize = useCallback(() => {
    // Use timestamp to get a different seed each time
    const randomSeed = (Date.now() % 99999) + 1;
    setTraining(createInitialState(randomSeed));
  }, [createInitialState]);

  const regenerateData = useCallback(() => {
    const newSeed = Date.now() % 100000;
    setDataSeed(newSeed);
  }, []);

  const setSelectedInput = useCallback((idx: number) => {
    setTraining(prev => ({
      ...prev,
      selectedInputIdx: idx,
    }));
  }, []);

  const setIsPlaying = useCallback((playing: boolean) => {
    setTraining(prev => ({
      ...prev,
      isPlaying: playing,
    }));
  }, []);

  return {
    training,
    trainStep,
    goToStep,
    reset,
    randomize,
    regenerateData,
    setSelectedInput,
    setIsPlaying,
    learningRate,
    setLearningRate,
    noiseLevel,
    setNoiseLevel,
    numSamples,
    setNumSamples,
    confidencePenalty,
    setConfidencePenalty,
    trainingData,
    cleanXorData: CLEAN_XOR,
  };
}
