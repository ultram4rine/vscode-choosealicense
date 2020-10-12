import { GraphQLClient, gql } from "graphql-request";

const LICENSES_QUERY = gql`
  {
    licenses {
      key
      name
    }
  }
`;

const LICENSE_QUERY = gql`
  query getLicense($key: String!) {
    license(key: $key) {
      body
    }
  }
`;

const graphQLClient = new GraphQLClient("https://api.github.com/graphql");
graphQLClient.setHeader(
  "Authorization",
  "bearer 5c81fc122369cb33cdd7e34070e4ffded3c8ba72"
);

interface Licenses {
  licenses: Array<{ key: string; name: string }>;
}

interface License {
  license: { body: string };
}

export class GraphQL {
  public static async getLicenses(): Promise<Licenses> {
    return graphQLClient.request<Licenses>(LICENSES_QUERY);
  }

  public static async getLicense(key: string): Promise<License> {
    let keyVar = { key: key };
    return graphQLClient.request<License>(LICENSE_QUERY, keyVar);
  }
}
