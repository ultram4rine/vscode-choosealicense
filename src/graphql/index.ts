import { window } from "vscode";
import { graphql } from "@octokit/graphql";

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: "bearer 5c81fc122369cb33cdd7e34070e4ffded3c8ba72",
  },
});

const LICENSES_QUERY = `
  {
    licenses {
      key
      name
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
