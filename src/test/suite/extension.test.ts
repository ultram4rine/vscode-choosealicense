import * as assert from "assert";
import * as fs from "fs";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";

import { setDefaultLicenseProperty } from "../../config";
import { addDefaultLicense } from "../../commands";

describe("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  it("configuration", async () => {
    await setDefaultLicenseProperty("mit");
    await addDefaultLicense();

    assert.ok(fs.existsSync("LICENSE"));
  });
});
