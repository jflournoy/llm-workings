import type { Network } from '../network/Network';
import { sigmoid } from '../network/functions';

interface XORData {
  input: number[];
  target: number[];
}

interface PredictionsPanelProps {
  network: Network;
  xorData: XORData[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
}

export function PredictionsPanel({
  network,
  xorData,
  selectedIdx,
  onSelect,
}: PredictionsPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <h3 className="text-sm font-bold text-gray-700 mb-2">Predictions</h3>
      <div className="grid grid-cols-2 gap-2">
        {xorData.map((data, idx) => {
          const outputArray = network.forward(data.input);
          const sigmoidOutput = sigmoid(outputArray as number[]);
          const output = Array.isArray(sigmoidOutput) ? sigmoidOutput[0] : sigmoidOutput;
          const correct = Math.abs(output - data.target[0]) < 0.5;
          const isSelected = idx === selectedIdx;

          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={`p-2 rounded border text-left transition-all ${
                isSelected
                  ? 'ring-2 ring-blue-500 border-blue-300'
                  : ''
              } ${
                correct
                  ? 'border-green-400 bg-green-50 hover:bg-green-100'
                  : 'border-red-400 bg-red-50 hover:bg-red-100'
              }`}
            >
              <div className="font-mono text-xs font-bold text-gray-900">
                [{data.input.join(',')}] → {data.target[0]}
              </div>
              <div className="text-xs text-gray-700">
                <span className="font-bold text-blue-700">{output.toFixed(3)}</span>
                <span className={`ml-1 font-bold ${correct ? 'text-green-700' : 'text-red-700'}`}>
                  {correct ? '✓' : '✗'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
