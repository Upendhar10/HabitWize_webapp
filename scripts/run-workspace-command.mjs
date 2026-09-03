import { spawn } from "node:child_process";
import { isAbsolute, relative, resolve } from "node:path";

const [, , workspace, command, ...args] = process.argv;

if (!workspace || !command) {
  console.error(
    "Usage: node scripts/run-workspace-command.mjs <workspace> <command> [args...]",
  );

  process.exit(1);
}

const workspacePath = resolve(workspace);

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

const cliPath = cliPaths[command]?.[workspace];

if (!cliPath) {
  console.error(
    `Unsupported command "${command}" for workspace "${workspace}".`,
  );

  process.exit(1);
}

const normalizedArgs = args.map((arg) => {
  if (!isAbsolute(arg)) {
    return arg;
  }

  return relative(workspacePath, arg);
});

const child = spawn(
  process.execPath,
  [resolve(workspacePath, cliPath), ...normalizedArgs],
  {
    cwd: workspacePath,
    stdio: "inherit",
    shell: false,
  },
);

child.on("error", (error) => {
  console.error("Failed to start child process:", error);
  process.exit(1);
});

child.on("close", (code) => {
  process.exit(code ?? 1);
});
