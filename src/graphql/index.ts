import { window, workspace } from "vscode";
import { graphql } from "@octokit/graphql";

const token: string | undefined = workspace
  .getConfiguration("license")
  .get("token");

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `bearer ${
      token ? token : "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"
    }`,
  },
});

const LICENSES_QUERY = `
  {
    licenses {
      key
      name
      spdxId
    }
  }
`;

const LICENSE_QUERY = `
  query getLicense($key: String!) {
    license(key: $key) {
      body
    }
  }
`;

interface License {
  key: string;
  name: string;
  spdxId: string;
  body: string;
}

export default class GraphQL {
  public static async getLicenses(): Promise<License[]> {
    try {
      const { licenses } = await graphqlWithAuth<{ licenses: License[] }>(
        LICENSES_QUERY
      );
      return licenses;
    } catch (error) {
      window.showErrorMessage(error.message);
      return [];
    }
  }

  public static async getLicense(key: string): Promise<License> {
    try {
      const { license } = await graphqlWithAuth<{ license: License }>(
        LICENSE_QUERY,
        { key: key }
      );
      return license;
    } catch (error) {
      window.showErrorMessage(error.message);
      return {} as License;
    }
  }
}
