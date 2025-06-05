import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";

// import { setDefaultLicenseProperty } from "../../config";

describe("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  it("configuration", async () => assert.strictEqual(1, 1));
});
