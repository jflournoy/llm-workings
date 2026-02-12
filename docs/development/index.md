---
title: Development Guide
description: Practices, patterns, and tools for effective development with Claude Code
---

# Development Guide

This section documents the development practices, patterns, and tools used in building this learning project. These techniques make AI-assisted development more effective, efficient, and sustainable.

## Core Practices

### [Test-Driven Development](./tdd)

Why TDD transforms Claude Code from "helpful" to "superpower" - and how to apply it effectively.

**Key insight**: Tests prevent Claude from over-engineering and provide a safety net for refactoring.

### [Best Practices](./best-practices)

Effective patterns for using Claude Code in your development workflow, from atomic commits to context management.

**Key insight**: Small, deliberate practices compound into massive productivity gains.

### [Token Efficiency](./token-efficiency)

How to reduce AI token consumption by 85-90% through npm script delegation and command optimization.

**Key insight**: Efficiency isn't just about cost - it's about speed and sustainability.

## Claude Code Usage

### [Claude Patterns](./claude-patterns)

Best practices specific to Claude Code interactions - how to communicate effectively and get better results.

**Key insight**: The Socratic method (asking questions before explaining) leads to deeper understanding.

### [Agent Patterns](./agent-patterns)

When to use Commands vs Agents, and patterns for creating effective AI agents for analysis tasks.

**Key insight**: Commands for routine execution, Agents for intelligent analysis.

### [Command Catalog](./commands)

Complete list of all available Claude Code commands with usage examples.

**Quick commands**:
- `/hygiene` - Project health check
- `/commit` - Atomic commits with quality checks
- `/tdd` - TDD workflow guidance
- `/next` - AI-recommended next steps

### [Workflows](./workflows)

Real-world command workflows for common development tasks like feature development, bug fixes, and refactoring.

**Key insight**: Composing commands into workflows amplifies their value.

## Reference

### [Quick Reference](./quick-reference)

Essential Claude Code commands for daily use - bookmark this page for quick access.

### [API Setup](./api-setup)

Configuring Claude API for GitHub CI/CD automation and agent-based workflows.

### [Feature Check](./feature-check)

Quality assurance system for validating feature implementation completeness.

### [Self-Updating Docs](./self-updating)

Creating documentation that updates itself through Claude Code commands - meta-documentation that stays current.

### [TDD Success Stories](./tdd-stories)

Real examples from this repository showing the power of TDD with Claude Code.

## Why These Practices Matter

### For Learning Projects

These practices enable **rapid, confident iteration**:
- TDD catches regressions while exploring
- Token efficiency makes experimentation affordable
- Atomic commits create readable learning history
- Custom commands reduce cognitive load

### For Production Code

The same practices scale to professional development:
- TDD provides safety net for refactoring
- Commands automate repetitive workflows
- Agents handle complex analysis tasks
- Best practices prevent technical debt

## Getting Started

**New to this workflow?**

1. Start with [TDD](./tdd) - it's the foundation
2. Review [Best Practices](./best-practices) - quick wins
3. Try a few [Commands](./commands) - see what clicks
4. Read [Token Efficiency](./token-efficiency) - optimize sustainably

**Ready to customize?**

1. Explore [Agent Patterns](./agent-patterns) - create your own agents
2. Study [Workflows](./workflows) - compose commands effectively
3. Check [Self-Updating Docs](./self-updating) - maintain documentation automatically

## Core Philosophy

These practices embody a few key principles:

### 1. Test-Driven Everything

Tests aren't overhead - they're **specifications** that prevent over-engineering and enable confident refactoring.

### 2. Efficiency Compounds

Small optimizations (token-efficient commands, atomic commits) compound into massive productivity gains over time.

### 3. Automate Repetition

If you do something 3+ times, automate it. Commands and scripts capture and reuse workflows.

### 4. Document as You Go

Capture insights immediately, not at the end. Future you will be grateful.

### 5. Learn Through Building

Theory is useful, but building solidifies understanding. This entire development workflow emerged from hands-on practice.

## Tool Integration

### Editor Integration

Works with:
- VSCode (native extension)
- Cursor
- Other editors via Claude Code CLI

### CI/CD Integration

- GitHub Actions for automated testing
- Pre-commit hooks for quality checks
- Automated agent runs for analysis

### Version Control

- Git for code and documentation
- Atomic commits for clear history
- Branch protection with quality checks

## Success Metrics

How do you know these practices are working?

**Qualitative**:
- Feel confident making changes
- Understand code you wrote weeks ago
- Can explain decisions to others
- Enjoy the development process

**Quantitative**:
- Test coverage > 80%
- Commit sizes < 500 lines
- Token usage reduced by 85%+
- Build times < 30 seconds

## Evolution

These practices aren't static - they evolve with the project:

**Early phase**: Manual testing, learning the tools
**Middle phase**: Some automation, discovering patterns
**Current phase**: Full TDD, optimized workflows, custom tooling

**Lesson**: Start simple, iterate, optimize based on pain points.

## Questions?

- [Browse the code examples](https://github.com/jflournoy/llm-workings)
- [Read the learnings](/guide/learnings) for context on why these practices emerged
- [Try the patterns](/guide/patterns) on your own project

---

*This development guide is actively maintained and evolves with the project. Contributions and feedback welcome!*
