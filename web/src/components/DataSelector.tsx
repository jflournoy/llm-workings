
interface DataSelectorProps {
  selectedIdx: number;
  data: Array<{ input: number[]; target: number[] }>;
  onSelect: (idx: number) => void;
}

export function DataSelector({ selectedIdx, data, onSelect }: DataSelectorProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-sm font-bold mb-2">Training Examples</h3>
      <div className="flex flex-wrap gap-2">
        {data.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
              selectedIdx === idx
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title={`Input: [${item.input.join(', ')}] → Target: ${item.target[0]}`}
          >
            [{item.input.join(',')}] → {item.target[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
