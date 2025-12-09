import { describe, it, expect } from 'vitest';
import { Network } from './Network';
import { sigmoid } from './functions';

const CLEAN_XOR = [
  { input: [0, 0], target: [0] },
  { input: [0, 1], target: [1] },
  { input: [1, 0], target: [1] },
  { input: [1, 1], target: [0] },
];

function computeAccuracy(net: Network): number {
  let correct = 0;
  for (const { input, target } of CLEAN_XOR) {
    const output = net.forward(input);
    const sigmoidOutput = sigmoid(output as number[]) as number[];
    const predicted = sigmoidOutput[0] >= 0.5 ? 1 : 0;
    if (predicted === target[0]) correct++;
  }
  return correct / CLEAN_XOR.length;
}

describe('Network PRNG', () => {
  it('should produce different weights for different seeds', () => {
    const net1 = new Network([2, 4, 1], 123);
    const net2 = new Network([2, 4, 1], 456);

    // First weight should be different
    expect(net1.weights[0][0][0]).not.toBe(net2.weights[0][0][0]);
  });

  it('should produce same weights for same seed', () => {
    const net1 = new Network([2, 4, 1], 123);
    const net2 = new Network([2, 4, 1], 123);

    expect(net1.weights[0][0][0]).toBe(net2.weights[0][0][0]);
  });

  it('should produce different predictions for different seeds', () => {
    const net1 = new Network([2, 4, 1], 100);
    const net2 = new Network([2, 4, 1], 200);

    const output1 = net1.forward([0.5, 0.5]);
    const output2 = net2.forward([0.5, 0.5]);

    expect(output1[0]).not.toBe(output2[0]);
  });
});

describe('Clean XOR accuracy', () => {
  it('should vary across different seeds', () => {
    const accuracies = new Set<number>();

    // Test 20 different seeds
    for (let seed = 1; seed <= 20; seed++) {
      const net = new Network([2, 4, 1], seed * 1000);
      const acc = computeAccuracy(net);
      accuracies.add(acc);
    }

    // Should have more than just 25% accuracy across all seeds
    console.log('Accuracies found:', Array.from(accuracies));
    expect(accuracies.size).toBeGreaterThan(1);
  });

  it('seed 123 should have some specific accuracy', () => {
    const net = new Network([2, 4, 1], 123);
    const acc = computeAccuracy(net);
    console.log('Seed 123 accuracy:', acc, '=', acc * 100, '%');
    console.log('Predictions:');
    for (const { input, target } of CLEAN_XOR) {
      const output = net.forward(input);
      const sigmoidOutput = sigmoid(output as number[]) as number[];
      console.log(`  [${input}] -> ${sigmoidOutput[0].toFixed(4)} (target: ${target[0]})`);
    }
    // Just log, don't assert specific value yet
    expect(acc).toBeGreaterThanOrEqual(0);
  });
});
