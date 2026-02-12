---
title: Neural Network Visualizer
description: Interactive step-through of neural network training on the XOR problem
---

# Interactive Neural Network Visualizer

Step through neural network training and see **every computation** in mathematical detail.

## Try It Now

<div class="demo-full-width">
<iframe
  src="/understanding-llms/demos/neural-network/index.html"
  width="100%"
  height="900px"
  frameborder="0"
  style="border: 1px solid #e5e7eb; border-radius: 8px; margin: 1rem 0;"
  loading="lazy"
></iframe>
</div>

::: tip
Try adjusting the learning rate slider and watch how it affects convergence!
:::

## What This Demo Teaches

### 1. How Neural Networks Learn

Watch a network solve the XOR problem from random initialization:
- **Initial state**: Random weights, terrible predictions
- **Training**: Gradual weight adjustments via backpropagation
- **Convergence**: Network learns the correct pattern

### 2. Forward Pass in Detail

See each computation step:
```
Input layer → Hidden layer:
  z₀ = x₀ · w₀₀ + x₁ · w₁₀ + b₀
  a₀ = sigmoid(z₀)

Hidden layer → Output:
  z_out = a₀ · w₀₀ + a₁ · w₀₁ + ... + b_out
  prediction = sigmoid(z_out)
```

Every value is shown with actual numbers.

### 3. Backward Pass (Backpropagation)

See how errors propagate backward:
```
Output error → Hidden layer error → Weight gradients
```

The chain rule is made explicit at each step.

### 4. Why Hidden Layers Matter

XOR is not linearly separable:
- **Without hidden layer**: Cannot solve XOR
- **With hidden layer**: Network creates new features (intermediate representations)
- **Visualization**: See how hidden neurons create separable representations

## Features

### Interactive Controls

- **Step-by-step**: Move forward/backward through training
- **Play/Pause**: Watch training in real-time or at your own pace
- **Reset**: Start over with new random weights
- **Randomize**: Try different initializations
- **Learning rate**: Adjust from 0.01 to 2.0

### Training Data Options

- **Data size**: 50 to 500 training examples
- **Noise level**: 0% to 50% label corruption
- **Confidence penalty**: Push predictions toward 0 or 1
- **Regenerate**: Create new random datasets

### Multiple Visualizations

**Network Graph**:
- Nodes show activations
- Edges show weights (color = sign, thickness = magnitude)
- Click edges to see detailed gradient info

**Computation Panel**:
- Forward pass step-by-step
- Loss calculation
- Backward pass gradients
- Notation glossary

**Data Visualization**:
- Scatter plot of training points
- Table view of all samples
- Noisy samples highlighted

**Parameter Graphs**:
- Weight evolution over time
- Loss curve
- Path strength analysis

**Predictions Panel**:
- Network output on canonical XOR points
- Accuracy and loss metrics

## Understanding the Architecture

### Network Structure: 2 → 4 → 1

**Input layer** (2 neurons):
- Takes two binary inputs (0 or 1)

**Hidden layer** (4 neurons):
- Creates intermediate representations
- Learns features like "AND" and "OR"
- Uses sigmoid activation

**Output layer** (1 neuron):
- Combines hidden features
- Produces final prediction (0 to 1)

### Why 4 Hidden Neurons?

Could solve XOR with 2-3 hidden neurons, but 4 provides:
- More capacity for learning
- Clearer visualization of path strengths
- Redundancy for noisy data

## Common Questions

### Why does loss sometimes increase?

**Reasons**:
1. Learning rate too high → overshooting optima
2. Noisy training data → memorizing wrong patterns
3. Stochastic training → batch-to-batch variance

**Experiment**: Lower the learning rate and watch convergence smooth out.

### Why do some weights grow very large?

**Answer**: The network is becoming confident. Large weights → steep sigmoid → predictions close to 0 or 1.

**Experiment**: Enable "confidence penalty" to discourage extreme weights.

### What are path strengths?

**Path strength** = product of weights along a path from input to output.

**Example**: Input x₀ → Hidden h₂ → Output
```
Path strength = w[0→2] × w[2→out]
```

Strong paths dominate the network's computation.

**Experiment**: Click "Parameter Graphs" tab to see path evolution.

## Learning Exercises

### Beginner

1. **Watch one full training run**: Observe loss decreasing
2. **Inspect final weights**: Which paths matter most?
3. **Reset and compare**: Do different random starts converge to similar solutions?

### Intermediate

1. **Learning rate experiments**:
   - Try 0.1 (default), 0.5, 1.0, 2.0
   - When does training become unstable?

2. **Data size impact**:
   - Train with 50 vs 500 samples
   - Does more data always help?

3. **Noise robustness**:
   - Add 10%, 20%, 30% noise
   - At what point does learning fail?

### Advanced

1. **Hypothesis testing**:
   - Form a hypothesis (e.g., "larger learning rate = faster convergence")
   - Test it systematically
   - Analyze results

2. **Path analysis**:
   - Identify the dominant path at convergence
   - What does this path compute?
   - Why is it stronger than others?

3. **Initialization sensitivity**:
   - Run 10 training sessions
   - Do they all find similar solutions?
   - What varies? What stays constant?

## Technical Implementation

### Pure TypeScript

No ML libraries - everything implemented from scratch:
- Forward pass computation
- Backpropagation algorithm
- Weight updates
- Loss calculation

**Why?** Understanding the implementation is part of the learning.

### Testing

Comprehensive test suite ensures correctness:
- Forward pass produces correct shapes
- Gradients computed accurately
- Weight updates applied correctly
- Loss decreases over training

[View the tests](https://github.com/jflournoy/llm-workings/blob/main/web/src/network/Network.test.ts)

### Source Code

All code is open source:
- **Network logic**: [`web/src/network/Network.ts`](https://github.com/jflournoy/llm-workings/blob/main/web/src/network/Network.ts)
- **Visualization**: [`web/src/components/`](https://github.com/jflournoy/llm-workings/tree/main/web/src/components)
- **State management**: [`web/src/hooks/useTraining.ts`](https://github.com/jflournoy/llm-workings/blob/main/web/src/hooks/useTraining.ts)

## Next Steps

After mastering this demo:

1. **Read the implementation**: See how backprop works in code
2. **Explore the learnings**: [What we discovered](/guide/learnings) while building this
3. **Try modifying it**: Fork the code and experiment
4. **Wait for more demos**: Attention mechanisms coming soon!

## Feedback

Found a bug? Have a feature idea? Something confusing?

[Open an issue on GitHub](https://github.com/jflournoy/llm-workings/issues) to help improve this learning tool!

---

*This visualizer is part of the [LLM Workings learning project](/guide/) exploring neural networks and language models from the inside out.*
