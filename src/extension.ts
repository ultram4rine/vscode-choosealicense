import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Utils } from "./utils";

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  vscode.commands.registerCommand("license.choose", async () => {
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
        let extension: any = vscode.workspace
          .getConfiguration("")
          .get("license.extension");
        let year: any = vscode.workspace
          .getConfiguration("")
          .get("license.year");
        let author: any = vscode.workspace
          .getConfiguration("")
          .get("license.author");

        vscode.window.showInformationMessage(`${extension} ${year} ${author}`);

        if (extension !== "") {
          extension = `.${extension}`;
        }

        if (year !== "") {
          licenseText.body = Utils.replaceYear(
            year,
            selectedLicense,
            licenseText.body
          );
        }

        if (author !== "") {
          licenseText.body = Utils.replaceAuthor(
            author,
            selectedLicense,
            licenseText.body
          );
        }

        let licensePath = path.join(currentFolder, `LICENSE${extension}`);
        fs.writeFileSync(licensePath, licenseText.body, "utf8");
      }
    });
    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
  });

  vscode.commands.registerCommand("license.setAuthor", async () => {
    Utils.setConfProperty("author");
  });

  vscode.commands.registerCommand("license.setYear", async () => {
    Utils.setConfProperty("year");
  });

  vscode.commands.registerCommand("license.setExtension", async () => {
    Utils.setConfProperty("extension");
  });
}

export function deactivate() {}
