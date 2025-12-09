import { sigmoid } from './functions';

export interface NetworkState {
  weights: number[][][];      // weights[layer][from][to]
  biases: number[][];         // biases[layer][node]
  preActivations: number[][];  // z values before activation
  activations: number[][];     // values after activation
  weightGrads: number[][][];
  biasGrads: number[][];
}

export class Network {
  layerSizes: number[];
  weights: number[][][];
  biases: number[][];

  // Intermediate values for backprop
  preActivations: number[][] = [];
  activations: number[][] = [];
  weightGrads: number[][][] = [];
  biasGrads: number[][] = [];

  constructor(layerSizes: number[], seed?: number) {
    this.layerSizes = layerSizes;
    this.weights = [];
    this.biases = [];

    // Create a local seeded random function (don't pollute global Math.random)
    let random: () => number;
    if (seed !== undefined) {
      // Seed both m_w and m_z from the input seed for proper randomization
      // Use different transformations to ensure different values
      let m_w = (seed * 1103515245 + 12345) >>> 0;
      let m_z = (seed * 134775813 + 1) >>> 0;
      // Ensure they're non-zero
      if (m_w === 0) m_w = 1;
      if (m_z === 0) m_z = 1;
      const mask = 0xffffffff;
      random = () => {
        m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
        const result = ((m_z << 16) + (m_w & 65535)) >>> 0;
        return result / 4294967296;
      };
      // Warm up the PRNG a few cycles
      for (let i = 0; i < 10; i++) random();
    } else {
      random = Math.random;
    }

    // Initialize weights and biases
    for (let i = 0; i < layerSizes.length - 1; i++) {
      const inputSize = layerSizes[i];
      const outputSize = layerSizes[i + 1];

      // Xavier-like initialization
      const fanIn = inputSize;
      const scale = Math.sqrt(2.0 / fanIn);

      const w: number[][] = [];
      for (let j = 0; j < inputSize; j++) {
        const row: number[] = [];
        for (let k = 0; k < outputSize; k++) {
          // Box-Muller transform for normal distribution
          const u1 = random();
          const u2 = random();
          const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
          row.push(z * scale);
        }
        w.push(row);
      }
      this.weights.push(w);

      // Biases initialized to zero
      const b: number[] = new Array(outputSize).fill(0);
      this.biases.push(b);
    }
  }

  forward(x: number[]): number[] {
    this.activations = [x];
    this.preActivations = [];

    let activation = [...x];

    // Forward through each layer
    for (let layerIdx = 0; layerIdx < this.weights.length; layerIdx++) {
      const w = this.weights[layerIdx];
      const b = this.biases[layerIdx];
      const isOutputLayer = layerIdx === this.weights.length - 1;

      // Linear transformation: z = activation @ w + b
      const z: number[] = new Array(w[0].length).fill(0);
      for (let i = 0; i < activation.length; i++) {
        for (let j = 0; j < w[i].length; j++) {
          z[j] += activation[i] * w[i][j];
        }
      }
      for (let j = 0; j < b.length; j++) {
        z[j] += b[j];
      }

      this.preActivations.push(z);

      // Apply activation function
      if (isOutputLayer) {
        // Output layer is linear (sigmoid applied later)
        activation = z;
      } else {
        // Hidden layers use ReLU
        activation = z.map(val => Math.max(0, val));
      }

      this.activations.push(activation);
    }

    return activation;
  }

  backward(_x: number[], target: number[], confidencePenalty: number = 0): void {
    // Apply sigmoid to output for loss computation
    const outputPreSigmoid = this.activations[this.activations.length - 1];
    const outputArray = Array.isArray(outputPreSigmoid) ? outputPreSigmoid : [outputPreSigmoid];
    const output = sigmoid(outputArray) as number[];

    // Initialize gradients
    this.weightGrads = this.weights.map(w => w.map(row => new Array(row.length).fill(0)));
    this.biasGrads = this.biases.map(b => new Array(b.length).fill(0));

    // Gradient of BCE loss w.r.t. sigmoid output
    const eps = 1e-7;
    const p = output.map(val => Math.max(eps, Math.min(1 - eps, val)));
    let delta = target.map((y, i) => {
      // BCE gradient: -y/p + (1-y)/(1-p)
      let grad = (-y / p[i]) + ((1 - y) / (1 - p[i]));
      // Add confidence penalty gradient: d/dp[4p(1-p)] = 4(1-2p)
      if (confidencePenalty > 0) {
        grad += confidencePenalty * 4 * (1 - 2 * p[i]);
      }
      return grad;
    });

    // Gradient of sigmoid
    const dpDz = output.map(val => val * (1 - val));
    delta = delta.map((d, i) => d * dpDz[i]);

    // Backpropagate through layers (from output to input)
    for (let i = this.weights.length - 1; i >= 0; i--) {
      const activationIn = this.activations[i];

      // Weight gradient: outer product of activation and delta
      for (let j = 0; j < activationIn.length; j++) {
        for (let k = 0; k < delta.length; k++) {
          this.weightGrads[i][j][k] = activationIn[j] * delta[k];
        }
      }

      // Bias gradient
      this.biasGrads[i] = [...delta];

      // Propagate delta to previous layer
      if (i > 0) {
        const newDelta = new Array(activationIn.length).fill(0);
        for (let j = 0; j < activationIn.length; j++) {
          for (let k = 0; k < delta.length; k++) {
            newDelta[j] += delta[k] * this.weights[i][j][k];
          }
        }

        // Apply ReLU gradient
        const reluGrad = this.preActivations[i - 1].map(z => z > 0 ? 1 : 0);
        delta = newDelta.map((d, j) => d * reluGrad[j]);
      }
    }
  }

  step(learningRate: number): void {
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        for (let k = 0; k < this.weights[i][j].length; k++) {
          this.weights[i][j][k] -= learningRate * this.weightGrads[i][j][k];
        }
      }

      for (let j = 0; j < this.biases[i].length; j++) {
        this.biases[i][j] -= learningRate * this.biasGrads[i][j];
      }
    }
  }

  getState(): NetworkState {
    return {
      weights: this.weights.map(w => w.map(row => [...row])),
      biases: this.biases.map(b => [...b]),
      preActivations: this.preActivations.map(p => [...p]),
      activations: this.activations.map(a => [...a]),
      weightGrads: this.weightGrads.map(w => w.map(row => [...row])),
      biasGrads: this.biasGrads.map(b => [...b]),
    };
  }

  setState(state: NetworkState): void {
    this.weights = state.weights.map(w => w.map(row => [...row]));
    this.biases = state.biases.map(b => [...b]);
    this.preActivations = state.preActivations.map(p => [...p]);
    this.activations = state.activations.map(a => [...a]);
    this.weightGrads = state.weightGrads.map(w => w.map(row => [...row]));
    this.biasGrads = state.biasGrads.map(b => [...b]);
  }
}
