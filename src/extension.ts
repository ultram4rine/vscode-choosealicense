import * as vscode from "vscode";

import {
  chooseLicense,
  addDefaultLicense,
  setDefaultLicense,
  setAuthor,
  setYear,
  setExtension,
  setFilename,
  setToken,
} from "./commands";

export async function activate({
  subscriptions,
}: vscode.ExtensionContext): Promise<void> {
  subscriptions.push(
    vscode.commands.registerCommand("license.chooseLicense", chooseLicense)
  );
  subscriptions.push(
    vscode.commands.registerCommand(
      "license.addDefaultLicense",
      addDefaultLicense
    )
  );
  subscriptions.push(
    vscode.commands.registerCommand(
      "license.setDefaultLicense",
      setDefaultLicense
    )
  );
  subscriptions.push(
    vscode.commands.registerCommand("license.setAuthor", setAuthor)
  );
  subscriptions.push(
    vscode.commands.registerCommand("license.setYear", setYear)
  );
  subscriptions.push(
    vscode.commands.registerCommand("license.setExtension", setExtension)
  );
  subscriptions.push(
    vscode.commands.registerCommand("license.setFilename", setFilename)
  );
  subscriptions.push(
    vscode.commands.registerCommand("license.setToken", setToken)
  );
}
