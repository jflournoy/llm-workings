import { useState } from 'react';

export function Legend() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute bottom-2 right-2 bg-white/95 border border-gray-300 rounded shadow-sm text-xs">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 px-2 py-1 w-full hover:bg-gray-50"
      >
        <span className="text-gray-500">?</span>
        <span className="font-medium">Legend</span>
        <span className="text-gray-400 ml-auto">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="px-2 pb-2 pt-1 border-t border-gray-200 space-y-2">
          <div>
            <div className="font-semibold text-gray-700 mb-1">Nodes</div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#dcfce7] border border-black"></span>
                <span>Input</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#fef3c7] border border-black"></span>
                <span>Hidden (active)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#d1d5db] border border-black"></span>
                <span>Hidden (=0)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#fecaca] border border-black"></span>
                <span>Output</span>
              </div>
            </div>
          </div>

          <div>
            <div className="font-semibold text-gray-700 mb-1">Edges</div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-blue-500"></span>
                <span>Positive weight</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-red-500"></span>
                <span>Negative weight</span>
              </div>
              <div className="text-gray-500">Thickness = |weight|</div>
            </div>
          </div>

          <div className="text-gray-500 pt-1 border-t border-gray-100">
            Hover edges for weight & gradient
          </div>
        </div>
      )}
    </div>
  );
}
