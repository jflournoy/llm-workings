import { useMemo, useState } from 'react';
import type { Network, NetworkState } from '../network/Network';
import { sigmoid } from '../network/functions';
import { Legend } from './Legend';

export interface EdgeSelection {
  layerIdx: number;
  fromIdx: number;
  toIdx: number;
}

export interface NodeSelection {
  layerIdx: number;
  nodeIdx: number;
}

interface NetworkVisualizationProps {
  network: Network;
  state: NetworkState;
  currentInput: number[];
  currentTarget: number[];
  selectedEdge?: EdgeSelection | null;
  onEdgeSelect?: (edge: EdgeSelection | null) => void;
  selectedNode?: NodeSelection | null;
  onNodeSelect?: (node: NodeSelection | null) => void;
}

export function NetworkVisualization({
  network,
  state,
  currentInput,
  selectedEdge,
  onEdgeSelect,
  selectedNode,
  onNodeSelect,
}: NetworkVisualizationProps) {
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

  const nodeRadius = 30;

  const positions = useMemo(() => {
    const layerSizes = network.layerSizes;
    const nodeHeight = 90;
    const horizontalSpacing = 220;

    const pos: Record<string, { x: number; y: number }> = {};

    layerSizes.forEach((size, layerIdx) => {
      const x = 60 + layerIdx * horizontalSpacing;
      const totalHeight = size * nodeHeight;
      const startY = (600 - totalHeight) / 2;

      for (let nodeIdx = 0; nodeIdx < size; nodeIdx++) {
        const y = startY + nodeIdx * nodeHeight;
        pos[`${layerIdx}-${nodeIdx}`] = { x, y };
      }
    });

    return pos;
  }, [network.layerSizes]);

  const svgWidth = 60 + (network.layerSizes.length - 1) * 220 + 100;
  const svgHeight = 600;

  // Compute output with sigmoid
  const forwardOutput = network.forward(currentInput);
  const output = (sigmoid(forwardOutput as number[]) as number[]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="relative flex-1 min-h-0">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full border border-gray-300 rounded bg-gray-50"
          preserveAspectRatio="xMidYMid meet"
        >
        {/* Draw edges (weights) */}
        {network.weights.map((layerWeights, layerIdx) => {
          return layerWeights.map((weights, fromIdx) =>
            weights.map((weight, toIdx) => {
              const fromKey = `${layerIdx}-${fromIdx}`;
              const toKey = `${layerIdx + 1}-${toIdx}`;
              const fromPos = positions[fromKey];
              const toPos = positions[toKey];

              if (!fromPos || !toPos) return null;

              const isPositive = weight > 0;
              const color = isPositive ? '#3b82f6' : '#ef4444';
              const alpha = Math.min(0.9, 0.2 + Math.abs(weight) / 5);
              const strokeWidth = Math.max(1.5, 0.5 + Math.abs(weight) * 0.5); // Min width for visibility

              const edgeId = `${fromKey}-${toKey}`;
              const isHovered = hoveredEdge === edgeId;
              const isSelected = selectedEdge?.layerIdx === layerIdx &&
                selectedEdge?.fromIdx === fromIdx &&
                selectedEdge?.toIdx === toIdx;

              return (
                <g
                  key={edgeId}
                  onMouseEnter={() => setHoveredEdge(edgeId)}
                  onMouseLeave={() => setHoveredEdge(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEdgeSelect) {
                      if (isSelected) {
                        onEdgeSelect(null);
                      } else {
                        onEdgeSelect({ layerIdx, fromIdx, toIdx });
                      }
                    }
                  }}
                  style={{ cursor: 'pointer', pointerEvents: 'all' }}
                >
                  {/* Invisible wider hit area for easier clicking */}
                  <line
                    x1={fromPos.x + nodeRadius}
                    y1={fromPos.y + nodeRadius}
                    x2={toPos.x + nodeRadius}
                    y2={toPos.y + nodeRadius}
                    stroke="transparent"
                    strokeWidth={12}
                    pointerEvents="stroke"
                  />
                  {/* Selection highlight */}
                  {isSelected && (
                    <line
                      x1={fromPos.x + nodeRadius}
                      y1={fromPos.y + nodeRadius}
                      x2={toPos.x + nodeRadius}
                      y2={toPos.y + nodeRadius}
                      stroke="#f97316"
                      strokeWidth={strokeWidth * 3 + 4}
                      opacity={0.4}
                    />
                  )}
                  <line
                    x1={fromPos.x + nodeRadius}
                    y1={fromPos.y + nodeRadius}
                    x2={toPos.x + nodeRadius}
                    y2={toPos.y + nodeRadius}
                    stroke={isSelected ? '#f97316' : color}
                    strokeWidth={isHovered || isSelected ? strokeWidth * 2 : strokeWidth}
                    opacity={isSelected ? 1 : alpha}
                  />
                  {isHovered && (
                    <text
                      x={(fromPos.x + toPos.x) / 2 + nodeRadius}
                      y={(fromPos.y + toPos.y) / 2}
                      fontSize="10"
                      fill="black"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      w={weight.toFixed(2)}
                      {state.weightGrads[layerIdx] &&
                        ` ∇${state.weightGrads[layerIdx][fromIdx][toIdx].toFixed(2)}`}
                    </text>
                  )}
                </g>
              );
            })
          );
        })}

        {/* Draw nodes */}
        {network.layerSizes.map((size, layerIdx) => {
          return Array.from({ length: size }).map((_, nodeIdx) => {
            const key = `${layerIdx}-${nodeIdx}`;
            const pos = positions[key];
            if (!pos) return null;

            let value: number;
            let label: string;
            let color: string;
            const hasBias = layerIdx > 0; // Hidden and output nodes have biases
            const isNodeSelected = selectedNode?.layerIdx === layerIdx && selectedNode?.nodeIdx === nodeIdx;

            if (layerIdx === 0) {
              // Input layer
              value = currentInput[nodeIdx];
              label = `x${nodeIdx}\n${value.toFixed(2)}`;
              color = '#dcfce7';
            } else if (layerIdx === network.layerSizes.length - 1) {
              // Output layer - show both raw and sigmoid
              // Use network's current preActivations after forward pass
              const rawOutput = network.preActivations[layerIdx - 1]?.[nodeIdx] ?? 0;
              value = output[nodeIdx];
              label = `out\nraw: ${rawOutput.toFixed(2)}\nσ: ${value.toFixed(3)}`;
              color = '#fecaca';
            } else {
              // Hidden layer - show weighted inputs from each source node and pre-activation
              // Use network's current state after forward pass (not stored state)
              const preAct = network.preActivations[layerIdx - 1]?.[nodeIdx] ?? 0;
              value = network.activations[layerIdx]?.[nodeIdx] ?? 0;

              // Calculate weighted inputs from each source node
              // Use currentInput for layer 0, otherwise use network's activations
              const prevActivations = layerIdx === 1 ? currentInput : network.activations[layerIdx - 1];
              const weightsToThis = network.weights[layerIdx - 1];
              const weightedInputA = prevActivations[0] * (weightsToThis?.[0]?.[nodeIdx] ?? 0);
              const weightedInputB = prevActivations[1] * (weightsToThis?.[1]?.[nodeIdx] ?? 0);

              label = `h${nodeIdx}\na: ${weightedInputA.toFixed(2)}\nb: ${weightedInputB.toFixed(2)}\npre: ${preAct.toFixed(2)}`;
              // Color intensity based on activation - gray when dead (ReLU=0, i.e. pre < 0)
              color = preAct > 0 ? '#fef3c7' : '#e5e7eb';
            }

            return (
              <g
                key={key}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasBias && onNodeSelect) {
                    if (isNodeSelected) {
                      onNodeSelect(null);
                    } else {
                      onNodeSelect({ layerIdx, nodeIdx });
                    }
                  }
                }}
                style={{ cursor: hasBias ? 'pointer' : 'default', pointerEvents: 'all' }}
              >
                {/* Selection ring */}
                {isNodeSelected && (
                  <circle
                    cx={pos.x + nodeRadius}
                    cy={pos.y + nodeRadius}
                    r={nodeRadius + 6}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="4"
                    opacity="0.6"
                  />
                )}
                <circle
                  cx={pos.x + nodeRadius}
                  cy={pos.y + nodeRadius}
                  r={nodeRadius}
                  fill={isNodeSelected ? '#fed7aa' : color}
                  stroke={isNodeSelected ? '#f97316' : 'black'}
                  strokeWidth={isNodeSelected ? 3 : 2}
                />
                <text
                  x={pos.x + nodeRadius}
                  y={pos.y + nodeRadius}
                  fontSize="10"
                  fill="black"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none"
                >
                  {label.split('\n').map((line, i, arr) => (
                    <tspan
                      key={i}
                      x={pos.x + nodeRadius}
                      dy={i === 0 ? -((arr.length - 1) * 5) : 11}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          });
        })}
        </svg>
        <Legend />
      </div>
    </div>
  );
}
