import * as vscode from "vscode";

import {
  addDefaultLicense,
  chooseLicense,
  chooseMultipleLicenses,
  setDefaultLicense,
} from "./commands";

import {
  setAuthorProperty,
  setExtensionProperty,
  setFilenameProperty,
  setTokenProperty,
  setYearProperty,
  setStartYear,
} from "./config";

export async function activate(context: vscode.ExtensionContext) {
  const chooseLicenseCommand = vscode.commands.registerCommand(
    "license.chooseLicense",
    async () => await chooseLicense(context)
  );

  const addDefaultLicenseCommand = vscode.commands.registerCommand(
    "license.addDefaultLicense",
    async () => await addDefaultLicense(context)
  );

  const chooseMultipleLicensesCommand = vscode.commands.registerCommand(
    "license.chooseMultipleLicenses",
    async () => await chooseMultipleLicenses(context)
  );

  const setDefaultLicenseCommand = vscode.commands.registerCommand(
    "license.setDefaultLicense",
    setDefaultLicense
  );

  const setAuthorCommand = vscode.commands.registerCommand(
    "license.setAuthor",
    setAuthorProperty
  );

  const setYearCommand = vscode.commands.registerCommand(
    "license.setYear",
    setYearProperty
  );

  const setStartYearCommand = vscode.commands.registerCommand(
    "license.setStartYear",
    async () => await setStartYear(context)
  );

  const setExtensionCommand = vscode.commands.registerCommand(
    "license.setExtension",
    setExtensionProperty
  );

  const setFilenameCommand = vscode.commands.registerCommand(
    "license.setFilename",
    setFilenameProperty
  );

  const setTokenCommand = vscode.commands.registerCommand(
    "license.setToken",
    setTokenProperty
  );

  context.subscriptions.push(
    chooseLicenseCommand,
    addDefaultLicenseCommand,
    chooseMultipleLicensesCommand,
    setDefaultLicenseCommand,
    setAuthorCommand,
    setYearCommand,
    setStartYearCommand,
    setExtensionCommand,
    setFilenameCommand,
    setTokenCommand
  );
}
