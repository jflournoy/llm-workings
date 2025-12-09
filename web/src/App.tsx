import { useState, useMemo } from 'react';
import { useTraining } from './hooks/useTraining';
import { NetworkVisualization, type EdgeSelection, type NodeSelection } from './components/NetworkVisualization';
import { TrainingControls } from './components/TrainingControls';
import { ComputationPanel } from './components/ComputationPanel';
import { PredictionsPanel } from './components/PredictionsPanel';
import { ParameterGraphs } from './components/ParameterGraphs';
import { DataVisualization } from './components/DataVisualization';
import { Tabs } from './components/Tabs';
import { sigmoid, binaryCrossEntropy, confidencePenalty as calcConfidencePenalty } from './network/functions';

type RightPanelTab = 'graphs' | 'math' | 'data';

const TABS = [
  { id: 'graphs', label: 'Graphs' },
  { id: 'math', label: 'Step-by-Step Math' },
  { id: 'data', label: 'Training Data' },
];

function App() {
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>('graphs');
  const [selectedEdge, setSelectedEdge] = useState<EdgeSelection | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeSelection | null>(null);

  const {
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
    cleanXorData,
  } = useTraining();

  const currentStep = training.steps[training.currentStep];
  // Use clean XOR data for selected input display (the 4 canonical points)
  const selectedData = cleanXorData[training.selectedInputIdx];

  // Compute live accuracy on clean XOR (matches what PredictionsPanel shows)
  // Use training object as dependency (new reference on each state update)
  const liveAccuracy = useMemo(() => {
    let correct = 0;
    for (const { input, target } of cleanXorData) {
      const output = training.network.forward(input);
      const sigmoidOutput = sigmoid(output as number[]) as number[];
      const predicted = sigmoidOutput[0] >= 0.5 ? 1 : 0;
      if (predicted === target[0]) correct++;
    }
    return correct / cleanXorData.length;
  }, [training, cleanXorData]);

  // Compute live training loss (with confidence penalty if enabled)
  const liveLoss = useMemo(() => {
    let totalLoss = 0;
    for (const { input, target } of trainingData) {
      const output = training.network.forward(input);
      const sigmoidOutput = sigmoid(output as number[]) as number[];
      let loss = binaryCrossEntropy(sigmoidOutput, target);
      if (confidencePenalty > 0) {
        loss += confidencePenalty * calcConfidencePenalty(sigmoidOutput);
      }
      totalLoss += loss;
    }
    return totalLoss / trainingData.length;
  }, [training, trainingData, confidencePenalty]);

  // Count noisy samples
  const noisyCount = useMemo(() => {
    return trainingData.filter(d => d.isNoisy).length;
  }, [trainingData]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Neural Network Visualizer: XOR
            </h1>
            <p className="text-xs text-gray-500">
              Step through training to see weights, activations, and gradients
            </p>
          </div>
          <div className="text-right text-sm">
            <span className="text-gray-500">Step </span>
            <span className="font-mono font-bold">{training.currentStep}/{training.steps.length - 1}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-gray-500">Train Loss </span>
            <span className="font-mono font-bold text-blue-600">{liveLoss.toFixed(4)}</span>
            {noisyCount > 0 && (
              <>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-yellow-600 font-mono font-bold">{noisyCount} noisy</span>
              </>
            )}
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-gray-500">Accuracy </span>
            <span className={`font-mono font-bold ${liveAccuracy === 1 ? 'text-green-600' : 'text-orange-600'}`}>
              {(liveAccuracy * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </header>

      {/* Controls Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0 space-y-2">
        {/* Training Controls */}
        <TrainingControls
          step={training.currentStep}
          maxSteps={training.steps.length}
          loss={currentStep.loss}
          isPlaying={training.isPlaying}
          currentInput={selectedData.input}
          currentTarget={selectedData.target}
          learningRate={learningRate}
          onLearningRateChange={setLearningRate}
          onPrev={() => goToStep(training.currentStep - 1)}
          onNext={() => {
            if (training.currentStep === training.steps.length - 1) {
              trainStep();
            } else {
              goToStep(training.currentStep + 1);
            }
          }}
          onReset={reset}
          onRandomize={randomize}
          onTogglePlay={() => setIsPlaying(!training.isPlaying)}
          onGoToStep={goToStep}
        />

        {/* Data Controls */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-gray-500 font-medium">Data:</span>

          <div className="flex items-center gap-1">
            <span className="text-gray-500">Noise:</span>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.05"
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
              className="w-20 h-1"
              title="Proportion of labels that get randomly flipped"
            />
            <span className="font-mono w-10">{(noiseLevel * 100).toFixed(0)}%</span>
          </div>

          <div className="flex items-center gap-1 border-l border-gray-300 pl-2">
            <span className="text-gray-500">Samples:</span>
            <select
              value={numSamples}
              onChange={(e) => setNumSamples(parseInt(e.target.value))}
              className="px-1 py-0.5 border border-gray-300 rounded bg-white"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
            </select>
          </div>

          <div className="flex items-center gap-1 border-l border-gray-300 pl-2">
            <span className="text-gray-500">Confidence Penalty:</span>
            <select
              value={confidencePenalty}
              onChange={(e) => setConfidencePenalty(parseFloat(e.target.value))}
              className="px-1 py-0.5 border border-gray-300 rounded bg-white"
              title="Penalize uncertain predictions (close to 0.5). Higher values push toward confident 0 or 1."
            >
              <option value={0}>Off</option>
              <option value={0.1}>0.1 (mild)</option>
              <option value={0.25}>0.25</option>
              <option value={0.5}>0.5</option>
              <option value={1.0}>1.0 (strong)</option>
              <option value={2.0}>2.0 (aggressive)</option>
            </select>
          </div>

          <button
            onClick={regenerateData}
            className="px-2 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
            title="Generate new random data with same settings"
          >
            🔄 New Data
          </button>

          <span className="text-gray-400 ml-2">
            ({trainingData.filter(d => d.isNoisy).length} noisy samples)
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-hidden">
        <div className="h-full flex gap-4">
          {/* Left: Network Visualization */}
          <div className="flex-[3] h-full min-h-0 min-w-0">
            <NetworkVisualization
              network={training.network}
              state={currentStep.state}
              currentInput={selectedData.input}
              currentTarget={selectedData.target}
              selectedEdge={selectedEdge}
              onEdgeSelect={(edge) => {
                setSelectedEdge(edge);
                setSelectedNode(null);
                if (edge) setRightPanelTab('graphs');
              }}
              selectedNode={selectedNode}
              onNodeSelect={(node) => {
                setSelectedNode(node);
                setSelectedEdge(null);
                if (node) setRightPanelTab('graphs');
              }}
            />
          </div>

          {/* Right Panel */}
          <div className="flex-[2] h-full min-h-0 min-w-0 flex flex-col gap-3 overflow-hidden">
            {/* Predictions - always visible */}
            <div className="flex-shrink-0">
              <PredictionsPanel
                network={training.network}
                xorData={cleanXorData}
                selectedIdx={training.selectedInputIdx}
                onSelect={setSelectedInput}
              />
            </div>

            {/* Tabbed content */}
            <div className="flex-1 min-h-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Tabs
                tabs={TABS}
                activeTab={rightPanelTab}
                onChange={(id) => setRightPanelTab(id as RightPanelTab)}
              >
                {rightPanelTab === 'graphs' && (
                  <ParameterGraphs
                    steps={training.steps}
                    currentStep={training.currentStep}
                    onStepClick={goToStep}
                    selectedEdge={selectedEdge}
                    selectedNode={selectedNode}
                    onClearSelection={() => {
                      setSelectedEdge(null);
                      setSelectedNode(null);
                    }}
                  />
                )}

                {rightPanelTab === 'math' && (
                  <div className="p-3 overflow-auto h-full">
                    <ComputationPanel
                      network={training.network}
                      state={currentStep.state}
                      currentInput={selectedData.input}
                      currentTarget={selectedData.target}
                    />
                  </div>
                )}

                {rightPanelTab === 'data' && (
                  <div className="p-3 overflow-auto h-full">
                    <div className="flex gap-4">
                      <DataVisualization data={trainingData} compact />
                      <DataVisualization data={trainingData} />
                    </div>
                  </div>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
