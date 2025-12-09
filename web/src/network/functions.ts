/**
 * Activation functions and loss functions for neural network
 */

export function sigmoid(x: number): number;
export function sigmoid(x: number[]): number[];
export function sigmoid(x: number | number[]): number | number[] {
  if (typeof x === 'number') {
    return 1 / (1 + Math.exp(-x));
  }
  return x.map(val => 1 / (1 + Math.exp(-val)));
}

export function relu(x: number): number;
export function relu(x: number[]): number[];
export function relu(x: number | number[]): number | number[] {
  if (typeof x === 'number') {
    return Math.max(0, x);
  }
  return x.map(val => Math.max(0, val));
}

export function binaryCrossEntropy(predicted: number[], target: number[]): number {
  const eps = 1e-7;
  let sum = 0;

  for (let i = 0; i < predicted.length; i++) {
    const p = Math.max(eps, Math.min(1 - eps, predicted[i]));
    sum += -(target[i] * Math.log(p) + (1 - target[i]) * Math.log(1 - p));
  }

  return sum / predicted.length;
}

/**
 * Confidence penalty: 4 * p * (1-p)
 * Returns 0 when p=0 or p=1, max value of 1 when p=0.5
 */
export function confidencePenalty(predicted: number[]): number {
  let sum = 0;
  for (const p of predicted) {
    sum += 4 * p * (1 - p);
  }
  return sum / predicted.length;
}

/**
 * BCE + confidence penalty
 * The penalty encourages the network to make confident predictions
 */
export function bceWithConfidencePenalty(
  predicted: number[],
  target: number[],
  penaltyStrength: number = 1.0
): number {
  return binaryCrossEntropy(predicted, target) + penaltyStrength * confidencePenalty(predicted);
}

export function sigmoidDerivative(output: number): number {
  return output * (1 - output);
}

export function reluDerivative(preActivation: number): number {
  return preActivation > 0 ? 1 : 0;
}
