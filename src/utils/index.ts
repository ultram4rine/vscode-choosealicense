import * as vscode from "vscode";

export const updateConfig = async (property: string, value: string) => {
  if (vscode.workspace.workspaceFolders) {
    const selected = await vscode.window.showQuickPick(
      [
        {
          label: "User",
          description: "User Settings",
          target: vscode.ConfigurationTarget.Global,
        },
        {
          label: "Workspace",
          description: "Workspace Settings",
          target: vscode.ConfigurationTarget.Workspace,
        },
      ],
      { placeHolder: "Select the configuration target." }
    );

    if (selected) {
      await vscode.workspace
        .getConfiguration("license")
        .update(property, value, selected.target);
    }
  } else {
    await vscode.workspace
      .getConfiguration("license")
      .update(property, value, vscode.ConfigurationTarget.Global);
  }
};

export const replaceAuthor = (author: string, key: string, text: string) => {
  switch (key) {
    case "agpl-3.0":
    case "gpl-2.0":
    case "gpl-3.0":
    case "lgpl-2.1":
      text = text.replace(/<name of author>/g, author);
      break;

    case "apache-2.0":
      text = text.replace(/\[name of copyright owner]/g, author);
      break;

    case "bsd-2-clause":
    case "bsd-3-clause":
    case "mit":
    case "bsd-4-clause":
    case "isc":
      text = text.replace(/\[fullname]/g, author);
      break;

    case "wtfpl":
      text = text.replace(/Sam Hocevar <sam@hocevar.net>/g, author);
      break;

    case "bsl-1.0":
    case "cc0-1.0":
    case "epl-2.0":
    case "mpl-2.0":
    case "unlicense":
    case "cc-by-4.0":
    case "lgpl-3.0":
    default:
      break;
  }

  return text;
};

export const replaceYear = (year: string, key: string, text: string) => {
  switch (key) {
    case "agpl-3.0":
    case "gpl-2.0":
    case "gpl-3.0":
    case "lgpl-2.1":
      text = text.replace(/<year>/g, year);
      break;

    case "apache-2.0":
      text = text.replace(/\[yyyy]/g, year);
      break;

    case "bsd-2-clause":
    case "bsd-3-clause":
    case "mit":
    case "bsd-4-clause":
    case "isc":
      text = text.replace(/\[year]/g, year);
      break;

    case "wtfpl": {
      // Replace second occurrence.
      let t = 0;
      text = text.replace(/2004/g, (match) => (++t === 2 ? year : match));
      break;
    }

    case "bsl-1.0":
    case "cc0-1.0":
    case "epl-2.0":
    case "mpl-2.0":
    case "unlicense":
    case "cc-by-4.0":
    case "lgpl-3.0":
    default:
      break;
  }

  return text;
};
