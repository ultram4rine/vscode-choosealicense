import * as assert from "assert";
import * as fs from "fs";
import * as os from "os";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";

import { chooseLicense, addDefaultLicense } from "../../commands";

describe("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  describe("Commands", () => {
    describe("License creation", () => {
      after("Cleanup", () => {
        fs.unlinkSync(os.homedir().concat("/license.md"));
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
              .readFileSync(os.homedir().concat("/license.md"))
              .includes("GNU AFFERO GENERAL PUBLIC LICENSE")
          )
        );
      });

      it("Create default license", async () => {
        await addDefaultLicense();

        // Default is Unlicense in this test.
        assert.ok(
          fs
            .readFileSync(os.homedir().concat("/license.md"))
            .includes("https://unlicense.org")
        );
      });
    });
  });
});
