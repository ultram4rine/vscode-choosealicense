import * as vscode from "vscode";

import { RequestError } from "@octokit/request-error";

import { getLicense, getLicenses } from "../api";
import { GitExtension } from "../api/git";
import {
  setAuthorProperty,
  setDefaultLicenseProperty,
  setExtensionProperty,
  setFilenameProperty,
  setTokenProperty,
  setYearProperty,
} from "../config";
import { License, LicenseItem } from "../types";
import { replaceAuthor, replaceYear } from "../utils";

/**
 * Uncommon licenses.
 * They not seen at `/licenses`, but accessible at `/licenses/<key>`.
 */
/* eslint-disable @typescript-eslint/naming-convention */
export const uncommonLicenses: LicenseItem[] = [
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

interface QuickPickLicenseItem {
  label: string;
  detail?: string | undefined;
  description?: string | undefined;
  key: string;
  alwaysShow?: boolean | undefined;
  kind?: vscode.QuickPickItemKind | undefined;
  buttons?: vscode.QuickInputButton[];
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
        // add buttons for quickpick item. feat: set default license
        buttons: [
          {
            iconPath: new vscode.ThemeIcon("star"),
            tooltip: "Set Default",
          },
        ],
      };
};
/* eslint-enable @typescript-eslint/naming-convention */

const showLicenses = async (
  options?: vscode.QuickPickOptions
): Promise<QuickPickLicenseItem[] | undefined> => {
  return new Promise(async (resolve, reject) => {
    const quickPick = vscode.window.createQuickPick();
    quickPick.placeholder = options!.placeHolder;
    quickPick.canSelectMany = options!.canPickMany!;

    const defaultKey: string =
      vscode.workspace.getConfiguration("license").get("default") ?? "";

    quickPick.busy = true;
    const licenses = await getLicenses();
    quickPick.items = licenses
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
      );

    quickPick.busy = false;

    quickPick.onDidAccept(() => {
      resolve(quickPick.selectedItems as QuickPickLicenseItem[]);
      quickPick.hide();
    });

    // push button will set default license
    quickPick.onDidTriggerItemButton(async (e) => {
      await setDefaultLicenseProperty((e.item as QuickPickLicenseItem).key);
    });

    quickPick.onDidHide(() => {
      quickPick.dispose();
    });
    quickPick.show();
  });
};

export const chooseLicense = async (context: vscode.ExtensionContext) => {
  try {
    const selected = await showLicenses({
      placeHolder: "Choose a license to create.",
      canPickMany: false,
    });

    if (selected) {
      const key = selected[0].key;

      try {
        const license = await getLicense(key);
        await addLicense(context, license, false);
      } catch (error) {
        vscode.window.showErrorMessage((error as RequestError).message);
      }
    }
  } catch (error) {
    vscode.window.showErrorMessage((error as RequestError).message);
  }
};

export const addDefaultLicense = async (context: vscode.ExtensionContext) => {
  try {
    const key: string =
      vscode.workspace.getConfiguration("license").get("default") ?? "";

    if (key !== "") {
      const license = await getLicense(key);
      await addLicense(context, license, false);
    } else {
      vscode.window.showErrorMessage("No default license provided");
    }
  } catch (error) {
    vscode.window.showErrorMessage((error as RequestError).message);
  }
};

export const chooseMultipleLicenses = async (
  context: vscode.ExtensionContext
) => {
  try {
    const selected = await showLicenses({
      placeHolder: "Choose multiple licenses to create.",
      canPickMany: true,
    });

    if (selected) {
      selected.forEach(async (select) => {
        try {
          const license = await getLicense(select.key);
          await addLicense(context, license, true);
        } catch (error) {
          vscode.window.showErrorMessage((error as RequestError).message);
        }
      });
    }
  } catch (error) {
    vscode.window.showErrorMessage((error as RequestError).message);
  }
};

export const setDefaultLicense = vscode.commands.registerCommand(
  "license.setDefaultLicense",
  async () => {
    try {
      const selected = await showLicenses({
        placeHolder: "Set default license to use.",
        canPickMany: false,
      });

      if (selected) {
        await setDefaultLicenseProperty(selected[0].key);
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

const addLicense = async (
  context: vscode.ExtensionContext,
  license: License,
  multiple: boolean
) => {
  const folder = await chooseFolder();
  if (folder) {
    let text = license.body;

    const extension: string =
      vscode.workspace.getConfiguration("license").get("extension") ?? "";

    const filename: string =
      vscode.workspace.getConfiguration("license").get("filename") ?? "LICENSE";

    const licensePath = vscode.Uri.file(
      `${folder.uri.fsPath}/${filename}${
        multiple ? `-${license.spdx_id?.toUpperCase()}` : ""
      }${extension}`
    );

    let year: string = vscode.workspace
      .getConfiguration("license")
      .get("year")!;

    // DONE: feat: autoupdate license year if set to auto. fix issue #578
    if (year === "auto") {
      // context.workspaceState.update(license.key, 1997); // test --> 1997-2023
      // about workspaceState, refer https://code.visualstudio.com/api/references/vscode-api#Memento
      let prevYear = context.workspaceState.get<number>(license.key);
      let currYear = new Date().getFullYear();
      if (prevYear === undefined || prevYear === currYear) {
        year = currYear + "";
      } else {
        year = `${prevYear}-${currYear}`;
      }
    }
    text = replaceYear(year, license.key, text);

    // DONE: feat: autoassign author from git. fix issue #579
    // get author by 'git config --global --get user.name'
    let author: string | undefined = vscode.workspace
      .getConfiguration("license")
      .get("author");

    // get author from .gitconfig
    const gitExtension =
      vscode.extensions.getExtension<GitExtension>("vscode.git")!.exports;
    const git = gitExtension.getAPI(1);

    // folder must be a git repo
    const repo = git.getRepository(folder.uri);
    if (!repo) {
      vscode.window.showErrorMessage("Please use git init.");
      return;
    }

    if (!author) {
      // local
      repo
        .getConfig("user.name")
        .then((localAuthor) => {
          text = replaceAuthor(localAuthor, license.key, text);
          generate(licensePath, text);
        })
        .catch(() => {
          // global
          repo
            .getGlobalConfig("user.name")
            .then((globalAuthor) => {
              text = replaceAuthor(globalAuthor, license.key, text);
              generate(licensePath, text);
            })
            .catch(() => {
              vscode.commands.executeCommand("license.setAuthor");
            });
        });
    } else {
      text = replaceAuthor(author, license.key, text);
      generate(licensePath, text);
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

const generate = async (uri: vscode.Uri, text: string) => {
  const content = new TextEncoder().encode(text);
  try {
    await vscode.workspace.fs.stat(uri);

    const answer = await vscode.window.showInformationMessage(
      "License file already exists in this folder. Override it?",
      "Yes",
      "No"
    );

    if (answer === "Yes") {
      download(uri, content);
    }
  } catch {
    download(uri, content);
  }
};

// just a progress
const download = (licensePath: vscode.Uri, content: Uint8Array) => {
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
    },
    async (progress) => {
      progress.report({
        message: "Downloading ...",
      });

      await vscode.workspace.fs.writeFile(licensePath, content);
    }
  );
};
