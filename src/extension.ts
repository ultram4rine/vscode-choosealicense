import * as vscode from "vscode";

import {
  chooseLicense,
  addDefaultLicense,
  chooseMultipleLicenses,
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
  const chooseLicenseCommand = vscode.commands.registerCommand(
    "license.chooseLicense",
    chooseLicense
  );

  const addDefaultLicenseCommand = vscode.commands.registerCommand(
    "license.addDefaultLicense",
    addDefaultLicense
  );

  const chooseMultipleLicensesCommand = vscode.commands.registerCommand(
    "license.chooseMultipleLicenses",
    chooseMultipleLicenses
  );

  const setDefaultLicenseCommand = vscode.commands.registerCommand(
    "license.setDefaultLicense",
    setDefaultLicense
  );

  const setAuthorCommand = vscode.commands.registerCommand(
    "license.setAuthor",
    setAuthor
  );

  const setYearCommand = vscode.commands.registerCommand(
    "license.setYear",
    setYear
  );

  const setExtensionCommand = vscode.commands.registerCommand(
    "license.setExtension",
    setExtension
  );

  const setFilenameCommand = vscode.commands.registerCommand(
    "license.setFilename",
    setFilename
  );

  const setTokenCommand = vscode.commands.registerCommand(
    "license.setToken",
    setToken
  );

  subscriptions.push(chooseLicenseCommand);
  subscriptions.push(addDefaultLicenseCommand);
  subscriptions.push(chooseMultipleLicensesCommand);
  subscriptions.push(setDefaultLicenseCommand);
  subscriptions.push(setAuthorCommand);
  subscriptions.push(setYearCommand);
  subscriptions.push(setExtensionCommand);
  subscriptions.push(setFilenameCommand);
  subscriptions.push(setTokenCommand);
}
