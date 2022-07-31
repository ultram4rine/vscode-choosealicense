/* eslint-disable @typescript-eslint/naming-convention */

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type LicenseItem = Optional<
  Omit<
    License,
    | "description"
    | "implementation"
    | "permissions"
    | "conditions"
    | "limitations"
    | "body"
    | "featured"
  >,
  "html_url"
>;

export interface License {
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
}
