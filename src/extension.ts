import * as vscode from "vscode";

import { choose, setAuthor, setYear, setExtension } from "./commands";

export async function activate({
  subscriptions,
}: vscode.ExtensionContext): Promise<void> {
  subscriptions.push(choose);
  subscriptions.push(setAuthor);
  subscriptions.push(setYear);
  subscriptions.push(setExtension);
}
