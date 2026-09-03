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
