import * as vscode from "vscode";

export const setDefaultLicenseProperty = async (value: string) => {
  await setProp("default", value);
};

export const setAuthorProperty = async (value: string) => {
  await setProp("author", value);
};

export const setYearProperty = async (value: string) => {
  await setProp("year", value);
};

export const setExtensionProperty = async (value: string) => {
  await setProp("extension", value);
};

export const setFilenameProperty = async (value: string) => {
  await setProp("filename", value);
};

export const setTokenProperty = async (value: string) => {
  await setProp("token", value);
};

const setProp = async (property: string, value: string) => {
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
