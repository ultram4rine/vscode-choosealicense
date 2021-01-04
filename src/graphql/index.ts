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

interface Licenses {
  licenses: Array<License>;
}

export default class GraphQL {
  public static async getLicenses(): Promise<Licenses> {
    return await graphqlWithAuth(LICENSES_QUERY);
  }

  public static async getLicense(key: string): Promise<License> {
    let keyVar = { key: key };
    return await graphqlWithAuth(LICENSE_QUERY, keyVar);
  }
}
