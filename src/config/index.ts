import { window, workspace, ConfigurationTarget } from "vscode";

export const setDefaultLicenseProperty = async (value: string | undefined) => {
  if (value) {
    setProp("default", value);
  }
};

export const setAuthorProperty = async () => {
  const value = await window.showInputBox({
    prompt: "Set author for licenses",
  });

  if (value) {
    setProp("author", value);
  }
};

export const setYearProperty = async () => {
  const selected = await window.showQuickPick(
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
        setProp("year", value);
        break;
      case "current":
        setProp("year", new Date().getFullYear().toString());
        break;
      case "certain":
        {
          const year = await window.showInputBox({
            prompt: "Set year for licenses",
          });

          if (year) {
            setProp("year", year);
          }
        }
        break;
      default:
        window.showErrorMessage("Invalid year selection");
        break;
    }
  }
};

export const setExtensionProperty = async () => {
  const selected = await window.showQuickPick(
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
    setProp("extension", selected.value);
  }
};

export const setTokenProperty = async () => {
  const value = await window.showInputBox({
    prompt: "Set token for GitHub API access",
  });

  if (value) {
    setProp("token", value);
  }
};

const setProp = async (property: string, value: string) => {
  if (workspace.workspaceFolders) {
    const selected = await window.showQuickPick(
      [
        {
          label: "User",
          description: "User Settings",
          target: ConfigurationTarget.Global,
        },
        {
          label: "Workspace",
          description: "Workspace Settings",
          target: ConfigurationTarget.Workspace,
        },
      ],
      { placeHolder: "Select the configuration target." }
    );

    if (value && selected) {
      if (property === "extension" && value === "empty") {
        value = "";
      }

      await workspace
        .getConfiguration("license")
        .update(property, value, selected.target);
    }
  } else {
    await workspace
      .getConfiguration("license")
      .update(property, value, ConfigurationTarget.Global);
  }
};
