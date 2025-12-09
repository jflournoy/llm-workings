import { useMemo, useState, useEffect } from 'react';
import type { TrainingStep } from '../hooks/useTraining';
import type { EdgeSelection, NodeSelection } from './NetworkVisualization';

interface ParameterGraphsProps {
  steps: TrainingStep[];
  currentStep: number;
  onStepClick: (step: number) => void;
  selectedEdge?: EdgeSelection | null;
  selectedNode?: NodeSelection | null;
  onClearSelection?: () => void;
}

// Smaller dimensions for side-by-side graphs
const GRAPH_WIDTH = 170;
const GRAPH_HEIGHT = 120;
const PADDING = { top: 12, right: 8, bottom: 20, left: 32 };

type GraphType = 'loss' | 'weights' | 'biases' | 'weightGrads' | 'biasGrads';

const GRAPH_TYPES: { id: GraphType; label: string }[] = [
  { id: 'loss', label: 'Loss' },
  { id: 'weights', label: 'Weights' },
  { id: 'biases', label: 'Biases' },
  { id: 'weightGrads', label: '∇ Weights' },
  { id: 'biasGrads', label: '∇ Biases' },
];

const COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
  '#14b8a6', '#a855f7',
];

interface DataSeries {
  label: string;
  color: string;
  points: { x: number; y: number; value: number }[];
}

interface GraphData {
  series: DataSeries[];
  yMin: number;
  yMax: number;
  yLabel: string;
  title?: string;
}

// Reusable mini graph component
function MiniGraph({
  data,
  width,
  height,
  currentStep,
  totalSteps,
  onStepClick,
  showLegend = true,
}: {
  data: GraphData;
  width: number;
  height: number;
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
  showLegend?: boolean;
}) {
  const chartWidth = width - PADDING.left - PADDING.right;
  const chartHeight = height - PADDING.top - PADDING.bottom;

  const xPos = (step: number) =>
    PADDING.left + (totalSteps > 1 ? (step / (totalSteps - 1)) * chartWidth : chartWidth / 2);

  return (
    <div className="flex flex-col">
      {data.title && (
        <div className="text-xs font-medium text-gray-700 mb-1 text-center">{data.title}</div>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full bg-gray-50 border border-gray-200 rounded"
      >
        {/* Grid lines */}
        {[0, 0.5, 1].map((ratio) => {
          const y = PADDING.top + chartHeight * (1 - ratio);
          const value = data.yMin + (data.yMax - data.yMin) * ratio;
          return (
            <g key={ratio}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={width - PADDING.right}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={PADDING.left - 2}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="7"
                fill="#6b7280"
              >
                {Math.abs(value) < 0.01 && value !== 0 ? value.toExponential(0) : value.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Zero line */}
        {data.yMin < 0 && data.yMax > 0 && (
          <line
            x1={PADDING.left}
            y1={PADDING.top + chartHeight * (data.yMax / (data.yMax - data.yMin))}
            x2={width - PADDING.right}
            y2={PADDING.top + chartHeight * (data.yMax / (data.yMax - data.yMin))}
            stroke="#9ca3af"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
        )}

        {/* Data lines */}
        {data.series.map((s, idx) => {
          const pathD = s.points.length > 0
            ? s.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
            : '';
          return (
            <path
              key={idx}
              d={pathD}
              fill="none"
              stroke={s.color}
              strokeWidth="1.5"
              opacity={data.series.length > 6 ? 0.6 : 0.9}
            />
          );
        })}

        {/* Current step indicator */}
        <line
          x1={xPos(currentStep)}
          y1={PADDING.top}
          x2={xPos(currentStep)}
          y2={height - PADDING.bottom}
          stroke="#f97316"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />

        {/* Clickable overlay */}
        <rect
          x={PADDING.left}
          y={PADDING.top}
          width={chartWidth}
          height={chartHeight}
          fill="transparent"
          className="cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const ratio = x / rect.width;
            const step = Math.round(ratio * (totalSteps - 1));
            onStepClick(Math.max(0, Math.min(totalSteps - 1, step)));
          }}
        />

        {/* Y axis label */}
        <text
          x={6}
          y={height / 2}
          textAnchor="middle"
          fontSize="7"
          fill="#6b7280"
          transform={`rotate(-90, 6, ${height / 2})`}
        >
          {data.yLabel}
        </text>
      </svg>

      {/* Legend */}
      {showLegend && data.series.length > 1 && (
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs mt-1 justify-center">
          {data.series.map((s, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <span className="w-2 h-0.5 inline-block" style={{ backgroundColor: s.color }} />
              <span className="text-gray-600 font-mono text-[10px]">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ParameterGraphs({ steps, currentStep, onStepClick, selectedEdge, selectedNode, onClearSelection }: ParameterGraphsProps) {
  const [graphType, setGraphType] = useState<GraphType>('loss');

  useEffect(() => {
    if (selectedEdge) {
      setGraphType('weights');
    } else if (selectedNode) {
      setGraphType('biases');
    } else {
      // Reset to loss when nothing is selected
      setGraphType('loss');
    }
  }, [selectedEdge, selectedNode]);

  // Compute selected edge graphs (weight + gradient separately)
  const selectedEdgeData = useMemo(() => {
    if (!selectedEdge) return null;

    const { layerIdx, fromIdx, toIdx } = selectedEdge;
    const chartWidth = GRAPH_WIDTH - PADDING.left - PADDING.right;
    const chartHeight = GRAPH_HEIGHT - PADDING.top - PADDING.bottom;

    const xScale = (step: number) =>
      PADDING.left + (steps.length > 1 ? (step / (steps.length - 1)) * chartWidth : chartWidth / 2);

    // Weight data
    const weightValues = steps.map(s => s.state.weights[layerIdx][fromIdx][toIdx]);
    const wMin = Math.min(...weightValues);
    const wMax = Math.max(...weightValues);
    const wRange = wMax - wMin || 1;
    const wYScale = (val: number) => PADDING.top + chartHeight - ((val - wMin) / wRange) * chartHeight;

    const weightData: GraphData = {
      title: 'Weight',
      yLabel: 'w',
      yMin: wMin,
      yMax: wMax,
      series: [{
        label: `L${layerIdx}:${fromIdx}→${toIdx}`,
        color: COLORS[0],
        points: steps.map((s, i) => ({
          x: xScale(i),
          y: wYScale(s.state.weights[layerIdx][fromIdx][toIdx]),
          value: s.state.weights[layerIdx][fromIdx][toIdx],
        })),
      }],
    };

    // Gradient data
    const gradValues = steps.map(s => s.state.weightGrads[layerIdx]?.[fromIdx]?.[toIdx] ?? 0);
    const gMin = Math.min(...gradValues);
    const gMax = Math.max(...gradValues);
    const gRange = gMax - gMin || 1;
    const gYScale = (val: number) => PADDING.top + chartHeight - ((val - gMin) / gRange) * chartHeight;

    const gradData: GraphData = {
      title: 'Gradient',
      yLabel: '∇w',
      yMin: gMin,
      yMax: gMax,
      series: [{
        label: `∇L${layerIdx}:${fromIdx}→${toIdx}`,
        color: COLORS[1],
        points: steps.map((s, i) => ({
          x: xScale(i),
          y: gYScale(s.state.weightGrads[layerIdx]?.[fromIdx]?.[toIdx] ?? 0),
          value: s.state.weightGrads[layerIdx]?.[fromIdx]?.[toIdx] ?? 0,
        })),
      }],
    };

    return { weightData, gradData };
  }, [steps, selectedEdge]);

  // Compute selected node graphs (bias + bias gradient separately)
  const selectedNodeData = useMemo(() => {
    if (!selectedNode) return null;

    const { layerIdx, nodeIdx } = selectedNode;
    // Biases are indexed by layerIdx-1 (no bias for input layer)
    const biasLayerIdx = layerIdx - 1;
    if (biasLayerIdx < 0) return null;

    const chartWidth = GRAPH_WIDTH - PADDING.left - PADDING.right;
    const chartHeight = GRAPH_HEIGHT - PADDING.top - PADDING.bottom;

    const xScale = (step: number) =>
      PADDING.left + (steps.length > 1 ? (step / (steps.length - 1)) * chartWidth : chartWidth / 2);

    // Bias data
    const biasValues = steps.map(s => s.state.biases[biasLayerIdx]?.[nodeIdx] ?? 0);
    const bMin = Math.min(...biasValues);
    const bMax = Math.max(...biasValues);
    const bRange = bMax - bMin || 1;
    const bYScale = (val: number) => PADDING.top + chartHeight - ((val - bMin) / bRange) * chartHeight;

    const biasData: GraphData = {
      title: 'Bias',
      yLabel: 'b',
      yMin: bMin,
      yMax: bMax,
      series: [{
        label: `L${layerIdx}:b${nodeIdx}`,
        color: COLORS[2],
        points: steps.map((s, i) => ({
          x: xScale(i),
          y: bYScale(s.state.biases[biasLayerIdx]?.[nodeIdx] ?? 0),
          value: s.state.biases[biasLayerIdx]?.[nodeIdx] ?? 0,
        })),
      }],
    };

    // Bias gradient data
    const gradValues = steps.map(s => s.state.biasGrads[biasLayerIdx]?.[nodeIdx] ?? 0);
    const gMin = Math.min(...gradValues);
    const gMax = Math.max(...gradValues);
    const gRange = gMax - gMin || 1;
    const gYScale = (val: number) => PADDING.top + chartHeight - ((val - gMin) / gRange) * chartHeight;

    const gradData: GraphData = {
      title: 'Gradient',
      yLabel: '∇b',
      yMin: gMin,
      yMax: gMax,
      series: [{
        label: `∇L${layerIdx}:b${nodeIdx}`,
        color: COLORS[3],
        points: steps.map((s, i) => ({
          x: xScale(i),
          y: gYScale(s.state.biasGrads[biasLayerIdx]?.[nodeIdx] ?? 0),
          value: s.state.biasGrads[biasLayerIdx]?.[nodeIdx] ?? 0,
        })),
      }],
    };

    return { biasData, gradData };
  }, [steps, selectedNode]);

  // Compute main graph data (when no edge selected or for other graph types)
  const mainGraphData = useMemo(() => {
    const chartWidth = GRAPH_WIDTH * 2 + 8 - PADDING.left - PADDING.right; // Full width
    const chartHeight = GRAPH_HEIGHT - PADDING.top - PADDING.bottom;

    const xScale = (step: number) =>
      PADDING.left + (steps.length > 1 ? (step / (steps.length - 1)) * chartWidth : chartWidth / 2);

    let allSeries: DataSeries[] = [];
    let yLabel = '';

    if (graphType === 'loss') {
      allSeries = [{
        label: 'Loss',
        color: COLORS[0],
        points: steps.map((s, i) => ({ x: xScale(i), y: 0, value: s.loss })),
      }];
      yLabel = 'Loss';
    } else if (graphType === 'weights' && !selectedEdge) {
      let colorIdx = 0;
      steps[0]?.state.weights.forEach((layer, layerIdx) => {
        layer.forEach((fromWeights, fromIdx) => {
          fromWeights.forEach((_, toIdx) => {
            allSeries.push({
              label: `L${layerIdx}:${fromIdx}→${toIdx}`,
              color: COLORS[colorIdx % COLORS.length],
              points: steps.map((s, i) => ({
                x: xScale(i),
                y: 0,
                value: s.state.weights[layerIdx][fromIdx][toIdx],
              })),
            });
            colorIdx++;
          });
        });
      });
      yLabel = 'Weight';
    } else if (graphType === 'biases') {
      let colorIdx = 0;
      steps[0]?.state.biases.forEach((layer, layerIdx) => {
        layer.forEach((_, nodeIdx) => {
          allSeries.push({
            label: `L${layerIdx + 1}:b${nodeIdx}`,
            color: COLORS[colorIdx % COLORS.length],
            points: steps.map((s, i) => ({
              x: xScale(i),
              y: 0,
              value: s.state.biases[layerIdx][nodeIdx],
            })),
          });
          colorIdx++;
        });
      });
      yLabel = 'Bias';
    } else if (graphType === 'weightGrads' && !selectedEdge) {
      // Use weights structure (always exists) to iterate, then look up gradients
      let colorIdx = 0;
      steps[0]?.state.weights.forEach((layer, layerIdx) => {
        layer.forEach((fromWeights, fromIdx) => {
          fromWeights.forEach((_, toIdx) => {
            allSeries.push({
              label: `∇L${layerIdx}:${fromIdx}→${toIdx}`,
              color: COLORS[colorIdx % COLORS.length],
              points: steps.map((s, i) => ({
                x: xScale(i),
                y: 0,
                value: s.state.weightGrads[layerIdx]?.[fromIdx]?.[toIdx] ?? 0,
              })),
            });
            colorIdx++;
          });
        });
      });
      yLabel = '∇ Weight';
    } else if (graphType === 'biasGrads') {
      // Use biases structure (always exists) to iterate, then look up gradients
      let colorIdx = 0;
      steps[0]?.state.biases.forEach((layer, layerIdx) => {
        layer.forEach((_, nodeIdx) => {
          allSeries.push({
            label: `∇L${layerIdx + 1}:b${nodeIdx}`,
            color: COLORS[colorIdx % COLORS.length],
            points: steps.map((s, i) => ({
              x: xScale(i),
              y: 0,
              value: s.state.biasGrads[layerIdx]?.[nodeIdx] ?? 0,
            })),
          });
          colorIdx++;
        });
      });
      yLabel = '∇ Bias';
    }

    const allValues = allSeries.flatMap(s => s.points.map(p => p.value));
    const yMin = Math.min(...allValues, 0);
    const yMax = Math.max(...allValues, 0.1);
    const yRange = yMax - yMin || 1;

    const yScale = (val: number) =>
      PADDING.top + chartHeight - ((val - yMin) / yRange) * chartHeight;

    allSeries.forEach(series => {
      series.points.forEach(p => {
        p.y = yScale(p.value);
      });
    });

    return { series: allSeries, yMin, yMax, yLabel };
  }, [steps, graphType, selectedEdge]);

  const showEdgeGraphs = selectedEdge && (graphType === 'weights' || graphType === 'weightGrads');
  const showNodeGraphs = selectedNode && (graphType === 'biases' || graphType === 'biasGrads');

  return (
    <div className="p-2 h-full flex flex-col overflow-hidden">
      {/* Selection indicator */}
      {(selectedEdge || selectedNode) && (
        <div className="flex items-center justify-between mb-2 px-2 py-1 bg-orange-50 border border-orange-200 rounded text-xs flex-shrink-0">
          <span className="text-orange-700">
            {selectedEdge && (
              <span className="font-mono font-bold">Edge L{selectedEdge.layerIdx}:{selectedEdge.fromIdx}→{selectedEdge.toIdx}</span>
            )}
            {selectedNode && (
              <span className="font-mono font-bold">Node L{selectedNode.layerIdx}:h{selectedNode.nodeIdx}</span>
            )}
          </span>
          <button
            onClick={onClearSelection}
            className="text-orange-600 hover:text-orange-800 font-medium"
          >
            × Clear
          </button>
        </div>
      )}

      {/* Graph type selector */}
      <div className="flex gap-1 mb-2 flex-wrap flex-shrink-0">
        {GRAPH_TYPES.map(gt => (
          <button
            key={gt.id}
            onClick={() => setGraphType(gt.id)}
            className={`px-2 py-0.5 text-xs rounded transition-colors ${
              graphType === gt.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {gt.label}
          </button>
        ))}
      </div>

      {/* Graphs */}
      <div className="flex-1 min-h-0 overflow-auto">
        {showEdgeGraphs && selectedEdgeData ? (
          <div className="flex gap-2">
            <div className="flex-1">
              <MiniGraph
                data={selectedEdgeData.weightData}
                width={GRAPH_WIDTH}
                height={GRAPH_HEIGHT}
                currentStep={currentStep}
                totalSteps={steps.length}
                onStepClick={onStepClick}
                showLegend={false}
              />
            </div>
            <div className="flex-1">
              <MiniGraph
                data={selectedEdgeData.gradData}
                width={GRAPH_WIDTH}
                height={GRAPH_HEIGHT}
                currentStep={currentStep}
                totalSteps={steps.length}
                onStepClick={onStepClick}
                showLegend={false}
              />
            </div>
          </div>
        ) : showNodeGraphs && selectedNodeData ? (
          <div className="flex gap-2">
            <div className="flex-1">
              <MiniGraph
                data={selectedNodeData.biasData}
                width={GRAPH_WIDTH}
                height={GRAPH_HEIGHT}
                currentStep={currentStep}
                totalSteps={steps.length}
                onStepClick={onStepClick}
                showLegend={false}
              />
            </div>
            <div className="flex-1">
              <MiniGraph
                data={selectedNodeData.gradData}
                width={GRAPH_WIDTH}
                height={GRAPH_HEIGHT}
                currentStep={currentStep}
                totalSteps={steps.length}
                onStepClick={onStepClick}
                showLegend={false}
              />
            </div>
          </div>
        ) : (
          <div>
            <svg
              viewBox={`0 0 ${GRAPH_WIDTH * 2 + 8} ${GRAPH_HEIGHT}`}
              className="w-full bg-gray-50 border border-gray-200 rounded"
            >
              {/* Grid lines */}
              {[0, 0.5, 1].map((ratio) => {
                const chartHeight = GRAPH_HEIGHT - PADDING.top - PADDING.bottom;
                const y = PADDING.top + chartHeight * (1 - ratio);
                const value = mainGraphData.yMin + (mainGraphData.yMax - mainGraphData.yMin) * ratio;
                return (
                  <g key={ratio}>
                    <line
                      x1={PADDING.left}
                      y1={y}
                      x2={GRAPH_WIDTH * 2 + 8 - PADDING.right}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                    <text
                      x={PADDING.left - 2}
                      y={y}
                      textAnchor="end"
                      dominantBaseline="middle"
                      fontSize="8"
                      fill="#6b7280"
                    >
                      {Math.abs(value) < 0.01 && value !== 0 ? value.toExponential(0) : value.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* Zero line */}
              {mainGraphData.yMin < 0 && mainGraphData.yMax > 0 && (
                <line
                  x1={PADDING.left}
                  y1={PADDING.top + (GRAPH_HEIGHT - PADDING.top - PADDING.bottom) * (mainGraphData.yMax / (mainGraphData.yMax - mainGraphData.yMin))}
                  x2={GRAPH_WIDTH * 2 + 8 - PADDING.right}
                  y2={PADDING.top + (GRAPH_HEIGHT - PADDING.top - PADDING.bottom) * (mainGraphData.yMax / (mainGraphData.yMax - mainGraphData.yMin))}
                  stroke="#9ca3af"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                />
              )}

              {/* Data lines */}
              {mainGraphData.series.map((s, idx) => {
                const pathD = s.points.length > 0
                  ? s.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
                  : '';
                return (
                  <path
                    key={idx}
                    d={pathD}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="1.5"
                    opacity={mainGraphData.series.length > 6 ? 0.6 : 0.9}
                  />
                );
              })}

              {/* Current step indicator */}
              {steps.length > 0 && (
                <line
                  x1={PADDING.left + (steps.length > 1 ? (currentStep / (steps.length - 1)) * (GRAPH_WIDTH * 2 + 8 - PADDING.left - PADDING.right) : (GRAPH_WIDTH * 2 + 8 - PADDING.left - PADDING.right) / 2)}
                  y1={PADDING.top}
                  x2={PADDING.left + (steps.length > 1 ? (currentStep / (steps.length - 1)) * (GRAPH_WIDTH * 2 + 8 - PADDING.left - PADDING.right) : (GRAPH_WIDTH * 2 + 8 - PADDING.left - PADDING.right) / 2)}
                  y2={GRAPH_HEIGHT - PADDING.bottom}
                  stroke="#f97316"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
              )}

              {/* Clickable overlay */}
              <rect
                x={PADDING.left}
                y={PADDING.top}
                width={GRAPH_WIDTH * 2 + 8 - PADDING.left - PADDING.right}
                height={GRAPH_HEIGHT - PADDING.top - PADDING.bottom}
                fill="transparent"
                className="cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const ratio = x / rect.width;
                  const step = Math.round(ratio * (steps.length - 1));
                  onStepClick(Math.max(0, Math.min(steps.length - 1, step)));
                }}
              />

              {/* Y axis label */}
              <text
                x={8}
                y={GRAPH_HEIGHT / 2}
                textAnchor="middle"
                fontSize="9"
                fill="#6b7280"
                transform={`rotate(-90, 8, ${GRAPH_HEIGHT / 2})`}
              >
                {mainGraphData.yLabel}
              </text>
            </svg>

            {/* Legend */}
            {mainGraphData.series.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px 12px',
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                }}
              >
                {mainGraphData.series.map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: s.color,
                        borderRadius: '2px',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#374151' }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-1 text-xs text-gray-500 flex justify-between flex-shrink-0">
        <span>Step: {currentStep}/{steps.length - 1}</span>
        {graphType === 'loss' && (
          <span>Loss: {steps[currentStep]?.loss.toFixed(4)}</span>
        )}
        {showEdgeGraphs && selectedEdgeData && (
          <span>
            w={selectedEdgeData.weightData.series[0].points[currentStep]?.value.toFixed(3)} |
            ∇={selectedEdgeData.gradData.series[0].points[currentStep]?.value.toFixed(3)}
          </span>
        )}
        {showNodeGraphs && selectedNodeData && (
          <span>
            b={selectedNodeData.biasData.series[0].points[currentStep]?.value.toFixed(3)} |
            ∇={selectedNodeData.gradData.series[0].points[currentStep]?.value.toFixed(3)}
          </span>
        )}
      </div>
    </div>
  );
}
