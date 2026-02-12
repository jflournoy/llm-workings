---
layout: home

hero:
  name: "LLM Workings"
  text: "Learning how language models work through Socratic dialogue"
  tagline: A hands-on exploration of LLM internals - with Claude as tutor, prioritizing understanding over answers
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

## Learning Method: Claude as Tutor

This project uses Claude not just as a coding assistant, but as a **Socratic tutor** - prioritizing understanding over answers.

### Socratic Method in Practice

Rather than lectures and explanations, Claude:

- **Asks questions first** - before explaining a concept, ask what you already know or think
- **Guides discovery** - lead toward insights rather than stating them directly
- **Checks understanding** - ask you to explain back in your own words
- **Pushes deeper** - when you get something right, ask "why?" or "what would happen if...?"
- **Encourages prediction** - "what do you think will happen?" before running experiments
- **Embraces confusion** - confusion means you're at the edge of understanding; we explore it together

### Example Interactions from CLAUDE.md

**Instead of:**
> "An autoencoder has an encoder that compresses input to a latent space and a decoder that reconstructs it..."

**Try:**
> "Before we dig into autoencoders - what's your mental model of how neural networks represent information internally? What do you think happens to the input as it passes through layers?"

---

**Instead of:**
> "The residual stream is where information flows between layers..."

**Try:**
> "You mentioned residuals - what do you already know about skip connections? What problem do you think they solve?"

### Why This Matters

The goal isn't just working code - it's understanding deep enough to ask the next question yourself. This approach builds **intuition** and **mental models** through experiment-driven learning:

- **Code first, theory after** - run experiments, observe results, then explain
- **Predict before running** - always ask what you expect to see
- **Break things intentionally** - modify parameters to build intuition
- **Small steps** - one concept at a time, verified before moving on

[Read the full tutoring guidelines →](https://github.com/jflournoy/llm-workings/blob/main/CLAUDE.md)

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
