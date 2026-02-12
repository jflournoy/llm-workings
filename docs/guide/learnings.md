---
title: Key Learnings
description: Important insights and discoveries from the learning journey
---

# Key Learnings

## On Understanding Neural Networks

### Backpropagation is Simpler Than It Seems

After implementing backprop from scratch, the most surprising insight: **it's just the chain rule, repeatedly**.

The complexity comes from bookkeeping (tracking gradients through the computation graph), not from the math itself. Once you implement it once, transformers are just "backprop but with more interesting forward passes."

**Takeaway**: Don't fear the math - implement it and it becomes intuitive.

### Visualization Clarifies Concepts

Building the interactive neural network visualizer revealed gaps in understanding that reading alone never would have. When you have to **show** every computation step, you can't hand-wave over details.

Example: Implementing the gradient computation panel forced deep understanding of how errors propagate backward through the network.

**Takeaway**: If you can't visualize it, you don't fully understand it.

### Small Networks Teach Big Lessons

The simple 2→4→1 XOR network demonstrates:
- How weights encode solutions (path strengths matter)
- Why learning rates affect convergence
- How noise affects generalization
- What gradient descent actually does

These insights transfer directly to understanding transformers and LLMs.

**Takeaway**: Master simple systems before scaling to complex ones.

## On Development Workflow

### Test-Driven Development is a Superpower

TDD transformed how this project works:

- **Write test first** → Forces you to think about desired behavior
- **Implement minimally** → Prevents over-engineering
- **Refactor fearlessly** → Tests catch regressions

With Claude Code, TDD becomes even more powerful: Claude can generate implementations that pass specific tests, preventing the "500 lines of over-engineered code" problem.

**Concrete example**: The `Network` class was 100% tested before any UI existed. This meant bugs in the visualizer were UI bugs, not network bugs.

**Takeaway**: TDD makes Claude Code dramatically more effective.

### Token Efficiency Matters

Through npm script delegation and command optimization, achieved **87-91% token reduction** in common operations.

What this means in practice:
- Commands execute in < 1 second instead of 10-30 seconds
- Less context pollution
- Faster iteration cycles
- More sustainable long-term use

**Pattern that works**: Commands are thin wrappers around npm scripts. Logic lives in `package.json`, not in command files.

**Takeaway**: Optimize for token efficiency from day one.

### Atomic Commits Enable Learning

Keeping commits small (1-3 files, < 500 lines) creates a **readable history** of the learning journey:

- Each commit is a single concept
- Easy to understand what changed and why
- Can review git log to see progression of understanding
- Mistakes are isolated and easy to revert

**Takeaway**: Your git history is documentation of your learning process.

## On Learning Itself

### Implementation Beats Reading

Reading papers about backpropagation: Interesting but abstract.
Implementing backpropagation: **Oh, that's what it actually does.**

This pattern repeated:
- Reading about attention → vague understanding
- Will implement attention → will achieve real understanding

**Takeaway**: Code first, theory second.

### Questions Drive Exploration

Best discoveries came from asking "why?" repeatedly:

- "Why does XOR require a hidden layer?" → Understanding of linear separability
- "Why do some paths matter more?" → Understanding of weight interactions
- "Why does noise help generalization?" → Understanding of overfitting

**Takeaway**: Curiosity + implementation tools = deep learning.

### Document While Learning

Capturing insights in real-time (through LEARNINGS.md, git commits, code comments) creates a **knowledge base** you can return to.

Example: When confused about gradients weeks later, reviewed git history to see the specific commit where it clicked.

**Takeaway**: Your future self will thank you for documentation.

## On Tools and Workflow

### Claude Code as Tutor

Using Claude with the Socratic method (ask questions before explaining) transformed learning:

- Forces active engagement instead of passive reading
- Identifies gaps in understanding through questions
- Builds on existing knowledge incrementally

**Contrast**:
- ❌ "Explain how backprop works" → long lecture, passive learning
- ✅ "What do you think happens to gradients as they flow backward?" → active thinking, then explanation

**Takeaway**: Use Claude as a tutor, not just a coding assistant.

### Custom Commands Compound

Creating project-specific commands (`/hygiene`, `/commit`, `/tdd`) pays dividends:

- Each command saves 10-30 seconds
- Used 50+ times per day
- Total time saved: hours per week
- More importantly: reduced cognitive load

**Takeaway**: Invest in workflow automation early.

### Jupyter vs Web Apps

Initially considered Jupyter notebooks for visualization, but building a web app was the right choice:

**Web app advantages**:
- Interactive and shareable
- Professional appearance
- No dependencies for users
- Easier to iterate on design

**When to use each**:
- Jupyter: Quick experiments, data analysis
- Web app: Learning tools meant to be shared

**Takeaway**: Choose the right tool for your audience.

## Surprising Discoveries

### Neural Networks are More Fragile Than Expected

Small changes in initialization can dramatically affect training:
- Same architecture, different random seeds → different solutions
- Learning rate 10x too high → divergence
- Too few training steps → memorization not generalization

**Implication**: Understanding training dynamics is as important as understanding architecture.

### Visualization Reveals Non-Obviousness

Watching weights evolve during training revealed patterns that weren't obvious from equations:

- Weights don't change smoothly - they jump around
- Some weights converge quickly, others oscillate
- Path strengths (product of weights along paths) matter more than individual weights

**Implication**: Dynamic visualization teaches things static diagrams cannot.

### Simple Problems are Deep

Even XOR, the simplest non-linear problem, demonstrates:
- Representation learning (hidden layer creates new features)
- Feature interaction (AND/OR combinations)
- Optimization challenges (local minima)
- Generalization vs memorization

**Implication**: Don't rush past fundamentals - there's more to learn than appears.

## Mistakes and Course Corrections

### Overcomplicating Early On

Initial plan: Build comprehensive interpretability tools immediately.
**Reality**: Needed to understand backprop first.

**Lesson**: Start simpler than you think necessary.

### Underestimating Test Value

Initially: "Tests slow down learning."
**Reality**: Tests enable confident iteration and prevent regressions.

**Lesson**: TDD is faster, not slower, especially with AI assistance.

### Ignoring Workflow Until It Hurt

Initially: Manual, repetitive tasks.
Turning point: Created `/hygiene` command, saved hours.

**Lesson**: If you do something 3+ times, automate it.

## What's Next

These learnings inform future exploration:

1. **Apply TDD** to transformer implementation
2. **Build visualizations** for attention mechanisms
3. **Document discoveries** as they happen
4. **Ask questions** before reading answers

[See the roadmap →](./next)

---

*These learnings are continuously updated as the project evolves. Check the [project repository](https://github.com/jflournoy/llm-workings) for the latest insights.*
