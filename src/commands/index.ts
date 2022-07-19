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

export const chooseLicense = async () => {
  try {
    const licenses = await getLicenses();

    const defaultKey: string =
      vscode.workspace.getConfiguration("license").get("default") ?? "";

    const selected = await vscode.window.showQuickPick(
      licenses.map((l) => {
        if (defaultKey === l.key) {
          return {
            label: l.spdx_id ? l.spdx_id : l.key,
            detail: l.name,
            description: "Default",
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
      { placeHolder: "Choose a license to create." }
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
};

export const addDefaultLicense = async () => {
  try {
    const key: string =
      vscode.workspace.getConfiguration("license").get("default") ?? "";

    if (key !== "") {
      const license = await getLicense(key);
      await addLicense(license);
    } else {
      vscode.window.showErrorMessage("No default license provided");
    }
  } catch (error) {
    vscode.window.showErrorMessage((error as RequestError).message);
  }
};

const addLicense = async (license: License) => {
  const folder = await chooseFolder();
  if (folder) {
    const author: string =
      vscode.workspace.getConfiguration("license").get("author") ?? "";
    let year: string =
      vscode.workspace.getConfiguration("license").get("year") ?? "auto";

    let text = license.body;

    if (year !== "") {
      if (year === "auto") {
        year = new Date().getFullYear().toString();
      }
      text = replaceYear(year, license.key, text);
    }

    if (author !== "") {
      text = replaceAuthor(author, license.key, text);
    }

    const extension: string =
      vscode.workspace.getConfiguration("license").get("extension") ?? "";

    const filename: string =
      vscode.workspace.getConfiguration("license").get("filename") ?? "LICENSE";

    const licensePath = path.join(folder.uri.fsPath, `${filename}${extension}`);

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

export const setDefaultLicense = async () => {
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
      { placeHolder: "Set default license to use." }
    );

    if (selected) {
      await setDefaultLicenseProperty(selected.key);
    }
  } catch (error) {
    vscode.window.showErrorMessage((error as RequestError).message);
  }
};

export const setAuthor = async () => {
  const author: string =
    vscode.workspace.getConfiguration("license").get("author") ?? "";

  const value = await vscode.window.showInputBox({
    placeHolder: "Author",
    prompt: "Set author for licenses",
    value: author,
  });

  if (value) {
    await setAuthorProperty(value);
  }
};

export const setYear = async () => {
  const currentYear = new Date().getFullYear().toString();
  const selected = await vscode.window.showQuickPick(
    [
      {
        label: "Auto",
        detail: "Set automatic year detection",
        value: "auto",
      },
      {
        label: "Current",
        detail: "Set current year",
        description: currentYear,
        value: "current",
      },
      {
        label: "Certain",
        detail: "Set certain year",
        value: "certain",
      },
    ],
    { placeHolder: "Select year for licenses." }
  );

  if (selected) {
    const value = selected.value;
    switch (value) {
      case "auto":
        await setYearProperty(value);
        break;
      case "current":
        await setYearProperty(new Date().getFullYear().toString());
        break;
      case "certain":
        {
          const year = await vscode.window.showInputBox({
            placeHolder: "Year",
            prompt: "Set year for licenses",
            value: currentYear,
          });

          if (year) {
            await setYearProperty(year);
          }
        }
        break;
      default:
        vscode.window.showErrorMessage("Invalid year selection");
        break;
    }
  }
};

export const setExtension = async () => {
  const selected = await vscode.window.showQuickPick(
    [
      {
        label: "Empty",
        detail: "Create licenses without extension",
        value: "",
      },
      {
        label: "Markdown",
        detail: "Create licenses with .md extension",
        value: ".md",
      },
      {
        label: "Text",
        detail: "Create licenses with .txt extension",
        value: ".txt",
      },
    ],
    { placeHolder: "Set extension for license files." }
  );

  if (selected) {
    await setExtensionProperty(selected.value);
  }
};

export const setFilename = async () => {
  const filename: string =
    vscode.workspace.getConfiguration("license").get("filename") ?? "LICENSE";

  const value = await vscode.window.showInputBox({
    placeHolder: "Filename",
    prompt: "Set filename for license files.",
    value: filename,
  });

  if (value) {
    await setFilenameProperty(value);
  }
};

export const setToken = async () => {
  const value = await vscode.window.showInputBox({
    placeHolder: "Token",
    prompt: "Set token for GitHub REST API access.",
    password: true,
  });

  if (value) {
    await setTokenProperty(value);
  }
};
