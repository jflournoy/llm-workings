# LLM Workings

**A hands-on exploration of how language models actually work**

📚 **[View Full Documentation](https://jflournoy.github.io/llm-workings/)**
🎮 **[Try Interactive Demo](https://jflournoy.github.io/llm-workings/demos/neural-network)**

## What This Is

A personal learning project to understand the internals of large language models - not just how to use them, but how they represent and process information. The goal is to build intuition for what's happening inside these systems and eventually create tools to probe and understand their representations.

## Areas of Exploration

- **Architecture fundamentals** - transformer layers, attention, residual streams, MLPs
- **Representations** - how information from training corpora gets encoded into weights and activations
- **Interpretability techniques** - probing, sparse autoencoders, activation patching, steering vectors
- **Fine-tuning** - LoRA, adapters, and what actually changes during training
- **Mechanistic interpretability** - understanding circuits and features

## Technical Constraints

- **Local development** - Python-based, running on a 12GB GPU
- **Smaller models** - GPT-2, Pythia, Llama-2-7B, or similar models that fit in memory
- **Practical experiments** - hands-on code over theory alone

## Current Status

Just getting started. No clear goal yet beyond building understanding.

## Resources & Inspiration

- [Anthropic's interpretability research](https://www.anthropic.com/research#interpretability)
- [TransformerLens](https://github.com/neelnanda-io/TransformerLens) - mechanistic interpretability library
- [ARENA curriculum](https://www.arena.education/) - alignment research training
- NeurIPS proceedings and workshops

---

*Learning in public*
