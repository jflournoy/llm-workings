import { useEffect, useState } from 'react';

interface TrainingControlsProps {
  step: number;
  maxSteps: number;
  loss: number;
  isPlaying: boolean;
  currentInput: number[];
  currentTarget: number[];
  learningRate: number;
  onLearningRateChange: (lr: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onRandomize: () => void;
  onTogglePlay: () => void;
  onGoToStep: (step: number) => void;
}

// Speed values in ms (lower = faster)
const SPEED_OPTIONS = [
  { label: '0.25x', delay: 400 },
  { label: '0.5x', delay: 200 },
  { label: '1x', delay: 100 },
  { label: '2x', delay: 50 },
  { label: '4x', delay: 25 },
  { label: '10x', delay: 10 },
];

const LEARNING_RATE_OPTIONS = [0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.0, 5.0];

export function TrainingControls({
  step,
  maxSteps,
  isPlaying,
  learningRate,
  onLearningRateChange,
  onPrev,
  onNext,
  onReset,
  onRandomize,
  onTogglePlay,
  onGoToStep,
}: TrainingControlsProps) {
  const [speedIdx, setSpeedIdx] = useState(2); // Default to 1x (100ms)
  const currentSpeed = SPEED_OPTIONS[speedIdx];

  // Auto-step when playing
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      onNext();
    }, currentSpeed.delay);

    return () => clearTimeout(timer);
  }, [isPlaying, onNext, currentSpeed.delay]);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Playback controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onReset}
          className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
          title="Reset to initial state (seed 123)"
        >
          Reset
        </button>
        <button
          onClick={onRandomize}
          className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
          title="New random initialization"
        >
          🎲 Random
        </button>
        <button
          onClick={onPrev}
          disabled={step === 0}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          ◀ Prev
        </button>
        <button
          onClick={onNext}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next ▶
        </button>
        <button
          onClick={onTogglePlay}
          className={`px-2 py-1 text-xs text-white rounded ${
            isPlaying
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-1 border-l border-gray-300 pl-2">
        <span className="text-xs text-gray-500">Speed:</span>
        <select
          value={speedIdx}
          onChange={(e) => setSpeedIdx(parseInt(e.target.value))}
          className="text-xs px-1 py-0.5 border border-gray-300 rounded bg-white"
        >
          {SPEED_OPTIONS.map((opt, idx) => (
            <option key={idx} value={idx}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Learning rate control */}
      <div className="flex items-center gap-1 border-l border-gray-300 pl-2">
        <span className="text-xs text-gray-500">Learn Rate:</span>
        <select
          value={learningRate}
          onChange={(e) => onLearningRateChange(parseFloat(e.target.value))}
          className="text-xs px-1 py-0.5 border border-gray-300 rounded bg-white"
          title="Learning rate - higher values make bigger updates (can help escape plateaus)"
        >
          {LEARNING_RATE_OPTIONS.map((lr) => (
            <option key={lr} value={lr}>
              {lr}
            </option>
          ))}
        </select>
      </div>

      {/* Step slider */}
      <input
        type="range"
        min="0"
        max={maxSteps - 1}
        value={step}
        onChange={(e) => onGoToStep(parseInt(e.target.value))}
        className="flex-1 h-1 min-w-[100px]"
      />
    </div>
  );
}
