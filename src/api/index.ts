import { workspace } from "vscode";
import { request } from "@octokit/request";

const getToken = () => {
  return workspace.getConfiguration("license").get<string>("token");
};

export type License = {
  key: string;
  name: string;
  spdxId: string;
  body: string;
};

export const getLicenses = async () => {
  const token = getToken();
  const resp = await request({
    method: "GET",
    url: "/licenses",
    headers: {
      authorization: token ? `token ${token}` : "",
    },
  });
  const ds = resp.data;
  return ds.map((d: any) => {
    return { key: d.key, name: d.name, spdxId: d.spdx_id } as License;
  }) as License[];
};

export const getLicense = async (key: string) => {
  const token = getToken();
  const resp = await request({
    method: "GET",
    url: `/licenses/${key}`,
    headers: {
      authorization: token ? `token ${token}` : "",
    },
  });
  const d = resp.data;
  return { key: key, body: d.body } as License;
};
