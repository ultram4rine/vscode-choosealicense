import * as vscode from "vscode";

export const setDefaultLicenseProperty = async (value: string) => {
  await setProp("default", value);
};

export const setAuthorProperty = async () => {
  const author: string =
    vscode.workspace.getConfiguration("license").get("author") ?? "";

  const value = await vscode.window.showInputBox({
    placeHolder: "Author",
    prompt: "Set author for licenses",
    value: author,
  });

  if (value) {
    await setProp("author", value);
  }
};

export const setYearProperty = async () => {
  const currentYear = new Date().getFullYear().toString();
  const selected = await vscode.window.showQuickPick(
    [
      {
        label: "Auto",
        detail: "Set automatic year detection",
        value: "auto",
      },
      {
        label: "Current",
        detail: "Set current year",
        description: currentYear,
        value: "current",
      },
      {
        label: "Certain",
        detail: "Set certain year",
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
            placeHolder: "Year",
            prompt: "Set year for licenses",
            value: currentYear,
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
        detail: "Create licenses without extension",
        value: "",
      },
      {
        label: "Markdown",
        detail: "Create licenses with .md extension",
        value: ".md",
      },
      {
        label: "Text",
        detail: "Create licenses with .txt extension",
        value: ".txt",
      },
    ],
    { placeHolder: "Set extension for license files." }
  );

  if (selected) {
    await setProp("extension", selected.value);
  }
};

export const setFilenameProperty = async () => {
  const filename: string =
    vscode.workspace.getConfiguration("license").get("filename") ?? "LICENSE";

  const value = await vscode.window.showInputBox({
    placeHolder: "Filename",
    prompt: "Set filename for license files.",
    value: filename,
  });

  if (value) {
    await setProp("filename", value);
  }
};

export const setTokenProperty = async () => {
  const value = await vscode.window.showInputBox({
    placeHolder: "Token",
    prompt: "Set token for GitHub REST API access.",
    password: true,
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
