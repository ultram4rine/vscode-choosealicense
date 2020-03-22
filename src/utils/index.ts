import { window, workspace, ConfigurationTarget } from "vscode";
import { json } from "web-request";

interface License {
  key: string;
  name: string;
}

interface LicenseText {
  body: string;
}

export class Utils {
  public static async getLicenses(): Promise<License[]> {
    const url = "https://api.github.com/licenses";
    let data = await json<License[]>(url, {
      headers: { "User-Agent": "request" }
    });

    return data;
  }

  public static async getLicenseText(key: string): Promise<LicenseText> {
    const url = `https://api.github.com/licenses/${key}`;
    let data = await json<LicenseText>(url, {
      headers: { "User-Agent": "request" }
    });

    return data;
  }

  public static async setConfProperty(property: string): Promise<void> {
    const value = await window.showInputBox({
      prompt: `Set ${property} for licenses`
    });

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
