---
title: Development Patterns
description: Best practices and patterns discovered while building this project
---

# Development Patterns

Patterns and practices that emerged from building this learning project, particularly around using Claude Code effectively.

## Code Organization Patterns

### Test-Driven Implementation

**Pattern**: Write tests before implementation, always.

```python
# 1. RED - Write failing test
def test_forward_pass():
    network = Network([2, 4, 1])
    output = network.forward([0, 1])
    assert output.shape == (1,)

# 2. GREEN - Minimal implementation
def forward(self, x):
    return np.zeros(1)  # Just pass the test

# 3. REFACTOR - Proper implementation
def forward(self, x):
    # Actual forward pass logic
    ...
```

**Why it works**:
- Forces thinking about behavior before code
- Prevents over-engineering
- Provides safety net for refactoring
- Documents expected behavior

### Atomic Commits

**Pattern**: One concept per commit, 1-3 files, < 500 lines.

**Bad example**:
```bash
git commit -m "Add visualizer" # 50 files, 3000 lines
```

**Good example**:
```bash
git commit -m "Add Network forward pass"  # 2 files: network.py, test_network.py
git commit -m "Add backward pass"         # Same 2 files
git commit -m "Add visualization component" # 1 file: NetworkViz.tsx
```

**Benefits**:
- Git history tells a story
- Easy to revert specific changes
- Clear what changed and why
- Reviewable by others (or future you)

### Directory Structure by Feature

**Pattern**: Organize by what code does, not what it is.

**Good structure**:
```
src/
├── network/         # Neural network implementation
│   ├── Network.ts
│   └── functions.ts
├── components/      # UI components
│   ├── NetworkVisualization.tsx
│   └── ComputationPanel.tsx
└── hooks/           # State management
    └── useTraining.ts
```

**Why**: Features evolve together; grouping them makes changes easier.

## Claude Code Patterns

### Commands vs Scripts

**Pattern**: Commands orchestrate, npm scripts execute.

**Command file** (`commit.md`):
```markdown
# Commit Command

npm run commit:check && git commit
```

**Package.json**:
```json
{
  "scripts": {
    "commit:check": "npm run lint:check && npm run test:check"
  }
}
```

**Benefits**:
- 87-91% token reduction
- Logic in version control (package.json)
- Fast execution
- Easy to test outside Claude

[Details →](/development/token-efficiency)

### Socratic Interaction

**Pattern**: Ask Claude questions before requesting solutions.

**Instead of**:
> "Implement backpropagation for my neural network"

**Try**:
> "I'm implementing backprop. What do you think I need to compute first - the output error or the hidden layer error? Why?"

**Benefits**:
- Forces active thinking
- Identifies knowledge gaps
- Builds deeper understanding
- Claude's answer builds on your thinking

[More on the Socratic approach →](/guide/learnings#on-tools-and-workflow)

### Progressive Enhancement

**Pattern**: Build in layers, testing each before adding the next.

**Example flow**:
1. Basic network (forward pass only) + tests ✓
2. Add backprop + tests ✓
3. Add training loop + tests ✓
4. Add visualization + tests ✓

**Anti-pattern**:
1. Try to build everything at once
2. Debug a tangled mess
3. Don't know what broke

## Learning Patterns

### Implement Before Reading

**Pattern**: Try coding a concept before reading the detailed explanation.

**Flow**:
1. Basic understanding (e.g., "backprop uses chain rule")
2. Try implementing it
3. Get stuck / make mistakes
4. NOW read the detailed explanation
5. "Oh! That's what I was missing"

**Why**: Struggle creates context that makes explanations meaningful.

### Visualize to Understand

**Pattern**: If you can't visualize it, you don't fully understand it.

**Example**:
- Understood gradient descent mathematically
- Built visualizer showing weight changes
- Realized weights don't change smoothly - they jump
- Deepened understanding beyond equations

**Implication**: Build visualization tools early.

### Document While Learning

**Pattern**: Capture insights immediately, not at the end.

**Tools**:
- `LEARNINGS.md` - Key insights
- Git commit messages - Decisions made
- Code comments - Why, not what
- `/learn` command - Quick insight capture

**Why**: You'll forget the "aha moment" by tomorrow.

## Testing Patterns

### Test the Contract, Not the Implementation

**Good test** (tests behavior):
```typescript
test('forward pass produces correct output shape', () => {
  const net = new Network([2, 4, 1])
  const output = net.forward([1, 0])
  expect(output.length).toBe(1)
})
```

**Bad test** (tests implementation):
```typescript
test('forward pass uses sigmoid', () => {
  // This couples test to implementation details
  expect(net.activationFunction).toBe('sigmoid')
})
```

### Test Edge Cases Explicitly

**Pattern**: Explicitly test boundary conditions.

```typescript
test('handles zero learning rate', ...)
test('handles very large learning rate', ...)
test('handles empty input', ...)
test('handles single training step', ...)
```

**Why**: Edge cases are where bugs hide.

## Workflow Patterns

### Hygiene Before Commits

**Pattern**: Always run hygiene checks before committing.

```bash
npm run hygiene  # lint + tests + markdown + git status
```

**Catches**:
- Failing tests
- Lint errors
- Broken markdown links
- Unstaged files

**Benefit**: Never commit broken code.

### Checkpoint After Features

**Pattern**: After completing a feature, take a checkpoint.

```bash
git commit -m "feat: add forward pass"
npm test
npm run hygiene
git push
/retrospective  # Document what you learned
```

**Why**: Clear milestones make progress visible.

### Use Todo Lists for Complex Work

**Pattern**: Break complex tasks into smaller steps, track progress.

**Example**:
```markdown
- [ ] Implement forward pass
- [ ] Add tests for forward pass
- [ ] Implement backward pass
- [ ] Add tests for backward pass
- [ ] Visualize weight updates
```

**Tools**: `/todo` command, GitHub Issues, simple markdown lists

## Anti-Patterns to Avoid

### Directory Navigation Chaos

**Anti-pattern**: Changing directories and forgetting to return.

```bash
cd web/src/components
# ... work ...
# Oops, next command runs in wrong directory
```

**Solution**: Use absolute paths or return to root:
```bash
cd /path/to/root && npm run command
```

### Bulk Changes Without Testing

**Anti-pattern**: Making 10 changes, then testing all at once.

**Problem**: Can't identify which change broke things.

**Solution**: Test after each change:
```bash
# Make change 1
npm test
# Make change 2
npm test
```

### Retroactive Atomic Commits

**Anti-pattern**: Making many changes, then trying to split commits.

**Problem**: Hard to split logically after the fact.

**Solution**: Commit as you go:
```bash
# Implement feature
git add feature.py test_feature.py
git commit -m "add: feature X"

# Immediately continue
# Implement next feature
git add ...
```

### Context Overload

**Anti-pattern**: Long sessions without compacting context.

**Problem**: Lose track of earlier decisions, context window fills.

**Solution**:
- Compact every 20-30 interactions
- Use `/retrospective` to save session insights
- Start fresh session for new features

## Validated Best Practices

### TDD with Claude Code

**Practice**: Red-Green-Refactor cycle with AI assistance.

**Validated**: Implemented entire `Network` class this way - zero bugs on first integration.

[Details →](/development/tdd)

### Token-Efficient Commands

**Practice**: NPM script delegation for command logic.

**Validated**: 87-91% token reduction measured across 50+ command executions.

[Details →](/development/token-efficiency)

### Progressive Complexity

**Practice**: Master simple before scaling to complex.

**Validated**: XOR network → understanding backprop → ready for transformers.

[Details →](/guide/learnings)

## Pattern Evolution

These patterns aren't static - they evolve as the project grows:

**Early**: Manual testing, long command files
**Middle**: Some automation, some commands
**Now**: Full TDD, token-efficient commands, automated workflows

**Lesson**: Patterns improve through iteration. Don't try to perfect everything upfront.

## Applying These Patterns

### For Learning Projects

- Start with TDD from day one
- Build visualizations early
- Document insights immediately
- Commit atomically

### For Production Code

- Same TDD approach
- More rigorous testing
- Stronger hygiene checks
- CI/CD automation

### For Exploration

- Less strict testing
- More visualization
- Capture hypotheses and results
- Quick iteration cycles

## Next Steps

Want to see these patterns in action?

- [Browse the code](https://github.com/jflournoy/llm-workings)
- [Try the interactive demo](/demos/neural-network)
- [Read the full learning journey](/guide/learnings)

---

*These patterns continue to evolve. Check back for updates as the project grows.*
