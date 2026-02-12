---
title: What Comes Next
description: Roadmap, open questions, and future directions
---

# What Comes Next

## Short-term Goals

### Enhance the Neural Network Visualizer

The current visualizer is hardcoded for XOR with a 2→4→1 architecture. Planned enhancements:

- **Configurable architectures**: Allow users to define custom layer sizes
- **Multiple activation functions**: ReLU, tanh, softmax options
- **Different loss functions**: MSE, categorical cross-entropy
- **Batch training**: Visualize mini-batch gradient descent
- **Regularization**: Show L1/L2 effects on weights

**Why**: A more flexible visualizer can demonstrate more concepts and handle more complex problems.

### Build Activation Visualization Tools

Create tools to visualize what neurons respond to:

- **Activation heatmaps**: Show which neurons fire for different inputs
- **Feature visualization**: Generate inputs that maximally activate neurons
- **Neuron analysis**: Understand what patterns specific neurons detect

**Why**: Understanding individual neuron behavior builds intuition for how networks learn representations.

### Implement Interpretability Techniques

Apply classic interpretability methods:

- **Grad-CAM**: Visualize what input regions matter for outputs
- **Layer-wise relevance propagation**: Track which inputs contributed to predictions
- **Saliency maps**: Identify important features

**Why**: These techniques transfer to understanding larger models like transformers.

## Medium-term Goals

### Explore Pre-trained Models

Load and analyze small pre-trained models:

- **GPT-2 (124M)**: Fits on 12GB GPU, real language model behavior
- **Pythia (70M-160M)**: Models trained for interpretability research
- **DistilBERT**: Efficient transformer for understanding attention

**Planned analyses**:
- Attention pattern visualization
- Probing classifiers (what linguistic info is encoded?)
- Activation patching experiments
- Layer ablation studies

**Why**: Moving from toy neural networks to real language models.

### Build Transformer Visualizations

Create interactive tools for understanding transformers:

- **Attention head visualizer**: See what each head attends to
- **Residual stream tracker**: Follow information flow through layers
- **MLP probe**: Understand what feed-forward layers compute

**Why**: Transformers are the architecture behind modern LLMs - understanding them is essential.

### Implement Sparse Autoencoders

Train SAEs to decompose model activations:

- Extract interpretable features from activations
- Understand how models represent concepts
- Build steering vectors for behavior control

**Why**: Recent interpretability breakthroughs (Anthropic's research) rely heavily on SAEs.

## Long-term Vision

### Mechanistic Interpretability

Reverse-engineer learned circuits in small models:

- **Induction heads**: How models do in-context learning
- **Copy/suppression circuits**: Understanding attention patterns
- **Indirect object identification**: Multi-step reasoning circuits

**Why**: Mechanistic interpretability aims to fully understand what models compute, not just describe their behavior.

### Fine-tuning Experiments

Understand what changes during adaptation:

- **LoRA**: Low-rank adaptation for efficient fine-tuning
- **Weight evolution**: Track which parameters change most
- **Catastrophic forgetting**: Measure and mitigate knowledge loss
- **Task arithmetic**: Combine multiple adaptations

**Why**: Fine-tuning is how general models become specialized - understanding this process is crucial.

### Build a Learning Curriculum

Create a sequence of interactive tutorials:

1. **Backpropagation basics** (current XOR visualizer)
2. **Attention mechanism** (single-head attention viz)
3. **Multi-head attention** (transformer block)
4. **Positional encodings** (how models track position)
5. **Residual connections** (information highways)
6. **Layer normalization** (stabilizing training)

**Why**: Structured learning path for others exploring LLM internals.

## Open Questions

### Conceptual Questions

- How do induction heads form during training?
- What makes some neurons polysemantic while others are monosemantic?
- How does the residual stream divide labor between attention and MLPs?
- What representations emerge in different layers?

### Technical Questions

- Can we visualize training dynamics in real-time for GPT-2?
- What's the minimal architecture that shows induction behavior?
- How do steering vectors transfer between similar models?
- Can we predict which features an SAE will find before training?

### Implementation Questions

- Should we support different network architectures in the visualizer or hardcode XOR?
- Should computation panel show all steps at once or animate through?
- Do we want to save/load network states?
- How should we handle very large models (sharding, quantization)?

## Research Areas to Explore

### Activation Patterns

- How do activations cluster for different input types?
- Can we predict model behavior from activation patterns?
- What causes adversarial examples from an activation perspective?

### Weight Analysis

- How do weight matrices encode linguistic knowledge?
- Can we identify and edit specific facts in weights?
- What makes some weights more important than others?

### Training Dynamics

- How do different concepts form at different training stages?
- Can we predict what a model will learn next?
- What causes sudden capability jumps during training?

## Constraints & Reality

All exploration must fit within:

- **12GB GPU memory** - Limits model size to GPT-2 or smaller
- **Local computation** - No cloud resources, everything runs locally
- **Time budget** - This is a learning project, not a full-time research position

These constraints mean focusing deeply on specific areas rather than attempting comprehensive coverage.

## How to Prioritize

Using the **depth over breadth** principle:

1. **Master fundamentals** - Fully understand backprop before transformers
2. **Build tools** - Create visualizations that aid future exploration
3. **Follow curiosity** - Investigate surprising findings deeply
4. **Document everything** - Capture learnings for future reference

## Get Involved

Interested in contributing or collaborating?

- **Browse the code**: [GitHub repository](https://github.com/jflournoy/llm-workings)
- **Try the demos**: [Neural network visualizer](/demos/neural-network)
- **Read the learnings**: [Key insights](/guide/learnings) from exploration so far

## Stay Updated

This is an active learning project. Check back for:

- New visualizations and demos
- Experiment results and findings
- Updated insights and learnings
- Additional interpretability tools

---

**Current focus**: Enhancing the neural network visualizer and beginning GPT-2 exploration.
