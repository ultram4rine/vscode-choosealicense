import * as path from "path";
import * as Mocha from "mocha";
import { globSync } from "glob";

export async function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha.default({
    ui: "bdd",
    color: true,
  });

  const testsRoot = path.resolve(__dirname, "..");

  return new Promise<void>((resolve, reject) => {
    try {
      const testFiles = globSync("**/**.test.js", { cwd: testsRoot });

      testFiles.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

      mocha.run((failures) => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed.`));
        } else {
          resolve();
        }
      });
    } catch (error: unknown) {
      console.error(error);
      return reject(error);
    }
  });
}
