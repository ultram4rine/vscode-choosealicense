import * as vscode from "vscode";

import {
  addDefaultLicense,
  chooseLicense,
  chooseMultipleLicenses,
  setAuthor,
  setDefaultLicense,
  setExtension,
  setFilename,
  setToken,
  setYear,
} from "./commands";

export async function activate(context: vscode.ExtensionContext) {
  const chooseLicenseHandler = vscode.commands.registerCommand(
    "license.chooseLicense",
    async () => await chooseLicense(context)
  );

  const addDefaultLicenseHandler = vscode.commands.registerCommand(
    "license.addDefaultLicense",
    async () => await addDefaultLicense(context)
  );

  const chooseMultipleLicensesHandler = vscode.commands.registerCommand(
    "license.chooseMultipleLicenses",
    async () => await chooseMultipleLicenses(context)
  );

  context.subscriptions.push(
    chooseLicenseHandler,
    addDefaultLicenseHandler,
    chooseMultipleLicensesHandler,
    setDefaultLicense,
    setAuthor,
    setYear,
    setExtension,
    setFilename,
    setToken
  );
}
