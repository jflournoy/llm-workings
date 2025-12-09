import { useState } from 'react';
import type { Network, NetworkState } from '../network/Network';
import { sigmoid } from '../network/functions';

interface ComputationPanelProps {
  network: Network;
  state: NetworkState;
  currentInput: number[];
  currentTarget: number[];
}

export function ComputationPanel({
  network,
  state,
  currentInput,
  currentTarget,
}: ComputationPanelProps) {
  const [showGlossary, setShowGlossary] = useState(false);
  const [showForward, setShowForward] = useState(true);
  const [showLoss, setShowLoss] = useState(true);
  const [showBackward, setShowBackward] = useState(true);
  const [showUpdate, setShowUpdate] = useState(true);

  // Use the state's stored values (these reflect the selected input)
  const output = sigmoid(state.activations[state.activations.length - 1]) as number[];
  const prediction = output[0];
  const target = currentTarget[0];

  // Compute loss
  const eps = 1e-7;
  const p = Math.max(eps, Math.min(1 - eps, prediction));
  const loss = -(target * Math.log(p) + (1 - target) * Math.log(1 - p));

  // For displaying gradients, use the stored gradients from state
  const weightGrads = state.weightGrads;
  const biasGrads = state.biasGrads;

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold">Step-by-Step Math</h2>
        <div className="text-xs bg-blue-100 px-2 py-1 rounded">
          Input: [{currentInput.join(', ')}] → Target: {target}
        </div>
      </div>

      {/* Glossary */}
      <div className="mb-3 bg-gray-50 rounded border border-gray-200">
        <button
          onClick={() => setShowGlossary(!showGlossary)}
          className="w-full px-2 py-1 text-left text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center justify-between"
        >
          <span>📖 Notation Glossary</span>
          <span className="text-gray-400">{showGlossary ? '▼' : '▶'}</span>
        </button>
        {showGlossary && (
          <div className="px-2 pb-2 grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs">
            <div className="space-y-0.5">
              <p><span className="font-mono font-bold text-blue-700">z</span> = pre-activation (weighted sum)</p>
              <p><span className="font-mono font-bold text-green-700">a</span> = activation (after activation fn)</p>
              <p><span className="font-mono font-bold text-purple-700">W, w</span> = weights</p>
              <p><span className="font-mono font-bold text-purple-700">b</span> = bias</p>
            </div>
            <div className="space-y-0.5">
              <p><span className="font-mono font-bold text-red-700">δ</span> = error signal (backprop)</p>
              <p><span className="font-mono font-bold text-red-700">∂L/∂x</span> = gradient of loss w.r.t. x</p>
              <p><span className="font-mono font-bold text-orange-700">σ</span> = sigmoid</p>
              <p><span className="font-mono font-bold text-green-700">η</span> = learning rate</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* Forward Pass */}
        <div className="bg-blue-50 rounded border border-blue-200">
          <button
            onClick={() => setShowForward(!showForward)}
            className="w-full px-2 py-1 text-left font-bold text-blue-700 flex items-center justify-between"
          >
            <span>⬇️ Forward Pass</span>
            <span className="text-blue-400 text-xs">{showForward ? '▼' : '▶'}</span>
          </button>

          {showForward && (
            <div className="px-2 pb-2 space-y-2">
              {network.layerSizes.map((_, layerIdx) => {
                if (layerIdx === 0) return null;

                const w = state.weights[layerIdx - 1];
                const b = state.biases[layerIdx - 1];
                const prevActivation = state.activations[layerIdx - 1];
                const z = state.preActivations[layerIdx - 1];
                const a = state.activations[layerIdx];
                const isOutputLayer = layerIdx === network.layerSizes.length - 1;

                return (
                  <div key={layerIdx} className="bg-white p-2 rounded border border-blue-100 text-xs">
                    <p className="font-bold text-blue-900 mb-1">
                      Layer {layerIdx} {isOutputLayer ? '(Output)' : '(Hidden)'}
                    </p>

                    {/* Show one example computation, then summarize */}
                    <div className="font-mono text-gray-700 space-y-1">
                      <p className="text-gray-500">z = W·a + b</p>
                      {z.slice(0, 2).map((zVal, j) => {
                        const terms = prevActivation.map((aVal, i) =>
                          `${aVal.toFixed(2)}×${w[i][j].toFixed(2)}`
                        ).join(' + ');
                        return (
                          <p key={j}>
                            z[{j}] = ({terms}) + {b[j].toFixed(2)} = <span className="font-bold text-blue-700">{zVal.toFixed(3)}</span>
                          </p>
                        );
                      })}
                      {z.length > 2 && <p className="text-gray-400">... ({z.length - 2} more)</p>}

                      <p className="text-gray-500 mt-1">
                        a = {isOutputLayer ? 'σ(z)' : 'ReLU(z)'}
                      </p>
                      {isOutputLayer ? (
                        <p>σ({z[0].toFixed(3)}) = <span className="font-bold text-orange-700">{output[0].toFixed(4)}</span></p>
                      ) : (
                        a.slice(0, 2).map((aVal, j) => (
                          <p key={j}>
                            max(0, {z[j].toFixed(3)}) = <span className="font-bold text-green-700">{aVal.toFixed(3)}</span>
                          </p>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Loss */}
        <div className="bg-green-50 rounded border border-green-200">
          <button
            onClick={() => setShowLoss(!showLoss)}
            className="w-full px-2 py-1 text-left font-bold text-green-700 flex items-center justify-between"
          >
            <span>📊 Loss (BCE)</span>
            <span className="text-green-400 text-xs">{showLoss ? '▼' : '▶'}</span>
          </button>

          {showLoss && (
            <div className="px-2 pb-2 text-xs">
              <div className="bg-white p-2 rounded border border-green-100 font-mono space-y-1">
                <p className="text-gray-600">L = -[y·ln(p) + (1-y)·ln(1-p)]</p>
                <p>y = {target}, p = {prediction.toFixed(4)}</p>
                <p>L = -[{target}·ln({prediction.toFixed(4)}) + {1-target}·ln({(1-prediction).toFixed(4)})]</p>
                <p className="font-bold text-green-700">L = {loss.toFixed(4)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Backward Pass - THE MAIN ADDITION */}
        <div className="bg-red-50 rounded border border-red-200">
          <button
            onClick={() => setShowBackward(!showBackward)}
            className="w-full px-2 py-1 text-left font-bold text-red-700 flex items-center justify-between"
          >
            <span>⬆️ Backward Pass (Gradients)</span>
            <span className="text-red-400 text-xs">{showBackward ? '▼' : '▶'}</span>
          </button>

          {showBackward && (
            <div className="px-2 pb-2 space-y-2 text-xs">
              {/* Step 1: Output layer error */}
              <div className="bg-white p-2 rounded border border-red-100">
                <p className="font-bold text-red-800 mb-1">Step 1: Output Error (δ_output)</p>
                <p className="text-gray-600 mb-1">For BCE + sigmoid, the gradient simplifies to:</p>
                <div className="font-mono space-y-1 bg-red-50 p-1 rounded">
                  <p>δ_out = ∂L/∂z_out = p - y</p>
                  <p>δ_out = {prediction.toFixed(4)} - {target} = <span className="font-bold text-red-700">{(prediction - target).toFixed(4)}</span></p>
                </div>
                <p className="text-gray-500 mt-1 text-[10px]">
                  (This comes from chain rule: ∂L/∂p × ∂p/∂z = [-y/p + (1-y)/(1-p)] × [σ(z)(1-σ(z))] = p - y)
                </p>
              </div>

              {/* Step 2: Output layer gradients */}
              <div className="bg-white p-2 rounded border border-red-100">
                <p className="font-bold text-red-800 mb-1">Step 2: Output Layer Weight Gradients</p>
                <p className="text-gray-600 mb-1">Each weight gradient = input activation × δ</p>

                <div className="font-mono space-y-1">
                  <p className="text-gray-500">∂L/∂w[i][0] = a[i] × δ_out</p>
                  {state.activations[state.activations.length - 2]?.slice(0, 3).map((aVal, i) => {
                    const grad = weightGrads[weightGrads.length - 1]?.[i]?.[0] ?? 0;
                    return (
                      <p key={i}>
                        ∂L/∂w[{i}][0] = {aVal.toFixed(3)} × {(prediction - target).toFixed(4)} = <span className="font-bold text-red-700">{grad.toFixed(4)}</span>
                      </p>
                    );
                  })}
                  {(state.activations[state.activations.length - 2]?.length ?? 0) > 3 && (
                    <p className="text-gray-400">... (more weights)</p>
                  )}
                </div>

                <p className="text-gray-600 mt-2 mb-1">Bias gradient = δ directly:</p>
                <div className="font-mono">
                  <p>∂L/∂b[0] = δ_out = <span className="font-bold text-red-700">{(biasGrads[biasGrads.length - 1]?.[0] ?? 0).toFixed(4)}</span></p>
                </div>
              </div>

              {/* Step 3: Backpropagate to hidden layer */}
              {weightGrads.length > 1 && (
                <div className="bg-white p-2 rounded border border-red-100">
                  <p className="font-bold text-red-800 mb-1">Step 3: Backpropagate to Hidden Layer</p>
                  <p className="text-gray-600 mb-1">Propagate error through weights, apply ReLU gradient:</p>

                  <div className="font-mono space-y-1 bg-red-50 p-1 rounded mb-2">
                    <p>δ_hidden[j] = (Σ w[j][k] × δ_next[k]) × ReLU'(z[j])</p>
                    <p className="text-gray-500 text-[10px]">where ReLU'(z) = 1 if z &gt; 0, else 0</p>
                  </div>

                  <p className="text-gray-600 mb-1">For each hidden node:</p>
                  <div className="font-mono space-y-1">
                    {state.preActivations[0]?.slice(0, 3).map((zVal, j) => {
                      const w_to_output = state.weights[1]?.[j]?.[0] ?? 0;
                      const delta_out = prediction - target;
                      const relu_grad = zVal > 0 ? 1 : 0;
                      const delta_hidden = w_to_output * delta_out * relu_grad;
                      return (
                        <p key={j}>
                          δ[{j}] = {w_to_output.toFixed(3)} × {delta_out.toFixed(4)} × {relu_grad} = <span className="font-bold text-red-700">{delta_hidden.toFixed(4)}</span>
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Hidden layer weight gradients */}
              {weightGrads.length > 1 && (
                <div className="bg-white p-2 rounded border border-red-100">
                  <p className="font-bold text-red-800 mb-1">Step 4: Hidden Layer Weight Gradients</p>
                  <p className="text-gray-600 mb-1">Same formula: input × δ</p>

                  <div className="font-mono space-y-1">
                    <p className="text-gray-500">∂L/∂w[i][j] = a_input[i] × δ_hidden[j]</p>
                    {/* Show a few example gradients */}
                    {currentInput.slice(0, 2).map((inputVal, i) => (
                      <p key={i}>
                        ∂L/∂w[{i}][0] = {inputVal.toFixed(1)} × δ[0] = <span className="font-bold text-red-700">{(weightGrads[0]?.[i]?.[0] ?? 0).toFixed(4)}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Matrix Form */}
              <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                <p className="font-bold text-yellow-800 mb-1">📐 Matrix Form (How Libraries Do It)</p>
                <div className="font-mono text-[10px] space-y-1">
                  <p className="text-gray-700">For layer L with input A and output Z:</p>
                  <p className="bg-white p-1 rounded">δ_L = ∂L/∂Z_L (error at layer L)</p>
                  <p className="bg-white p-1 rounded">∂L/∂W_L = A_prev<sup>T</sup> @ δ_L</p>
                  <p className="bg-white p-1 rounded">∂L/∂b_L = sum(δ_L, axis=0)</p>
                  <p className="bg-white p-1 rounded">δ_{'{L-1}'} = (δ_L @ W_L<sup>T</sup>) ⊙ activation'(Z_{'{L-1}'})</p>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  @ = matrix multiply, ⊙ = element-wise multiply, T = transpose
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Weight Update */}
        <div className="bg-purple-50 rounded border border-purple-200">
          <button
            onClick={() => setShowUpdate(!showUpdate)}
            className="w-full px-2 py-1 text-left font-bold text-purple-700 flex items-center justify-between"
          >
            <span>🔄 Weight Update (SGD)</span>
            <span className="text-purple-400 text-xs">{showUpdate ? '▼' : '▶'}</span>
          </button>

          {showUpdate && (
            <div className="px-2 pb-2 text-xs">
              <div className="bg-white p-2 rounded border border-purple-100 font-mono space-y-1">
                <p className="text-gray-600">w_new = w_old - η × ∂L/∂w</p>
                <p className="text-gray-600">b_new = b_old - η × ∂L/∂b</p>
                <p className="text-gray-500 mt-1">where η = learning rate (typically 0.1 - 1.0)</p>

                <div className="mt-2 pt-2 border-t border-purple-100">
                  <p className="text-purple-700 font-bold">Example (one weight):</p>
                  {state.weights[0]?.[0] && (
                    <>
                      <p>w[0][0]_old = {state.weights[0][0][0].toFixed(4)}</p>
                      <p>∂L/∂w[0][0] = {(weightGrads[0]?.[0]?.[0] ?? 0).toFixed(4)}</p>
                      <p>w[0][0]_new = {state.weights[0][0][0].toFixed(4)} - η × {(weightGrads[0]?.[0]?.[0] ?? 0).toFixed(4)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
