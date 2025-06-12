import * as assert from "assert";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";

import { chooseLicense, addDefaultLicense } from "../../commands";
import { updateConfig } from "../../utils";

describe("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  describe("Commands", () => {
    describe("License creation", () => {
      after("Cleanup", () => {
        fs.unlinkSync(path.join(os.homedir(), "/license.md"));
      });

      it("Create license", async () => {
        const pr = chooseLicense();
        await vscode.commands.executeCommand(
          "workbench.action.quickOpenSelectNext"
        );
        await vscode.commands.executeCommand(
          "workbench.action.acceptSelectedQuickOpenItem"
        );

        pr.then(() =>
          // First license in the list is AGPL-3.0.
          assert.ok(
            fs
              .readFileSync(path.join(os.homedir(), "/license.md"))
              .includes("GNU AFFERO GENERAL PUBLIC LICENSE")
          )
        ).catch((err) => {
          assert.fail(err);
        });
      });

      it("Create default license", async () => {
        await updateConfig("default", "unlicense");
        const pr = addDefaultLicense();

        // Default is Unlicense in this test.
        pr.then(() =>
          assert.ok(
            fs
              .readFileSync(path.join(os.homedir(), "/license.md"))
              .includes(
                "This is free and unencumbered software released into the public domain."
              )
          )
        ).catch((err) => {
          assert.fail(err);
        });
      });
    });
  });
});
