---
title: Guide
description: Understanding the LLM Workings learning project
---

# Project Guide

Welcome to the LLM Workings learning project! This is a hands-on exploration of how language models actually work - not just how to use them as tools, but understanding their internal mechanisms, representations, and behaviors.

## Philosophy

This project takes a **learn-by-doing approach**. Rather than just reading research papers, we build implementations, run experiments, and develop intuitions through direct interaction with models and their components.

### Key Principles

- **Hands-on first**: Code and experiment before diving deep into theory
- **Start small**: Begin with simple neural networks before tackling transformers
- **Build tools**: Create visualizations and analysis tools to aid understanding
- **Document learnings**: Capture insights, mistakes, and patterns as we go

## What You'll Find Here

### [Goals & Motivation](./goals)
Why this project exists and what areas we're exploring - from basic neural network fundamentals to advanced interpretability techniques.

### [What We've Built](./built)
Concrete implementations and tools created so far, including an interactive neural network visualizer and custom development workflows.

### [What Comes Next](./next)
The roadmap ahead - planned experiments, open questions, and future directions for exploration.

### [Key Learnings](./learnings)
Important insights and discoveries from the development process, including technical findings and workflow improvements.

### [Development Patterns](./patterns)
Best practices and patterns that emerged while building this project, particularly around using Claude Code for learning.

## Technical Constraints

This project operates under real-world constraints:

- **12GB GPU** - All experiments must fit in local memory
- **Smaller models** - Focus on GPT-2, Pythia, small Llama variants
- **Python-based** - PyTorch, TransformerLens, standard ML stack
- **Local development** - Everything runs on local hardware

These constraints are features, not bugs - they force us to understand models deeply and make thoughtful choices about what to explore.

## Getting Started

If you're interested in following along or contributing:

1. **Explore the demos** - Start with the [Interactive Neural Network Visualizer](/demos/neural-network) to see training in action
2. **Read the learnings** - Check out [key insights](/guide/learnings) from experiments so far
3. **Review the code** - Browse the [GitHub repository](https://github.com/jflournoy/llm-workings) to see implementations
4. **Understand the workflow** - Learn about the [development practices](/development/) that make this work

## About This Learning Journey

This is a personal learning project, built in public. The goal isn't to create production-ready tools or publish novel research - it's to develop a deep, intuitive understanding of how language models work by building them, probing them, and experimenting with them.

If you're on a similar learning journey, hopefully these notes, code, and tools prove useful!
