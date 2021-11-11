/* eslint-disable @typescript-eslint/naming-convention */
export type Licenses = {
  key: string;
  name: string;
  url: string | null;
  spdx_id: string | null;
  node_id: string;
  html_url?: string | undefined;
}[];

export type License = {
  key: string;
  name: string;
  spdx_id: string | null;
  url: string | null;
  node_id: string;
  html_url: string;
  description: string;
  implementation: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
  body: string;
  featured: boolean;
};
