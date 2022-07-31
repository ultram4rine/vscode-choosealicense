import { workspace } from "vscode";
import { Octokit } from "@octokit/rest";

import { LicenseItem, License } from "../types";

const octokit = new Octokit({
  auth: workspace.getConfiguration("license").get<string>("token"),
});

export const getLicenses = async (): Promise<LicenseItem[]> => {
  const resp = await octokit.rest.licenses.getAllCommonlyUsed();
  return resp.data;
};

export const getLicense = async (key: string): Promise<License> => {
  const resp = await octokit.rest.licenses.get({ license: key });
  return resp.data;
};
