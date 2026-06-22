# Build your own Claude Code workflow plugin

This guide is for engineers who want to package an internal Claude Code workflow for their own team.

# Why to build your own plugin?

Your organisation might be facing issues relevant to your own teams & usage. Creating your own plugin ensure that it works for your usecases and act specifically on your day to day issues.

# How to build your plugin

Here’s a concise guide:

## 1. Define the Workflow

- Identify the repetitive workflow, automation, or guardrail you want to package (e.g., a design-system audit, commit policy checker, onboarding automation, or code migration helper).
- Decide whether your plugin will provide new `/skills`, `agents`, `hooks`, CLI tools, or a combination.

## 2. Scaffold the Plugin Directory

1. **Create a directory** for your plugin (e.g., `design-system-guard`).
2. **Create a manifest** at `.claude-plugin/plugin.json` describing the plugin (name, author, description).
3. **Add core components** needed by your workflow:
   - `skills/`: For custom skills (run via `/your-skill` in Claude Code).
   - `agents/`: For custom agents acting on user/PR input.
   - `hooks/`: For lifecycle automation (e.g. after edits).
   - `bin/`: For helper scripts/tools your plugin calls.

For example:

```
.claude-plugin/plugin.json
skills/my-skill/
agents/
hooks/
bin/
examples/
README.md
```

## 3. Author Your Skill/Agent/Hook

- **Skill:** Write a skill in `skills/your-skill/` (e.g., a markdown file with structured instructions, or code implementing the logic). Claude Code picks up skills in `.md` files and directories here.
- **Agent:** Place agent configuration and prompt in the `agents/` folder.
- **Hook:** Hooks are described (as JSON) in `hooks/hooks.json`, specifying when and how to run code after (or before) edits.
- **CLI:** Add small Node.js, Python, or shell scripts to `bin/` if your workflow needs local checks.

## 4. Add Context & Documentation

- Place any reference docs or example files in `/examples`, `/reference`, or similar folders.
- Write a `README.md` explaining your plugin’s features, how to install & use it, and example commands/flows.

## 5. Validate the Plugin

From your plugin directory, run:

```
claude plugin validate . --strict
```

Fix any errors to ensure your plugin loads reliably.

## 6. Use and Share

Start Claude Code with your plugin loaded:

```
claude --plugin-dir .
```

Use your skills, agents, or hooks as documented from the Claude Code interface (CLI, UI, etc).

### Tips

- Keep plugins as self-contained as possible. All docs and code needed should live in the plugin.
- For custom org rules, make your `tokens.json` or config files overridable by users.
- Put examples and diffs for common uses in `/examples` or the `README.md`.

---

_For a real-world example, see this repo's structure and files!_
