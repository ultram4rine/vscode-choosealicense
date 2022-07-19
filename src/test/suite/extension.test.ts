import * as assert from "assert";
import * as fs from "fs";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";

import {
  setDefaultLicenseProperty,
  setAuthorProperty,
  setYearProperty,
  setExtensionProperty,
  setFilenameProperty,
  setTokenProperty,
} from "../../config";
import { chooseLicense, addDefaultLicense } from "../../commands";

describe("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  describe("Configuration", () => {
    it("Set default license", async () => {
      setDefaultLicenseProperty("unlicense");
      await vscode.commands.executeCommand(
        "workbench.action.quickOpenSelectNext"
      );
      await vscode.commands.executeCommand(
        "workbench.action.acceptSelectedQuickOpenItem"
      );

      assert.equal(
        vscode.workspace.getConfiguration("license").get("default") ?? "",
        "unlicense"
      );
    });

    it("Set author", async () => {
      setAuthorProperty("John Doe");
      await vscode.commands.executeCommand(
        "workbench.action.quickOpenSelectNext"
      );
      await vscode.commands.executeCommand(
        "workbench.action.acceptSelectedQuickOpenItem"
      );

      assert.equal(
        vscode.workspace.getConfiguration("license").get("author") ?? "",
        "John Doe"
      );
    });

    it("Set year", async () => {
      setYearProperty("1941");
      await vscode.commands.executeCommand(
        "workbench.action.quickOpenSelectNext"
      );
      await vscode.commands.executeCommand(
        "workbench.action.acceptSelectedQuickOpenItem"
      );

      assert.equal(
        vscode.workspace.getConfiguration("license").get("year") ?? "",
        "1941"
      );
    });

    it("Set extension", async () => {
      setExtensionProperty("md");
      await vscode.commands.executeCommand(
        "workbench.action.quickOpenSelectNext"
      );
      await vscode.commands.executeCommand(
        "workbench.action.acceptSelectedQuickOpenItem"
      );

      assert.equal(
        vscode.workspace.getConfiguration("license").get("extension") ?? "",
        "md"
      );
    });

    it("Set filename", async () => {
      setFilenameProperty("license");
      await vscode.commands.executeCommand(
        "workbench.action.quickOpenSelectNext"
      );
      await vscode.commands.executeCommand(
        "workbench.action.acceptSelectedQuickOpenItem"
      );

      assert.equal(
        vscode.workspace.getConfiguration("license").get("filename") ?? "",
        "license"
      );
    });

    it("Set token", async () => {
      setTokenProperty("gh_token");
      await vscode.commands.executeCommand(
        "workbench.action.quickOpenSelectNext"
      );
      await vscode.commands.executeCommand(
        "workbench.action.acceptSelectedQuickOpenItem"
      );

      assert.equal(
        vscode.workspace.getConfiguration("license").get("token") ?? "",
        "gh_token"
      );
    });
  });

  describe("Commands", () => {
    it("Create license", async () => {
      chooseLicense();
      await vscode.commands.executeCommand(
        "workbench.action.acceptSelectedQuickOpenItem"
      );

      assert.ok(fs.existsSync("~/license.md"));
    });

    it("Create default license", async () => {
      setDefaultLicenseProperty("unlicense");
      await vscode.commands.executeCommand(
        "workbench.action.quickOpenSelectNext"
      );
      await vscode.commands.executeCommand(
        "workbench.action.acceptSelectedQuickOpenItem"
      );

      setExtensionProperty("md");
      await vscode.commands.executeCommand(
        "workbench.action.quickOpenSelectNext"
      );
      await vscode.commands.executeCommand(
        "workbench.action.acceptSelectedQuickOpenItem"
      );

      setFilenameProperty("license");
      await vscode.commands.executeCommand(
        "workbench.action.quickOpenSelectNext"
      );
      await vscode.commands.executeCommand(
        "workbench.action.acceptSelectedQuickOpenItem"
      );

      await addDefaultLicense();

      assert.ok(fs.existsSync("~/license.md"));
    });
  });
});
