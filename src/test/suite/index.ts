import * as path from "path";
import * as Mocha from "mocha";
import { globSync } from "glob";

export async function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: "bdd",
    color: true,
  });

  const testsRoot = path.resolve(__dirname, "..");

  return new Promise<void>((resolve, reject) => {
    try {
      const testFiles = globSync("**/**.test.js", { cwd: testsRoot });

      for (const file of testFiles) {
        // Add files to the test suite
        mocha.addFile(path.resolve(testsRoot, file));

        try {
          // Run the mocha test
          mocha.run((failures) => {
            if (failures > 0) {
              reject(new Error(`${failures} tests failed.`));
            } else {
              resolve();
            }
          });
        } catch (error) {
          console.error(error);
          reject(error);
        }
      }
    } catch (err: unknown) {
      return reject(err);
    }
  });
}
