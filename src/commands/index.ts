import * as vscode from "vscode";

import { RequestError } from "@octokit/request-error";

import { getLicenses, getLicense } from "../api";
import { updateConfig, replaceAuthor, replaceYear } from "../utils";
import { LicenseItem, License } from "../types";

/**
 * Uncommon licenses.
 * They not seen at `/licenses`, but accessible at `/licenses/<key>`.
 */
export const uncommonLicenses: LicenseItem[] = [
  {
    key: "bsd-4-clause",
    name: 'BSD 4-Clause "Original" or "Old" License',
    spdx_id: "BSD-4-Clause",
    url: "https://api.github.com/licenses/bsd-4-clause",
    node_id: "MDc6TGljZW5zZTM5",
    html_url: "http://choosealicense.com/licenses/bsd-4-clause/",
  },
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
    key: "lgpl-3.0",
    name: "GNU Lesser General Public License v3.0",
    spdx_id: "LGPL-3.0",
    url: "https://api.github.com/licenses/lgpl-3.0",
    node_id: "MDc6TGljZW5zZTEy",
    html_url: "http://choosealicense.com/licenses/lgpl-3.0/",
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

interface QuickPickLicenseItem {
  label: string;
  detail?: string | undefined;
  description?: string | undefined;
  key: string;
  alwaysShow?: boolean | undefined;
  kind?: vscode.QuickPickItemKind | undefined;
}

const licenseToQuickPickItem = (
  l: LicenseItem,
  defaultKey: string
): QuickPickLicenseItem => {
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

const showLicenses = async (
  options?: vscode.QuickPickOptions
): Promise<QuickPickLicenseItem | QuickPickLicenseItem[] | undefined> => {
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
    options
  );

  return selected;
};

export const chooseLicense = async () => {
  try {
    const selected = await showLicenses({
      placeHolder: "Choose a license to create.",
    });

    if (selected && !Array.isArray(selected)) {
      const key = selected.key;

      try {
        const license = await getLicense(key);
        await addLicense(license, false);
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
      await addLicense(license, false);
    } else {
      vscode.window.showErrorMessage("No default license provided");
    }
  } catch (error) {
    vscode.window.showErrorMessage((error as RequestError).message);
  }
};

export const chooseMultipleLicenses = async () => {
  try {
    const selected = await showLicenses({
      placeHolder: "Choose multiple licenses to create.",
      canPickMany: true,
    });

    if (selected && Array.isArray(selected)) {
      const len = selected.length;
      for (let i = 0; i < len; i++) {
        const key = selected[i].key;

        try {
          const license = await getLicense(key);
          await addLicense(license, true);
        } catch (error) {
          vscode.window.showErrorMessage((error as RequestError).message);
        }
      }
    }
  } catch (error) {
    vscode.window.showErrorMessage((error as RequestError).message);
  }
};

const addLicense = async (license: License, multiple: boolean) => {
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
      `${folder.uri.fsPath}/${filename}${
        multiple ? `-${license.spdx_id?.toUpperCase()}` : ""
      }${extension}`
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
  const folders = vscode.workspace.workspaceFolders;
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

// Commands that modifies config.

export const setDefaultLicense = async () => {
  try {
    const selected = await showLicenses({
      placeHolder: "Set default license to use.",
    });

    if (selected && !Array.isArray(selected)) {
      await updateConfig("default", selected.key);
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
    await updateConfig("author", value);
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
        await updateConfig("year", value);
        break;
      case "current":
        await updateConfig("year", new Date().getFullYear().toString());
        break;
      case "certain":
        {
          const year = await vscode.window.showInputBox({
            placeHolder: "Year",
            prompt: "Set year for licenses",
            value: currentYear,
          });

          if (year) {
            await updateConfig("year", year);
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
    await updateConfig("extension", selected.value);
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
    await updateConfig("filename", value);
  }
};

export const setToken = async () => {
  const value = await vscode.window.showInputBox({
    placeHolder: "Token",
    prompt: "Set token for GitHub REST API access.",
    password: true,
  });

  if (value) {
    await updateConfig("token", value);
  }
};
