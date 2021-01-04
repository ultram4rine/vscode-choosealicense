import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import Config from "../config";
import GraphQL from "../graphql";
import Utils from "../utils";

export const choose = vscode.commands.registerCommand(
  "license.choose",
  async () => {
    let licenses = await GraphQL.getLicenses();

    let quickPick = vscode.window.createQuickPick();

    quickPick.items = licenses.licenses.map((l) => {
      return {
        label: l.key,
        detail: l.name,
      };
    });

    quickPick.placeholder = "Choose a license from the list.";

    quickPick.onDidChangeSelection(async (selection) => {
      quickPick.dispose();

      let lKey = selection[0].label;
      let license = await GraphQL.getLicense(lKey);

      let lText = license.body;

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

        if (year !== "") {
          if (year === "auto") {
            year = new Date().getFullYear().toString();
          }
          lText = Utils.replaceYear(year, lKey, lText);
        }

        if (author !== "") {
          lText = Utils.replaceAuthor(author, lKey, lText);
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
              .then((ans) => {
                if (ans === "Yes") {
                  fs.writeFileSync(licensePath, lText, "utf8");
                }
              });
          } else {
            fs.writeFileSync(licensePath, lText, "utf8");
          }
        }
      }
    });
    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
  }
);

export const setAuthor = vscode.commands.registerCommand(
  "license.setAuthor",
  async () => {
    Config.setConfProperty("author");
  }
);

export const setYear = vscode.commands.registerCommand(
  "license.setYear",
  async () => {
    Config.setYearProperty();
  }
);

export const setExtension = vscode.commands.registerCommand(
  "license.setExtension",
  async () => {
    Config.setExtensionProperty();
  }
);
