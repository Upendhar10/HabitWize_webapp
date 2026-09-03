# Project Foundations

This document consists of engineering challenges that i encountered while building **HABITWIZE** in Phase 01 : Project Foundations.

---

## 1. Challenge: Running `lint-staged` Across Independent Workspaces

### **1.1 Context**

As part of the project foundation, I introduced a **root-level npm workspace** to manage repository-wide development tooling and Git configuration.

The repository consists of two independent application workspaces:

```text
habitwize/
├── frontend/
└── backend/
```

Each workspace maintains its own application-specific tooling and configuration. In particular, the frontend and backend have separate **ESLint** and **Prettier** configurations.

At the repository level, I wanted to establish a common Git workflow using **Husky** and **lint-staged** so that staged files would automatically be validated and formatted before being committed.

The root workspace was therefore responsible for coordinating repository-level tooling, while the individual workspaces remained responsible for their own application-specific configuration. This follows the separation established while setting up the root workspace. 

---

### **1.2 Problem Statement**

At first glance, configuring `lint-staged` seemed straightforward:

```text
git commit
    ↓
Husky
    ↓
pre-commit
    ↓
lint-staged
    ↓
ESLint / Prettier
```

The difficulty arose from the fact that the repository does **not** have a single ESLint or Prettier configuration.

Instead:

```text
frontend/
    ├── ESLint configuration
    ├── Prettier configuration
    └── package.json

backend/
    ├── ESLint configuration
    ├── Prettier configuration
    └── package.json
```

Therefore, the real requirement was:

> **How can a single root-level `lint-staged` configuration correctly process staged files using the ESLint and Prettier configuration belonging to their respective workspace?**

For example, if a commit contains:

```text
frontend/src/App.tsx
backend/src/index.ts
```

the workflow must ensure that:

```text
frontend/src/App.tsx
        ↓
frontend tooling
        ↓
frontend ESLint
        ↓
frontend Prettier
```

while:

```text
backend/src/index.ts
        ↓
backend tooling
        ↓
backend ESLint
        ↓
backend Prettier
```

are processed independently.

The challenge was therefore not simply to install and configure `lint-staged`, but to make a **repository-level Git workflow work correctly with independent workspace-level tooling**.

---

### **1.3 Constraints and Challenges**

**1. Repository-level Git hooks vs workspace-level tooling**

Git hooks belong to the repository, whereas ESLint and Prettier configurations belong to individual workspaces.

This created two different scopes:

```text
Repository scope
├── Git
├── Husky
└── lint-staged

Workspace scope
├── ESLint
├── Prettier
└── application-specific configuration
```

The solution needed to connect these two scopes without unnecessarily moving workspace-specific configuration into the root.

---

**2. Identifying the correct workspace**

`lint-staged` receives staged file paths, but the commands must be executed in the context of the workspace that owns those files.

For example:

```text
frontend/src/components/Button.tsx
```

must be treated differently from:

```text
backend/src/controllers/user.controller.ts
```

The workflow therefore needed a mechanism to determine the appropriate workspace and execute its tooling from the correct working directory.

---

**3. Preserving workspace independence**

One possible approach would have been to create one global ESLint and Prettier configuration at the repository root.

I intentionally did not take that approach.

The frontend and backend are separate applications with different technical requirements. Their linting and formatting rules should therefore remain independently configurable.

The root-level tooling should **orchestrate** the workflow rather than **own** every workspace-specific configuration.

---

**4. Handling file paths correctly**

`lint-staged` provides file paths to the commands it executes. Those paths may be absolute paths, while the target workspace expects paths relative to its own directory.

The solution therefore also needed to normalize file paths before passing them to ESLint or Prettier.

---

### 1.4 Approach

I kept **Husky** and **`lint-staged`** at the repository level and introduced a small workspace-aware execution layer between `lint-staged` and the individual workspace tools.

The resulting architecture is:

```text
                    git commit
                        ↓
                    Husky
                        ↓
                    .husky/pre-commit
                        ↓
                    lint-staged
                        ↓
                    lint-staged.config.mjs
                        ↓
                    run-workspace-command.mjs
                        ↓
┌──────────────────────┬──────────────────────┐
│                      │                      │
▼                      ▼                      │
Frontend               Backend                │
workspace              workspace              │
│                      │                      │
▼                      ▼                      │
ESLint                 ESLint                 │
Prettier               Prettier               │
└──────────────────────┴──────────────────────┘
```

This gave me a clear separation of responsibilities:

| Component                       | Responsibility                                                              |
| ------------------------------- | --------------------------------------------------------------------------- |
| **Husky**                       | Integrates the workflow with Git hooks                                      |
| **lint-staged**                 | Identifies files staged for commit and determines which commands should run |
| **`lint-staged.config.mjs`**    | Maps file patterns to the appropriate workspace commands                    |
| **`run-workspace-command.mjs`** | Executes the requested tool inside the correct workspace                    |

This approach allowed the repository to have one pre-commit workflow while keeping frontend and backend tooling independent. The resulting workflow is consistent with the root-level Git tooling setup documented earlier. 

---

### **1.5 Implementation**

**A. `.husky/pre-commit`**

The root-level pre-commit hook invokes:

```bash
npx lint-staged
```

Its responsibility is intentionally small.

Husky handles the Git hook, while `lint-staged` handles the staged-file workflow.

```text
git commit
    ↓
Husky
    ↓
pre-commit
    ↓
lint-staged
```

This keeps the Git hook itself simple and moves the workspace-specific logic into a dedicated configuration and runner.

---

**B. `lint-staged.config.mjs`**

The `lint-staged` configuration defines which files belong to which workspace and which commands should be executed.

```js
const runWorkspaceCommand = (workspace, command, flag) => {
  return (files) =>
    `node scripts/run-workspace-command.mjs ${workspace} ${command} ${flag} ${files
      .map((file) => JSON.stringify(file))
      .join(" ")}`;
};

export default {
  "frontend/**/*.{js,jsx,ts,tsx}": [
    runWorkspaceCommand("frontend", "eslint", "--fix"),
    runWorkspaceCommand("frontend", "prettier", "--write"),
  ],

  "backend/**/*.{js,ts}": [
    runWorkspaceCommand("backend", "eslint", "--fix"),
    runWorkspaceCommand("backend", "prettier", "--write"),
  ],
};
```

**What this configuration does ?**

The configuration establishes two important mappings.

For frontend files:

```text
frontend/**/*.{js,jsx,ts,tsx}
        ↓
frontend + eslint
        ↓
frontend + prettier
```

For backend files:

```text
backend/**/*.{js,ts}
        ↓
backend + eslint
        ↓
backend + prettier
```

The `runWorkspaceCommand()` function is particularly useful because it creates a reusable command factory rather than duplicating the command-building logic for every workspace.

**Why pass the files dynamically?**

`lint-staged` provides the list of staged files to the generated function.

This means that if only:

```text
frontend/src/App.tsx
```

is staged, the command receives that file rather than running ESLint or Prettier over the entire frontend project.

This preserves one of the main benefits of `lint-staged`:

> **Only the files participating in the commit are processed.**

---

### **1.6 Workspace Command Runner**

The second part of the solution is:

```text
scripts/run-workspace-command.mjs
```

This script acts as a **workspace-aware command execution layer**.

Its job is to:

1. Validate the command-line arguments.
2. Determine the target workspace.
3. Determine the requested tool.
4. Resolve the correct CLI executable.
5. Convert file paths into paths relative to the workspace.
6. Execute the CLI from the workspace directory.
7. Propagate the command's exit status back to the Git workflow.

---

**A. Reading the command arguments**

The runner expects arguments in this form:

```text
node scripts/run-workspace-command.mjs <workspace> <command> [args...]
```

It extracts the workspace, command, and remaining arguments from `process.argv`.

```js
const [, , workspace, command, ...args] = process.argv;
```

For example:

```text
node scripts/run-workspace-command.mjs frontend eslint --fix file.tsx
```

produces:

```text
workspace = frontend
command   = eslint
args      = ["--fix", "file.tsx"]
```

The script also validates that the required arguments are present before continuing.

---

**B. Mapping commands to workspace-specific CLIs**

The runner maintains an explicit mapping between supported commands and their CLI locations:

```js
const cliPaths = {
  eslint: {
    frontend: "node_modules/eslint/bin/eslint.js",
    backend: "node_modules/eslint/bin/eslint.js",
  },

  prettier: {
    frontend: "node_modules/prettier/bin/prettier.cjs",
    backend: "node_modules/prettier/bin/prettier.cjs",
  },
};
```

This allows the script to determine which executable should be used based on:

```text
workspace + command
```

For example:

```text
frontend + eslint
        ↓
frontend/node_modules/eslint/...

backend + prettier
        ↓
backend/node_modules/prettier/...
```

The explicit mapping also prevents arbitrary commands from being executed accidentally.

Unsupported combinations are rejected:

```js
const cliPath = cliPaths[command]?.[workspace];

if (!cliPath) {
  console.error(
    `Unsupported command "${command}" for workspace "${workspace}".`,
  );
  process.exit(1);
}
```

---

**C. Setting the workspace as the working directory**

One of the most important implementation details is:

```js
const child = spawn(
  process.execPath,
  [resolve(workspacePath, cliPath), ...normalizedArgs],
  {
    cwd: workspacePath,
    stdio: "inherit",
    shell: false,
  },
);
```

The critical part is:

```js
cwd: workspacePath
```

This means the ESLint or Prettier process executes **from the target workspace**.

Conceptually:

```text
run-workspace-command
        │
        ├── frontend
        │      └── cwd = /frontend
        │
        └── backend
               └── cwd = /backend
```

This is important because the workspace-specific tooling should operate in the context of its own project.

---

**D. Normalizing file paths**

The runner also normalizes absolute file paths:

```js
const normalizedArgs = args.map((arg) => {
  if (!isAbsolute(arg)) {
    return arg;
  }

  return relative(workspacePath, arg);
});
```

If `lint-staged` provides:

```text
C:/project/habitwize/frontend/src/App.tsx
```

the runner converts it to something relative to the frontend workspace:

```text
src/App.tsx
```

This avoids passing workspace-external absolute paths when the command is already being executed inside the workspace.

---

**E. Executing the CLI**

The runner uses Node's `spawn()`:

```js
spawn(
  process.execPath,
  [resolve(workspacePath, cliPath), ...normalizedArgs],
  {
    cwd: workspacePath,
    stdio: "inherit",
    shell: false,
  },
);
```

There are several deliberate decisions here.

*`cwd: workspacePath`* - Executes the tool from the target workspace.

*`stdio: "inherit"`* - Allows the child process to use the same terminal input, output, and error streams. As a result, ESLint and Prettier output appears directly in the terminal running the Git command.

*`shell: false`* - The CLI is executed directly by Node rather than being passed through a shell. This keeps command execution explicit and avoids unnecessary shell interpretation.

---

**F. Propagating the exit code**

The runner listens for the child process to close:

```js
child.on("close", (code) => {
  process.exit(code ?? 1);
});
```

This is essential to the pre-commit workflow.

For example:

```text
ESLint succeeds
    ↓
exit code = 0
    ↓
runner exits with 0
    ↓
lint-staged succeeds
    ↓
commit continues
```

But:

```text
ESLint fails
    ↓
exit code != 0
    ↓
runner propagates failure
    ↓
lint-staged fails
    ↓
pre-commit fails
    ↓
commit is rejected
```

Without exit-code propagation, a failing linting process could potentially be treated as a successful command by the calling workflow.

---

### **1.7 Complete Flow**

The final pre-commit architecture can therefore be represented as:

```text
                       git commit
                           │
                           ▼
                         Husky
                           │
                           ▼
                  .husky/pre-commit
                           │
                           ▼
                     lint-staged
                           │
                           ▼
                lint-staged.config.mjs
                           │
            ┌──────────────┴──────────────┐
            │                             │
            ▼                             ▼
       Frontend files                Backend files
            │                             │
            ▼                             ▼
 run-workspace-command.mjs      run-workspace-command.mjs
            │                             │
            ▼                             ▼
      Frontend cwd                   Backend cwd
            │                             │
      ┌─────┴─────┐                 ┌────┴─────┐
      ▼           ▼                 ▼          ▼
    ESLint      Prettier           ESLint    Prettier
      │           │                 │          │
      └─────┬─────┘                 └────┬─────┘
            │                             │
            └──────────────┬──────────────┘
                           ▼
                     Exit status
                           │
                  ┌────────┴────────┐
                  │                 │
                Success            Failure
                  │                 │
                  ▼                 ▼
             Commit created    Commit rejected
```

This architecture provides a single repository-level workflow while preserving independent workspace-level tooling.

---

### **1.8 Verification**

After implementing the solution, I tested the workflow with multiple staged file naming patterns, including:

```text
git test.ts
git-test.ts
```

The purpose of these tests was to verify that file matching, argument construction, and workspace-specific command execution worked correctly even when filenames contained characters that could affect command construction.

The tests confirmed that staged files were detected by `lint-staged` and processed by the expected workspace tooling. 

I also verified the failure behaviour by intentionally introducing linting/formatting violations and confirming that the pre-commit workflow prevented the commit from proceeding.

---

### **1.9 Final Result**

The final implementation achieved the intended architecture:

```text
Repository level
├── Husky
├── lint-staged
├── Commit hooks
└── Workspace orchestration

Frontend level
├── ESLint configuration
├── Prettier configuration
└── Frontend-specific dependencies

Backend level
├── ESLint configuration
├── Prettier configuration
└── Backend-specific dependencies
```

The important characteristic of this solution is that **centralization was applied only where it made sense**.

Git-related workflow and orchestration are centralized at the repository level, while application-specific linting and formatting remain inside their respective workspaces.

As a result:

* The repository has a single pre-commit workflow.
* Only staged files are processed.
* Frontend files use frontend tooling.
* Backend files use backend tooling.
* Workspace-specific configurations remain independent.
* Git-hook logic does not need to be duplicated across applications.

The final setup therefore provides **centralized coordination without sacrificing workspace isolation**. The root-level Git tooling and workspace structure documented earlier provide the foundation for this design. 

---

### **1.10 What I Learned**

This was one of the first situations where I had to design development tooling across multiple independent workspaces instead of configuring a single application in isolation.

The most important lesson was:

> **A centralized workflow does not require centralized configuration.**

The repository can centrally manage:

```text
Git hooks
lint-staged
commit validation
workspace orchestration
```

while allowing each application to independently manage:

```text
ESLint
Prettier
TypeScript
application-specific tooling
```

I also learned that when introducing a root workspace, it is important to clearly distinguish between **repository-level responsibilities** and **workspace-level responsibilities**.

The root should provide coordination where consistency is required, while individual workspaces should retain ownership of configuration that is specific to their application.

Most importantly, this challenge shifted my approach from simply asking:

> *“How do I make this tool work?”*

to asking:

> *“How should this tool fit into the architecture of the repository?”*

That distinction is an important part of developing a **production-ready engineering mindset**.

---

### **1.11 Key Takeaway**

The final solution can be summarized in one sentence:

> **Husky triggers the repository-level Git hook, `lint-staged` identifies and routes staged files, and the custom workspace command runner executes the appropriate ESLint and Prettier tooling within the owning workspace.**

This allowed me to solve a practical multi-workspace tooling problem while maintaining **separation of concerns, workspace independence, and a consistent developer workflow**.
