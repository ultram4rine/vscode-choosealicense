import * as vscode from "vscode";

import {
  chooseLicense,
  addDefaultLicense,
  setDefaultLicense,
} from "./commands";
import {
  setAuthorProperty,
  setExtensionProperty,
  setFilenameProperty,
  setTokenProperty,
  setYearProperty,
} from "./config";

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
    vscode.commands.registerCommand("license.setAuthor", setAuthorProperty)
  );
  subscriptions.push(
    vscode.commands.registerCommand("license.setYear", setYearProperty)
  );
  subscriptions.push(
    vscode.commands.registerCommand(
      "license.setExtension",
      setExtensionProperty
    )
  );
  subscriptions.push(
    vscode.commands.registerCommand("license.setFilename", setFilenameProperty)
  );
  subscriptions.push(
    vscode.commands.registerCommand("license.setToken", setTokenProperty)
  );
}
