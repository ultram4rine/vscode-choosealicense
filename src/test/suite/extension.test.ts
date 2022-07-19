import * as assert from "assert";
import * as fs from "fs";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { addDefaultLicense } from "../../commands";

import {
  setDefaultLicenseProperty,
  setAuthorProperty,
  setYearProperty,
  setExtensionProperty,
  setFilenameProperty,
  setTokenProperty,
} from "../../config";

describe("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  describe("Configuration", () => {
    it("Set default license", async () => {
      await setDefaultLicenseProperty("mit");

      assert.ok(
        (vscode.workspace.getConfiguration("license").get("default") ?? "") ===
          "mit"
      );
    });

    it("Set author", async () => {
      await setAuthorProperty("John Doe");

      assert.ok(
        (vscode.workspace.getConfiguration("license").get("author") ?? "") ===
          "John Doe"
      );
    });

    it("Set year", async () => {
      await setYearProperty("1941");

      assert.ok(
        (vscode.workspace.getConfiguration("license").get("year") ?? "") ===
          "1941"
      );
    });

    it("Set extension", async () => {
      await setExtensionProperty("md");

      assert.ok(
        (vscode.workspace.getConfiguration("license").get("extension") ??
          "") === "md"
      );
    });

    it("Set filename", async () => {
      await setFilenameProperty("license");

      assert.ok(
        (vscode.workspace.getConfiguration("license").get("filename") ?? "") ===
          "license"
      );
    });

    it("Set token", async () => {
      await setTokenProperty("gh_token");

      assert.ok(
        (vscode.workspace.getConfiguration("license").get("token") ?? "") ===
          "gh_token"
      );
    });
  });

  describe("Commands", () => {
    it("Create default license", async () => {
      await setDefaultLicenseProperty("unlicense");
      await setExtensionProperty("md");
      await setFilenameProperty("license");
      await addDefaultLicense();

      assert.ok(fs.existsSync("license.md"));
    });
  });
});
