import * as vscode from "vscode";

import {
  choose,
  addDefaultLicense,
  setDefaultLicense,
  setAuthor,
  setYear,
  setExtension,
  setToken,
} from "./commands";

export async function activate({
  subscriptions,
}: vscode.ExtensionContext): Promise<void> {
  subscriptions.push(choose);
  subscriptions.push(addDefaultLicense);
  subscriptions.push(setDefaultLicense);
  subscriptions.push(setAuthor);
  subscriptions.push(setYear);
  subscriptions.push(setExtension);
  subscriptions.push(setToken);
}
