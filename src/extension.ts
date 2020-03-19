import * as vscode from "vscode";
import { Utils } from "./utils";

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  let disposable = vscode.commands.registerCommand(
    "license.choose",
    async () => {
      let licenses = await Utils.getLicenses();
      vscode.window.showQuickPick(Array.from(licenses, l => l.name));
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
