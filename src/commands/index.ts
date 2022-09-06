import * as vscode from "vscode";

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
import { Licenses, License } from "../types";

/**
 * Uncommon licenses.
 * They not seen at `/licenses`, but accessible at `/licenses/<key>`.
 */
/* eslint-disable @typescript-eslint/naming-convention */
export const uncommonLicenses: Licenses = [
  {
    key: "cc-by-4.0",
    name: "Creative Commons Attribution 4.0 International",
    spdx_id: "CC-BY-4.0",
    url: "https://api.github.com/licenses/cc-by-4.0",
    node_id: "MDc6TGljZW5zZTI1",
    html_url: "http://choosealicense.com/licenses/cc-by-4.0/",
  },
  {
    key: "isc",
    name: "ISC License",
    spdx_id: "ISC",
    url: "https://api.github.com/licenses/isc",
    node_id: "MDc6TGljZW5zZTEw",
    html_url: "http://choosealicense.com/licenses/isc/",
  },
  {
    key: "wtfpl",
    name: "Do What The F*ck You Want To Public License",
    spdx_id: "WTFPL",
    url: "https://api.github.com/licenses/wtfpl",
    node_id: "MDc6TGljZW5zZTE4",
    html_url: "http://choosealicense.com/licenses/wtfpl/",
  },
];

const licenseToQuickPickItem = (
  l: {
    key: string;
    name: string;
    spdx_id: string | null;
    url: string | null;
    node_id: string;
    html_url?: string | undefined;
  },
  defaultKey: string
): {
  label: string;
  detail?: string;
  description?: string;
  key: string;
  alwaysShow?: boolean;
  kind?: vscode.QuickPickItemKind;
} => {
  return l.key === defaultKey
    ? {
        label: l.spdx_id ? l.spdx_id : l.key,
        detail: l.name,
        description: "Default",
        key: l.key,
        alwaysShow: true,
      }
    : {
        label: l.spdx_id ? l.spdx_id : l.key,
        detail: l.name,
        key: l.key,
      };
};
/* eslint-enable @typescript-eslint/naming-convention */

export const chooseLicense = vscode.commands.registerCommand(
  "license.chooseLicense",
  async () => {
    try {
      const licenses = await getLicenses();

      const defaultKey: string =
        vscode.workspace.getConfiguration("license").get("default") ?? "";

      const selected = await vscode.window.showQuickPick(
        licenses
          .map((l) => licenseToQuickPickItem(l, defaultKey))
          .concat([
            {
              label: "Uncommon licenses",
              key: "separator",
              kind: vscode.QuickPickItemKind.Separator,
            },
          ])
          .concat(
            uncommonLicenses.map((l) => licenseToQuickPickItem(l, defaultKey))
          ),
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
  }
);

export const addDefaultLicense = vscode.commands.registerCommand(
  "license.addDefaultLicense",
  async () => {
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
  }
);

export const setDefaultLicense = vscode.commands.registerCommand(
  "license.setDefaultLicense",
  async () => {
    try {
      const licenses = await getLicenses();

      const selected = await vscode.window.showQuickPick(
        licenses
          .map((l) => licenseToQuickPickItem(l, ""))
          .concat([
            {
              label: "Uncommon licenses",
              key: "separator",
              kind: vscode.QuickPickItemKind.Separator,
            },
          ])
          .concat(uncommonLicenses.map((l) => licenseToQuickPickItem(l, ""))),
        { placeHolder: "Set default license to use." }
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
  setAuthorProperty
);

export const setYear = vscode.commands.registerCommand(
  "license.setYear",
  setYearProperty
);

export const setExtension = vscode.commands.registerCommand(
  "license.setExtension",
  setExtensionProperty
);

export const setFilename = vscode.commands.registerCommand(
  "license.setFilename",
  setFilenameProperty
);

export const setToken = vscode.commands.registerCommand(
  "license.setToken",
  setTokenProperty
);

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

    const content = new TextEncoder().encode(text);
    const licensePath = vscode.Uri.file(
      `${folder.uri.fsPath}/${filename}${extension}`
    );

    try {
      await vscode.workspace.fs.stat(licensePath);

      const answer = await vscode.window.showInformationMessage(
        "License file already exists in this folder. Override it?",
        "Yes",
        "No"
      );

      if (answer === "Yes") {
        await vscode.workspace.fs.writeFile(licensePath, content);
      }
    } catch {
      await vscode.workspace.fs.writeFile(licensePath, content);
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
