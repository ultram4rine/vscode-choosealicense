import { window, workspace, ConfigurationTarget } from "vscode";

export class Config {
  public static async setConfProperty(property: string): Promise<void> {
    const value = await window.showInputBox({
      prompt: `Set ${property} for licenses`
    });

    if (value) {
      this.setProp(property, value);
    }
  }

  public static async setExtensionProperty(): Promise<void> {
    const value = await window.showQuickPick(
      [
        {
          label: "Empty",
          description: "Create licenses without extension",
          value: "empty"
        },
        {
          label: "Markdown",
          description: "Create licenses with md extension",
          value: "md"
        },
        {
          label: "Text",
          description: "Create licenses with txt extension",
          value: "txt"
        }
      ],
      { placeHolder: "Select license file extension." }
    );

    if (value) {
      this.setProp("extension", value.value);
    }
  }

  private static async setProp(property: string, value: string): Promise<void> {
    if (workspace.workspaceFolders) {
      const target = await window.showQuickPick(
        [
          {
            label: "User",
            description: "User Settings",
            target: ConfigurationTarget.Global
          },
          {
            label: "Workspace",
            description: "Workspace Settings",
            target: ConfigurationTarget.Workspace
          }
        ],
        { placeHolder: "Select the configuration target." }
      );

      if (value && target) {
        if (property === "extension" && value === "empty") {
          value = "";
        }

        await workspace
          .getConfiguration()
          .update(`license.${property}`, value, target.target);
      }
    } else {
      await workspace
        .getConfiguration()
        .update(`license.${property}`, value, ConfigurationTarget.Global);
    }
  }
}
