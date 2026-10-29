# Agent Instructions: simple-project

## 1. Scope Lock (highest priority)
- Do only what the user explicitly asked for. Nothing else.
- Treat all of the following as out of scope unless the user requested them: refactors, renames, formatting-only edits, comment or documentation additions, dependency changes, config changes, test additions, file moves, deletions, and applied architecture suggestions.
- If you notice an unrelated problem, report it in one short line and leave it unchanged. Do not fix it on your own.
- Do not act on your own suggestions. Propose first, wait for approval.
- Read-only inspection (reading files, searching code, listing directories) is allowed when needed to complete the requested task.
- For any change touching more than one file, list the files you intend to edit before editing. If that list grows during the work, stop and ask.
- If the request is ambiguous, ask one short clarifying question before acting.

## 2. Git And Verification Guardrails
- Do not run any git command unless the user explicitly asks for it. This includes status, diff, log, show, branch, add, commit, push, pull, fetch, merge, rebase, stash, reset, checkout, switch, restore, tag, worktree, remote, and config.
- Never create commits, push, tag, amend, rebase, or rewrite history on your own.
- Do not run tests, builds, linters, type checks, formatters, package installs, audits, or dev servers as an automatic verification step.
- If a check is genuinely required to complete the task, ask first. State the exact command, why it is needed, and the expected cost. Wait for explicit approval.
- If the user already declined a check in this session, do not ask again for the same check. Finish the work and report what remains unverified.
- Never delete files, reset state, or overwrite uncommitted work without explicit approval.
- Never modify files outside the scope of the request.

## 3. Skill Autoload Rule
- Load a skill only when the user names it (`@skill-id`) or when the request clearly matches that skill's own description.
- Do not scan or load skills as a precaution.
- Never auto-load orchestration, lifecycle, or router skills unless the user explicitly asks for them. This includes `autonomous-dev`, `engineering-loop`, `enterprise-business`, `career-and-job-search`, `content-and-growth`, `research-and-productivity`, `design-engineering`, `mobile-react-native`, `prompt-engineering`, and similar.
- If a loaded skill instructs a step that conflicts with sections 1 or 2 (git, checkpoints, extra files, broad audits, multi-stage ceremonies), skip that step and ask the user first.
- Sections 1 and 2 override every skill and every default workflow.

## 4. File Creation Guardrails
- Do not create checkpoint, plan, report, summary, notes, task tracker, or scratch files unless the user asked for them.
- Do not update `AGENTS.md`, documentation, or configuration files unless the user asked for it.

## 5. Universal Guardrails
- Chat replies may mirror the user's language. Code, comments, documentation, and commit messages stay in English.
- Zero emojis across all code files, comments, and commit messages.
- Prohibit Latin abbreviations: use 'for example', 'that is', 'and so forth'.
- Prohibit em dashes: use colons, parentheses, or separate sentences.
- Zero hardcoded secrets, connection strings, or unredacted logging output.

## 6. Appearance Vocabulary
- User facing label: Appearance. Do not call it Theme.
- Code, documentation, and UI copy: color scheme, appearance mode, light and dark mode, appearance preference.
- Storage and logic: use `APPEARANCE_KEY`, `data-appearance`, and `data-appearance-opt`. Never introduce `THEME_KEY`, `data-theme`, or theme tokens.
- CSS: color scheme tokens live in `src/theme/global.css`. Components consume semantic `--color-*` tokens only.
