import type { DataPoint } from '../hooks/useTraining';

interface DataVisualizationProps {
  data: DataPoint[];
  compact?: boolean;
}

export function DataVisualization({ data, compact = false }: DataVisualizationProps) {
  const noisyCount = data.filter(d => d.isNoisy).length;

  if (compact) {
    // Scatter plot view
    const size = 150;
    const padding = 10;
    const plotSize = size - 2 * padding;

    return (
      <div className="bg-white rounded border border-gray-200 p-2">
        <div className="text-xs font-medium text-gray-600 mb-1">
          Training Data ({data.length} pts, {noisyCount} noisy)
        </div>
        <svg width={size} height={size} className="bg-gray-50 rounded">
          {/* Grid lines */}
          <line x1={padding + plotSize/2} y1={padding} x2={padding + plotSize/2} y2={padding + plotSize} stroke="#e5e7eb" strokeWidth="1" />
          <line x1={padding} y1={padding + plotSize/2} x2={padding + plotSize} y2={padding + plotSize/2} stroke="#e5e7eb" strokeWidth="1" />

          {/* Quadrant labels */}
          <text x={padding + plotSize*0.25} y={padding + plotSize*0.25} fontSize="8" fill="#9ca3af" textAnchor="middle">0</text>
          <text x={padding + plotSize*0.75} y={padding + plotSize*0.25} fontSize="8" fill="#9ca3af" textAnchor="middle">1</text>
          <text x={padding + plotSize*0.25} y={padding + plotSize*0.75} fontSize="8" fill="#9ca3af" textAnchor="middle">1</text>
          <text x={padding + plotSize*0.75} y={padding + plotSize*0.75} fontSize="8" fill="#9ca3af" textAnchor="middle">0</text>

          {/* Data points */}
          {data.map((point, idx) => {
            const x = padding + point.input[0] * plotSize;
            const y = padding + (1 - point.input[1]) * plotSize; // flip y
            const label = point.target[0];
            const isNoisy = point.isNoisy;

            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r={isNoisy ? 4 : 3}
                fill={label === 1 ? '#3b82f6' : '#ef4444'}
                stroke={isNoisy ? '#fbbf24' : 'none'}
                strokeWidth={isNoisy ? 2 : 0}
                opacity={0.7}
              />
            );
          })}
        </svg>
        <div className="flex gap-3 text-[10px] text-gray-500 mt-1 justify-center">
          <span><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span>Label=1</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>Label=0</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-gray-400 ring-2 ring-yellow-400 mr-1"></span>Noisy</span>
        </div>
      </div>
    );
  }

  // Table view
  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden">
      <div className="px-2 py-1 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
        Training Data ({data.length} samples, {noisyCount} noisy)
      </div>
      <div className="max-h-48 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-2 py-1 text-left text-gray-500">#</th>
              <th className="px-2 py-1 text-left text-gray-500">x₁</th>
              <th className="px-2 py-1 text-left text-gray-500">x₂</th>
              <th className="px-2 py-1 text-left text-gray-500">Label</th>
              <th className="px-2 py-1 text-left text-gray-500">True</th>
            </tr>
          </thead>
          <tbody>
            {data.map((point, idx) => (
              <tr
                key={idx}
                className={point.isNoisy ? 'bg-yellow-50' : ''}
              >
                <td className="px-2 py-0.5 text-gray-400">{idx}</td>
                <td className="px-2 py-0.5 font-mono">{point.input[0].toFixed(2)}</td>
                <td className="px-2 py-0.5 font-mono">{point.input[1].toFixed(2)}</td>
                <td className={`px-2 py-0.5 font-mono font-bold ${point.target[0] === 1 ? 'text-blue-600' : 'text-red-600'}`}>
                  {point.target[0]}
                  {point.isNoisy && <span className="ml-1 text-yellow-600">⚠</span>}
                </td>
                <td className="px-2 py-0.5 font-mono text-gray-400">{point.trueTarget[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
