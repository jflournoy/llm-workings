---
title: Interactive Demos
description: Hands-on visualizations for understanding neural networks and LLMs
---

# Interactive Demos

Learn by doing with interactive visualizations that make abstract concepts concrete.

## Available Demos

### [Neural Network Visualizer](./neural-network)

**Step through neural network training on the XOR problem**

See every detail of how a neural network learns:
- Forward pass computation with full mathematical notation
- Backward propagation showing gradient flow
- Weight updates in real-time
- Loss evolution over training epochs

**Why XOR?** It's the simplest problem that requires a hidden layer, making it perfect for understanding how neural networks learn non-linear representations.

[Launch the visualizer →](./neural-network)

## Coming Soon

### Attention Mechanism Visualizer

Explore how transformer attention works:
- Query, key, value transformations
- Attention weight computation
- Multi-head attention patterns
- Position-aware attention

**Status**: Planned for next phase

### Transformer Block Visualizer

See a complete transformer layer in action:
- Residual stream flow
- Layer normalization effects
- MLP transformations
- Complete forward and backward passes

**Status**: Designing architecture

### Sparse Autoencoder Explorer

Discover interpretable features in neural networks:
- Feature activation patterns
- Neuron polysemanticity
- Feature steering
- Activation reconstruction

**Status**: Research phase

## How These Demos Help Learning

### Make Math Visual

Equations are abstract - watching computations happen step-by-step makes them concrete.

**Example**: Seeing `z = wx + b` as actual numbers flowing through a network is more intuitive than reading the formula.

### Enable Experimentation

Interactive controls let you explore "what if?" questions:
- What if I increase the learning rate 10x?
- What if I add noise to the training data?
- What if I reset just one weight?

### Build Intuition

Repeated interaction with visualizations develops **intuitive understanding** that reading alone cannot provide.

## Design Philosophy

All demos follow these principles:

### 1. Show Everything

No black boxes - every computation is visible and explained.

### 2. Interactive Controls

Users can experiment, not just watch. Play, pause, step forward/backward, adjust parameters.

### 3. Educational Focus

Designed for learning, not production use. Clarity over performance.

### 4. Self-Contained

Run entirely in browser - no backend, no installation, no setup.

### 5. Source Available

All demo code is open source - learn by reading the implementation too.

## Technical Stack

Built with modern web technologies:

- **React 19** - UI components and state management
- **TypeScript** - Type safety and documentation
- **Vite** - Fast development and optimized builds
- **TailwindCSS** - Styling and responsive design
- **KaTeX** - Mathematical notation rendering
- **Vitest** - Testing framework

**Why web-based?**
- Shareable (just send a URL)
- No installation required
- Works on any device with a browser
- Easy to iterate and update

## Using the Demos

### For Self-Study

1. **Start with the basics**: Neural Network Visualizer
2. **Experiment actively**: Change parameters, observe results
3. **Form hypotheses**: Predict what will happen before clicking
4. **Verify understanding**: Can you explain what you see?

### For Teaching

- **Live demonstrations**: Show training dynamics in real-time
- **Student exploration**: Let learners experiment freely
- **Discussion prompts**: "Why did the loss spike?" "What would happen if...?"

### For Research

- **Prototyping visualizations**: Fork and modify for your own use
- **Testing hypotheses**: Quick experiments without writing code
- **Communicating ideas**: Share URLs to show concepts

## Contributing

Interested in building new demos or improving existing ones?

1. [Browse the source code](https://github.com/jflournoy/llm-workings/tree/main/web)
2. [Open an issue](https://github.com/jflournoy/llm-workings/issues) with demo ideas
3. [Submit a pull request](https://github.com/jflournoy/llm-workings/pulls) with improvements

## Feedback

Found a bug? Have a feature request? Confused by something?

[Open an issue on GitHub](https://github.com/jflournoy/llm-workings/issues) - all feedback helps improve these learning tools!

---

*New demos are added as the project evolves. Check back for updates!*
