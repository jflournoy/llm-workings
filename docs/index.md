---
layout: home

hero:
  name: "LLM Workings"
  text: "A hands-on exploration of how language models work"
  tagline: Understanding the internals of large language models - not just how to use them, but how they represent and process information
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View Demos
      link: /demos/neural-network
    - theme: alt
      text: Development Docs
      link: /development/

features:
  - title: Architecture Fundamentals
    details: Explore transformer layers, attention mechanisms, residual streams, and MLPs to understand how language models are built
    icon: 🏗️
  - title: Representations & Learning
    details: Investigate how information from training corpora gets encoded into weights and activations through hands-on experiments
    icon: 🧠
  - title: Interpretability Techniques
    details: Apply probing, sparse autoencoders, activation patching, and steering vectors to understand what models learn
    icon: 🔬
  - title: Interactive Demos
    details: Step through neural network training with full visualization of forward passes, gradients, and weight updates
    icon: 🎮
---

## Current Status

This is an active learning project, building understanding through code and experimentation. The focus is on **smaller models** (GPT-2, Pythia, Llama-2-7B) that fit on a 12GB GPU, allowing for local development and hands-on exploration.

### What's Been Built

- **Interactive Neural Network Visualizer**: Step-by-step visualization of XOR training with full mathematical detail
- **Python Neural Network**: From-scratch implementation for understanding fundamentals
- **Custom Development Workflow**: Claude Code commands and agents for TDD-driven learning

[Explore what we've built →](/guide/built)

## Technical Approach

- **Local development** - All experiments run on local hardware (12GB GPU constraint)
- **Practical focus** - Hands-on code over theory alone
- **Test-driven learning** - TDD methodology for building reliable tools
- **Learning in public** - Documenting insights and patterns as we go

## Resources & Inspiration

- [Anthropic's interpretability research](https://www.anthropic.com/research#interpretability)
- [TransformerLens](https://github.com/neelnanda-io/TransformerLens) - mechanistic interpretability library
- [ARENA curriculum](https://www.arena.education/) - alignment research training
- NeurIPS proceedings and workshops
