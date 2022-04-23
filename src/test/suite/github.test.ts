import * as assert from "assert";

import { Licenses } from "../../types";
import { getLicenses, getLicense } from "../../api";
import { replaceAuthor, replaceYear } from "../../utils";

describe("GitHub API and utils", () => {
  let licenses: Licenses;

  before(async () => {
    licenses = await getLicenses();
    describe("Utils on each license", () => {
      licenses.forEach((license) => {
        switch (license.key) {
          case "agpl-3.0":
          case "gpl-2.0":
          case "gpl-3.0":
          case "lgpl-2.1":
          case "apache-2.0":
          case "bsd-2-clause":
          case "bsd-3-clause":
          case "mit":
            it(`author and year replaced in ${license.key}`, async () => {
              const l = await getLicense(license.key);
              const authorReplaced = replaceAuthor("John Doe", l.key, l.body);
              const yearReplaced = replaceYear("1941", l.key, l.body);
              assert.ok(authorReplaced.indexOf("John Doe") !== -1);
              assert.ok(yearReplaced.indexOf("1941") !== -1);
            });
            break;
          case "bsl-1.0":
          case "cc0-1.0":
          case "epl-2.0":
          case "mpl-2.0":
          case "unlicense":
            it(`author and year not replaced in ${license.key}`, async () => {
              const l = await getLicense(license.key);
              const authorReplaced = replaceAuthor("John Doe", l.key, l.body);
              const yearReplaced = replaceYear("1941", l.key, l.body);
              assert.ok(authorReplaced.indexOf("John Doe") === -1);
              assert.ok(yearReplaced.indexOf("1941") === -1);
            });
            break;
          default:
            break;
        }
      });
    });
  });

  it("should be 13 licenses", () => {
    assert.ok(licenses.length === 13);
  });
});
