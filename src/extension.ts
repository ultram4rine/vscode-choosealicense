import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Utils } from "./utils";

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  let disposable = vscode.commands.registerCommand(
    "license.choose",
    async () => {
      let licenses = await Utils.getLicenses();

      let quickPick = vscode.window.createQuickPick();

      quickPick.items = licenses.map(license => {
        return {
          label: license.key,
          detail: license.name
        };
      });
      quickPick.placeholder = "Choose a license from list.";
      quickPick.onDidChangeSelection(async selection => {
        quickPick.dispose();

        let selectedLicense = selection[0].label;
        let licenseText = await Utils.getLicenseText(selectedLicense);

        // TODO: rootPath is deprecated.
        let currentFolder = vscode.workspace.rootPath;
        if (currentFolder === undefined) {
          vscode.window.showErrorMessage("No open folder");
        } else {
          vscode.window.showInformationMessage(currentFolder);
          let licensePath = path.join(currentFolder, "LICENSE");
          fs.writeFileSync(licensePath, licenseText.body, "utf8");
        }
      });
      quickPick.onDidHide(() => quickPick.dispose());
      quickPick.show();
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
