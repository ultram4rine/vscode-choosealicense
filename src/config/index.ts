import * as vscode from "vscode";

export const setProp = async (property: string, value: string) => {
  if (vscode.workspace.workspaceFolders) {
    const selected = await vscode.window.showQuickPick(
      [
        {
          label: "User",
          description: "User Settings",
          target: vscode.ConfigurationTarget.Global,
        },
        {
          label: "Workspace",
          description: "Workspace Settings",
          target: vscode.ConfigurationTarget.Workspace,
        },
      ],
      { placeHolder: "Select the configuration target." }
    );

    if (selected) {
      await vscode.workspace
        .getConfiguration("license")
        .update(property, value, selected.target);
    }
  } else {
    await vscode.workspace
      .getConfiguration("license")
      .update(property, value, vscode.ConfigurationTarget.Global);
  }
};
