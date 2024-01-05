import * as vscode from "vscode";

import { RequestError } from "@octokit/request-error";

import { getLicense, getLicenses } from "../api";
import { GitExtension } from "../api/git";
import { setDefaultLicenseProperty, WORKSPACE_STATE_YEAR_KEY } from "../config";
import { LicenseItem } from "../types";
import { replaceAuthor, replaceYear } from "../utils";

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
  buttons?: vscode.QuickInputButton[];
}

const licenseToQuickPickItem = (
  l: LicenseItem,
  defaultKey: string
): QuickPickLicenseItem =>
  l.key === defaultKey
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
        buttons: [
          {
            iconPath: new vscode.ThemeIcon("star"),
            tooltip: "Set as Default",
          },
        ],
      };

const showLicenses = async (
  options?: vscode.QuickPickOptions
): Promise<QuickPickLicenseItem[] | undefined> =>
  new Promise(async (resolve, _reject) => {
    const quickPick = vscode.window.createQuickPick();
    quickPick.placeholder = options!.placeHolder;
    quickPick.canSelectMany = options!.canPickMany!;

    const defaultKey: string =
      vscode.workspace.getConfiguration("license").get("default") ?? "";

    quickPick.busy = true;

    try {
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
    } catch (error) {
      vscode.window.showErrorMessage((error as RequestError).message);
    }
  });

export const chooseLicense = async (context: vscode.ExtensionContext) => {
  const selected = await showLicenses({
    placeHolder: "Choose a license to create.",
    canPickMany: false,
  });

  if (selected) {
    const key = selected[0].key;
    await addLicenses(context, [key]);
  }
};

export const addDefaultLicense = async (context: vscode.ExtensionContext) => {
  const key: string =
    vscode.workspace.getConfiguration("license").get("default") ?? "";

  if (key !== "") {
    await addLicenses(context, [key]);
  } else {
    vscode.window.showErrorMessage("No default license provided");
  }
};

export const chooseMultipleLicenses = async (
  context: vscode.ExtensionContext
) => {
  const selected = await showLicenses({
    placeHolder: "Choose multiple licenses to create.",
    canPickMany: true,
  });

  if (selected) {
    await addLicenses(
      context,
      selected.map((s) => s.key)
    );
  }
};

export const setDefaultLicense = async () => {
  const selected = await showLicenses({
    placeHolder: "Set default license to use.",
    canPickMany: false,
  });

  if (selected) {
    await setDefaultLicenseProperty(selected[0].key);
  }
};

const addLicenses = async (
  context: vscode.ExtensionContext,
  licensesKeys: string[]
) => {
  const multiple = licensesKeys.length > 1;
  const folder = await chooseFolder();
  if (folder) {
    for (const key of licensesKeys) {
      const license = await downloadLicense(key);
      let text = license.body;

      let author: string | undefined = vscode.workspace
        .getConfiguration("license")
        .get("author");

      let year: string = vscode.workspace
        .getConfiguration("license")
        .get("year")!;

      const extension: string =
        vscode.workspace.getConfiguration("license").get("extension") ?? "";

      const filename: string =
        vscode.workspace.getConfiguration("license").get("filename") ??
        "LICENSE";

      const licensePath = vscode.Uri.file(
        `${folder.uri.fsPath}/${filename}${
          multiple ? `-${license.spdx_id?.toUpperCase()}` : ""
        }${extension}`
      );

      let prevYear = context.workspaceState
        .get<number>(WORKSPACE_STATE_YEAR_KEY)
        ?.toString();

      if (year === "auto") {
        year = new Date().getFullYear().toString();
      }

      if (prevYear && prevYear !== year) {
        year = `${prevYear}-${year}`;
      }

      text = replaceYear(year, license.key, text);

      if (author) {
        text = replaceAuthor(author, license.key, text);
      } else if (
        vscode.workspace
          .getConfiguration("license")
          .get<boolean>("useAuthorFromGit")
      ) {
        // Try to retrieve author username from git config if it not set in settings.
        // Otherwise leave it as is.
        try {
          author = await getAuthorFromGitConfig();
          text = replaceAuthor(author, license.key, text);
        } catch (err) {
          vscode.window.showErrorMessage(
            `Failed to retrieve author from git config: ${err}`
          );
        }
      }

      const content = new TextEncoder().encode(text);
      try {
        await vscode.workspace.fs.stat(licensePath);

        const answer = await vscode.window.showInformationMessage(
          "License file already exists in this folder. Override it?",
          "Yes",
          "No"
        );

        if (answer === "Yes") {
          save(licensePath, content);
        }
      } catch {
        save(licensePath, content);
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

// TODO: quick pick author from repos.
/* if (repos.length > 1) {
  const filtered: { label: string; detail: string; key: string }[] =
    gitAuthor.config === "Global config"
      ? [
          {
            label: gitAuthor.name,
            detail: gitAuthor.config,
            key: gitAuthor.name,
          },
        ]
      : [];

  for (let r of repos) {
    let current = "";
    try {
      current = await r.getConfig("user.name");
    } catch {
      current = await r.getGlobalConfig("user.name");
    }

    if (current !== gitAuthor.name) {
      filtered.push({
        label: current,
        detail: r.rootUri.path,
        key: current,
      });
    }
  }
  if (filtered.length > 1) {
    const selected = await vscode.window.showQuickPick(filtered);
    if (selected) {
      gitAuthor.name = selected.key;
    }
  }
} */
const getAuthorFromGitConfig = async (): Promise<string> => {
  const gitExtension =
    vscode.extensions.getExtension<GitExtension>("vscode.git")!.exports;
  const git = gitExtension.getAPI(1);
  const repos = git.repositories;

  const useGitEmail = vscode.workspace
    .getConfiguration("license")
    .get<boolean>("useGitEmail");

  if (repos.length < 1) {
    return Promise.reject("No repositories found");
  } else if (repos.length > 1) {
    vscode.window.showInformationMessage(
      "Repos count is more than 1, using author from global config"
    );
    const author = await repos[0].getGlobalConfig("user.name");
    if (useGitEmail) {
      const email = await repos[0].getGlobalConfig("user.email");
      return `${author} <${email}>`;
    }
    return author;
  } else {
    try {
      const author = await repos[0].getConfig("user.name");
      if (useGitEmail) {
        const email = await repos[0].getConfig("user.email");
        return `${author} <${email}>`;
      }
      return author;
    } catch {
      /* vscode.window.showWarningMessage(
        "Failed to get author from local git config, using global config"
      ); */
      try {
        const author = await repos[0].getGlobalConfig("user.name");
        if (useGitEmail) {
          const email = await repos[0].getGlobalConfig("user.email");
          return `${author} <${email}>`;
        }
        return author;
      } catch {
        return Promise.reject("Failed to get author from git config");
      }
    }
  }
};

const downloadLicense = (key: string) =>
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
    },
    async (progress) => {
      progress.report({
        message: "Downloading license...",
      });

      const license = await getLicense(key);
      return license;
    }
  );

// Save license with progress.
const save = (licensePath: vscode.Uri, content: Uint8Array) => {
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
    },
    async (progress) => {
      progress.report({
        message: "Saving license...",
      });

      await vscode.workspace.fs.writeFile(licensePath, content);
    }
  );
};
