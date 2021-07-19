import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import Config from "../config";
import GraphQL from "../api";
import Utils from "../utils";

export const choose = vscode.commands.registerCommand(
  "license.choose",
  async () => {
    try {
      const licenses = await GraphQL.getLicenses();

      const selected = await vscode.window.showQuickPick(
        licenses.map((l) => {
          return { label: l.spdxId, detail: l.name, key: l.key };
        }),
        { placeHolder: "Choose a license from the list." }
      );

      if (selected) {
        const key = selected.key;

        try {
          const license = await GraphQL.getLicense(key);
          let text = license.body;

          let folders = vscode.workspace.workspaceFolders;
          if (folders === undefined) {
            vscode.window.showErrorMessage("No folder to create a license");
          } else {
            const author: string | undefined = vscode.workspace
              .getConfiguration("license")
              .get("author");
            let year: string | undefined = vscode.workspace
              .getConfiguration("license")
              .get("year");
            const extension: string | undefined = vscode.workspace
              .getConfiguration("license")
              .get("extension");

            if (year !== undefined) {
              if (year === "auto") {
                year = new Date().getFullYear().toString();
              }
              text = Utils.replaceYear(year, key, text);
            }

            if (author !== undefined) {
              text = Utils.replaceAuthor(author, key, text);
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
              if (extension !== undefined) {
                const licensePath = path.join(
                  folder.uri.fsPath,
                  `LICENSE${extension}`
                );

                if (fs.existsSync(licensePath)) {
                  const answer = await vscode.window.showInformationMessage(
                    "License file already exists in this folder. Override it?",
                    "Yes",
                    "No"
                  );

                  if (answer === "Yes") {
                    fs.writeFileSync(licensePath, text, "utf8");
                  }
                } else {
                  fs.writeFileSync(licensePath, text, "utf8");
                }
              }
            }
          }
        } catch (error) {
          vscode.window.showErrorMessage(error.message);
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage(error.message);
    }
  }
);

export const setAuthor = vscode.commands.registerCommand(
  "license.setAuthor",
  async () => {
    Config.setAuthorProperty();
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

export const setToken = vscode.commands.registerCommand(
  "license.setToken",
  async () => {
    Config.setTokenProperty();
  }
);
