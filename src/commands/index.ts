import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import { RequestError } from "@octokit/request-error";

import {
  setDefaultLicenseProperty,
  setAuthorProperty,
  setYearProperty,
  setExtensionProperty,
  setFilenameProperty,
  setTokenProperty,
} from "../config";
import { getLicenses, getLicense } from "../api";
import { replaceAuthor, replaceYear } from "../utils";
import { License } from "../types";

export const chooseLicense = vscode.commands.registerCommand(
  "license.chooseLicense",
  async () => {
    try {
      const licenses = await getLicenses();

      const defaultKey: string | undefined = vscode.workspace
        .getConfiguration("license")
        .get("default");

      const selected = await vscode.window.showQuickPick(
        licenses.map((l) => {
          if (defaultKey === l.key) {
            return {
              label: `${l.spdx_id ? l.spdx_id : l.key} (Default)`,
              detail: l.name,
              key: l.key,
            };
          } else {
            return {
              label: l.spdx_id ? l.spdx_id : l.key,
              detail: l.name,
              key: l.key,
            };
          }
        }),
        { placeHolder: "Choose a license from the list." }
      );

      if (selected) {
        const key = selected.key;

        try {
          const license = await getLicense(key);
          await addLicense(license);
        } catch (error) {
          vscode.window.showErrorMessage((error as RequestError).message);
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage((error as RequestError).message);
    }
  }
);

export const addDefaultLicense = vscode.commands.registerCommand(
  "license.addDefaultLicense",
  async () => {
    try {
      const key: string | undefined = vscode.workspace
        .getConfiguration("license")
        .get("default");

      if (key) {
        const license = await getLicense(key);
        await addLicense(license);
      } else {
        vscode.window.showErrorMessage("No default license provided");
      }
    } catch (error) {
      vscode.window.showErrorMessage((error as RequestError).message);
    }
  }
);

export const setDefaultLicense = vscode.commands.registerCommand(
  "license.setDefaultLicense",
  async () => {
    try {
      const licenses = await getLicenses();

      const selected = await vscode.window.showQuickPick(
        licenses.map((l) => {
          return {
            label: l.spdx_id ? l.spdx_id : l.key,
            detail: l.name,
            key: l.key,
          };
        }),
        { placeHolder: "Choose a license from the list." }
      );

      if (selected) {
        await setDefaultLicenseProperty(selected.key);
      }
    } catch (error) {
      vscode.window.showErrorMessage((error as RequestError).message);
    }
  }
);

export const setAuthor = vscode.commands.registerCommand(
  "license.setAuthor",
  async () => {
    await setAuthorProperty();
  }
);

export const setYear = vscode.commands.registerCommand(
  "license.setYear",
  async () => {
    await setYearProperty();
  }
);

export const setExtension = vscode.commands.registerCommand(
  "license.setExtension",
  async () => {
    await setExtensionProperty();
  }
);

export const setFilename = vscode.commands.registerCommand(
  "license.setFilename",
  async () => {
    await setFilenameProperty();
  }
);

export const setToken = vscode.commands.registerCommand(
  "license.setToken",
  async () => {
    await setTokenProperty();
  }
);

const addLicense = async (license: License) => {
  const folder = await chooseFolder();
  if (folder) {
    const author: string | undefined = vscode.workspace
      .getConfiguration("license")
      .get("author");
    let year: string | undefined = vscode.workspace
      .getConfiguration("license")
      .get("year");

    let text = license.body;

    if (year) {
      if (year === "auto") {
        year = new Date().getFullYear().toString();
      }
      text = replaceYear(year, license.key, text);
    }

    if (author) {
      text = replaceAuthor(author, license.key, text);
    }

    const extension: string | undefined = vscode.workspace
      .getConfiguration("license")
      .get("extension");

    const filename: string =
      vscode.workspace.getConfiguration("license").get("filename") ?? "LICENSE";

    if (extension !== undefined) {
      const licensePath = path.join(
        folder.uri.fsPath,
        `${filename}${extension}`
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
  } else {
    vscode.window.showErrorMessage("No folder to create a license");
  }
};

const chooseFolder = async () => {
  let folders = vscode.workspace.workspaceFolders;
  if (folders) {
    let folder: vscode.WorkspaceFolder | undefined;
    if (folders.length === 1) {
      folder = folders[0];
    } else {
      folder = await vscode.window.showWorkspaceFolderPick();
    }
    return folder;
  } else {
    return undefined;
  }
};
