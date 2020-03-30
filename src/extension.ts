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

      let folders = vscode.workspace.workspaceFolders;
      if (folders === undefined) {
        vscode.window.showErrorMessage("No folder to create a license");
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

        let folder: vscode.WorkspaceFolder | undefined;
        if (folders.length === 1) {
          folder = folders[0];
        } else {
          folder = await vscode.window.showWorkspaceFolderPick();
        }

        if (folder === undefined) {
          vscode.window.showErrorMessage("No folder to create a license");
        } else {
          let licensePath = path.join(folder.uri.fsPath, `LICENSE${extension}`);
          if (fs.existsSync(licensePath)) {
            vscode.window
              .showInformationMessage(
                "License file already exists in this folder. Override it?",
                "Yes",
                "No"
              )
              .then(ans => {
                if (ans === "Yes") {
                  fs.writeFileSync(licensePath, licenseText.body, "utf8");
                }
              });
          } else {
            fs.writeFileSync(licensePath, licenseText.body, "utf8");
          }
        }
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
    Utils.setExtensionProperty();
  });
}

export function deactivate() {}
