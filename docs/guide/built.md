---
title: What We've Built
description: Implementations, tools, and infrastructure created so far
---

# What We've Built

## Interactive Neural Network Visualizer

**[Try the demo →](/demos/neural-network)**

A fully functional web application that lets you step through neural network training on the XOR problem. This isn't just a static visualization - it's an interactive learning tool that shows every detail of the training process.

### Features

- **Step-by-step training**: Move forward/backward through training iterations
- **Network visualization**: See the architecture with real-time weight updates
- **Forward pass breakdown**: Mathematical notation showing each computation
- **Backward pass detail**: Gradient calculations with the chain rule made explicit
- **Loss tracking**: Watch how error decreases over training
- **Interactive controls**: Play, pause, reset, adjust learning rate, add noise

### Technical Implementation

Built with React 18 + TypeScript + Vite:

- Pure TypeScript neural network (no ML libraries)
- KaTeX for mathematical notation rendering
- SVG-based network visualization
- Fully client-side - runs entirely in browser
- Comprehensive test suite with Vitest

**Why it matters**: Understanding backpropagation is fundamental to understanding how any neural network (including transformers) learns. This visualizer makes the abstract math concrete and interactive.

## Python Neural Network Implementation

**Location**: [`src/network.py`](https://github.com/jflournoy/llm-workings/blob/main/src/network.py)

A from-scratch implementation of a feedforward neural network in pure NumPy:

- Forward and backward pass with detailed intermediate values
- Sigmoid activation and binary cross-entropy loss
- Configurable architecture (layers, neurons, learning rate)
- Training history tracking for analysis
- Visualization utilities using matplotlib

**Tests**: Comprehensive pytest suite in [`tests/test_network.py`](https://github.com/jflournoy/llm-workings/blob/main/tests/test_network.py)

**Why it matters**: Implementing backprop by hand (no PyTorch/TensorFlow magic) forces you to understand exactly what's happening at each step.

## Development Infrastructure

### Test-Driven Development Workflow

All code in this project follows TDD:

- **RED**: Write failing test that defines desired behavior
- **GREEN**: Implement minimal code to pass
- **REFACTOR**: Improve with safety net of passing tests

Example: The web visualizer's Network class has 100% test coverage before any UI was built.

### Custom Claude Code Commands

16 custom commands for streamlined development:

- `/hygiene` - Quick project health check
- `/commit` - Atomic commits with quality checks
- `/tdd` - TDD workflow guidance
- `/docs` - Documentation maintenance
- `/next` - AI-recommended priorities

[See all commands →](/development/commands)

### Claude Code Agents

Specialized agents for analysis tasks:

- **documentation-auditor** - Ensures docs quality
- **session-insights** - Analyzes development patterns
- **next-priorities** - Recommends what to work on
- **test-coverage-advisor** - Identifies testing gaps

[Learn about agents →](/development/agent-patterns)

### Token Efficiency Optimization

Through npm script delegation and command optimization:

- **87-91% token reduction** in common operations
- Fast command execution (< 1 second for most)
- Consistent, reliable results

[Read more →](/development/token-efficiency)

## Python Tooling

### Visualization Utilities

**Location**: [`src/visualize.py`](https://github.com/jflournoy/llm-workings/blob/main/src/visualize.py)

Functions for analyzing and visualizing neural network training:

- `plot_training()` - Loss curves and weight evolution
- `draw_network()` - Network graph with weights/gradients
- `draw_training_steps()` - Network state at key milestones
- `plot_biases()` - Bias evolution through training

### Testing Infrastructure

- **Python**: pytest with coverage tracking
- **TypeScript**: Vitest for unit and integration tests
- **CI/CD**: GitHub Actions for automated testing

## Documentation

### Project Documentation

- **README.md** - Project overview and goals
- **PLAN.md** - Detailed design for web visualizer
- **LEARNINGS.md** - Captured insights and patterns
- **AGENTS.md** - Guide to commands vs agents

### Development Guides

12 comprehensive guides covering:

- TDD with Claude Code
- Best practices for AI-assisted development
- Token efficiency patterns
- Command and agent patterns
- Self-updating documentation

[Browse development docs →](/development/)

## What This Enables

With these foundations in place, we can:

1. **Experiment rapidly** - TDD and testing infrastructure catch regressions
2. **Visualize concepts** - Interactive tools make abstract ideas concrete
3. **Document learnings** - Custom commands make it easy to capture insights
4. **Build incrementally** - Each piece builds on tested, working code

## Source Code

All code is open source and available on GitHub:

**Repository**: [github.com/jflournoy/llm-workings](https://github.com/jflournoy/llm-workings)

- `src/` - Python neural network implementation
- `web/` - Interactive web visualizer
- `tests/` - Python test suite
- `.claude/` - Custom commands and agents
- `docs/` - This documentation site

## Next Steps

Now that we have working tools and visualizations, what comes next?

[See the roadmap →](./next)
