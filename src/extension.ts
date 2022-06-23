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
  subscriptions.push(chooseLicense);
  subscriptions.push(addDefaultLicense);
  subscriptions.push(setDefaultLicense);
  subscriptions.push(setAuthor);
  subscriptions.push(setYear);
  subscriptions.push(setExtension);
  subscriptions.push(setFilename);
  subscriptions.push(setToken);
}
