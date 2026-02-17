import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LLM Workings',
  description: 'A hands-on exploration of how language models actually work',
  base: '/understanding-llms/',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Development', link: '/development/' },
      { text: 'Demos', link: '/demos/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Project Overview',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Goals & Motivation', link: '/guide/goals' },
            { text: 'What We Built', link: '/guide/built' },
            { text: 'What Comes Next', link: '/guide/next' }
          ]
        },
        {
          text: 'Learning Journey',
          items: [
            { text: 'Key Learnings', link: '/guide/learnings' },
            { text: 'Development Patterns', link: '/guide/patterns' }
          ]
        }
      ],
      '/development/': [
        {
          text: 'Development Practices',
          items: [
            { text: 'Overview', link: '/development/' },
            { text: 'TDD with Claude', link: '/development/tdd' },
            { text: 'Best Practices', link: '/development/best-practices' },
            { text: 'Token Efficiency', link: '/development/token-efficiency' }
          ]
        },
        {
          text: 'Claude Code Usage',
          items: [
            { text: 'Claude Patterns', link: '/development/claude-patterns' },
            { text: 'Agent Patterns', link: '/development/agent-patterns' },
            { text: 'Command Catalog', link: '/development/commands' },
            { text: 'Workflows', link: '/development/workflows' }
          ]
        },
        {
          text: 'Reference',
          items: [
            { text: 'Quick Reference', link: '/development/quick-reference' },
            { text: 'API Setup', link: '/development/api-setup' },
            { text: 'Feature Check', link: '/development/feature-check' },
            { text: 'Self-Updating Docs', link: '/development/self-updating' },
            { text: 'TDD Success Stories', link: '/development/tdd-stories' }
          ]
        }
      ],
      '/demos/': [
        {
          text: 'Interactive Demos',
          items: [
            { text: 'Overview', link: '/demos/' },
            { text: 'Neural Network Visualizer', link: '/demos/neural-network' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jflournoy/llm-workings' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'A hands-on learning project exploring LLM internals',
      copyright: 'MIT Licensed'
    }
  },

  head: [
    ['meta', { name: 'og:title', content: 'LLM Workings - Understanding Language Models' }],
    ['meta', { name: 'og:description', content: 'A hands-on learning project exploring LLM internals through neural network implementations and interactive visualizations' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['script', { async: '', src: 'https://scripts.simpleanalyticscdn.com/latest.js' }]
  ]
})
