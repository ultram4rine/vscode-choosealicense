import * as vscode from "vscode";

export const setDefaultLicenseProperty = async (value: string) => {
  await setProp("default", value);
};

export const setAuthorProperty = async () => {
  const value = await vscode.window.showInputBox({
    prompt: "Set author for licenses",
  });

  if (value) {
    await setProp("author", value);
  }
};

export const setYearProperty = async () => {
  const selected = await vscode.window.showQuickPick(
    [
      {
        label: "Auto",
        description: "Automatic year detection",
        value: "auto",
      },
      {
        label: "Current",
        description: "Set current year",
        value: "current",
      },
      {
        label: "Certain",
        description: "Set certain year",
        value: "certain",
      },
    ],
    { placeHolder: "Select year for licenses." }
  );

  if (selected) {
    const value = selected.value;
    switch (value) {
      case "auto":
        await setProp("year", value);
        break;
      case "current":
        await setProp("year", new Date().getFullYear().toString());
        break;
      case "certain":
        {
          const year = await vscode.window.showInputBox({
            prompt: "Set year for licenses",
          });

          if (year) {
            await setProp("year", year);
          }
        }
        break;
      default:
        vscode.window.showErrorMessage("Invalid year selection");
        break;
    }
  }
};

export const setExtensionProperty = async () => {
  const selected = await vscode.window.showQuickPick(
    [
      {
        label: "Empty",
        description: "Create licenses without extension",
        value: "empty",
      },
      {
        label: "Markdown",
        description: "Create licenses with .md extension",
        value: ".md",
      },
      {
        label: "Text",
        description: "Create licenses with .txt extension",
        value: ".txt",
      },
    ],
    { placeHolder: "Select license file extension." }
  );

  if (selected) {
    await setProp("extension", selected.value);
  }
};

export const setFilenameProperty = async () => {
  const value = await vscode.window.showInputBox({
    prompt: "Set license filename.",
  });

  if (value) {
    await setProp("filename", value);
  }
};

export const setTokenProperty = async () => {
  const value = await vscode.window.showInputBox({
    prompt: "Set token for GitHub API access",
  });

  if (value) {
    await setProp("token", value);
  }
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

    if (value && selected) {
      if (property === "extension" && value === "empty") {
        value = "";
      }

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
