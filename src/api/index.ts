import { workspace } from "vscode";
import { request } from "@octokit/request";

const getToken = () => {
  return workspace.getConfiguration("license").get<string>("token");
};

type License = {
  key: string;
  name: string;
  spdxId: string;
  body: string;
};

export default class GraphQL {
  public static async getLicenses(): Promise<License[]> {
    try {
      const token = getToken();
      const resp = await request({
        method: "GET",
        url: "/licenses",
        headers: {
          authorization: token ? `token ${token}` : "",
        },
      });
      return resp.data;
    } catch (error) {
      throw error;
    }
  }

  public static async getLicense(key: string): Promise<License> {
    try {
      const token = getToken();
      const resp = await request({
        method: "GET",
        url: `/licenses/${key}`,
        headers: {
          authorization: token ? `token ${token}` : "",
        },
      });
      return resp.data;
    } catch (error) {
      throw error;
    }
  }
}
