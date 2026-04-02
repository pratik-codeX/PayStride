# Contributing To PayStride

This repository is best maintained with small, honest, feature-based commits.

The goal is not to make the history look artificially busy. The goal is to make it easy for someone reading the repository to understand what changed, why it changed, and how the project evolved.

## Contribution Principles

- Make commits only for real work that was completed.
- Keep one logical change per commit.
- Prefer clear commit messages over clever ones.
- Do not rewrite history just to make the project look more active.
- If a feature is incomplete, say so in the commit or PR description.

## Commit Style

Use simple conventional prefixes where they fit:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for README, architecture notes, and usage docs
- `refactor:` for code cleanup without behavior changes
- `chore:` for repo maintenance

Examples:

```text
feat: add worker self-service portal
fix: prevent duplicate worker code generation
docs: rewrite README with setup and architecture notes
refactor: simplify payroll service response mapping
chore: update gitignore for frontend build output
```

## Suggested Workflow

### 1. Sync and inspect

- check the branch status
- review what actually changed
- avoid bundling unrelated files into one commit

### 2. Group changes by intent

Good:

- one commit for worker-code generation fix
- one commit for documentation updates

Less good:

- one large commit mixing bug fixes, CSS tweaks, docs, and config changes

### 3. Write a meaningful commit message

A good commit message should answer:

- what changed
- why it changed

## Pull Request Guidance

A clean PR should include:

- short summary
- key files changed
- how to run or test
- screenshots for UI changes
- known limitations if relevant

## Contribution Honesty

If this project is being used for GitHub, placements, or academic review:

- do not add fake backdated commits
- do not split one small change into ten cosmetic commits
- do not add placeholder features just for appearance
- do document your real role in the project honestly

If this was a team project, keep contribution claims factual. A simple and believable breakdown is better than an inflated one.

## Practical Commit Plan For This Repo

Given the current state of the project, sensible commit grouping would be:

```text
fix: resolve worker portal and worker creation backend issues
docs: add project README and contribution guidelines
chore: reorganize frontend folder and update ignore rules
```

Only use a commit if that change actually exists in your working tree.
