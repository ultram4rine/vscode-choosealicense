import { window, workspace, ConfigurationTarget } from "vscode";

export default class Config {
  public static async setConfProperty(property: string): Promise<void> {
    const value = await window.showInputBox({
      prompt: `Set ${property} for licenses`,
    });

    if (value) {
      this.setProp(property, value);
    }
  }

  public static async setYearProperty(): Promise<void> {
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
          this.setProp("year", value);
          break;
        case "current":
          this.setProp("year", new Date().getFullYear().toString());
          break;
        case "certain":
          {
            const year = await window.showInputBox({
              prompt: "Set year for licenses",
            });

            if (year) {
              this.setProp("year", year);
            }
          }
          break;
        default:
          window.showErrorMessage("Invalid year selection");
          break;
      }
    }
  }

  public static async setExtensionProperty(): Promise<void> {
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
      this.setProp("extension", selected.value);
    }
  }

  /*public static async setScanProperty(): Promise<void> {
    const value = await window.showQuickPick(
      [
        {
          label: "Yes",
          description: "Create licenses without extension",
          value: true,
        },
        {
          label: "No",
          description: "Create licenses with md extension",
          value: false,
        },
      ],
      { placeHolder: "Select license file extension." }
    );

    if (value) {
      this.setProp("scan", value.value);
    }
  }*/

  private static async setProp(property: string, value: any): Promise<void> {
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
          .getConfiguration()
          .update(`license.${property}`, value, selected.target);
      }
    } else {
      await workspace
        .getConfiguration()
        .update(`license.${property}`, value, ConfigurationTarget.Global);
    }
  }
}
