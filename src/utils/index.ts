import * as WebRequest from "web-request";

export interface License {
  key: string;
  name: string;
}

export class Utils {
  public static async getLicenses(): Promise<License[]> {
    const url = "https://api.github.com/licenses";
    let data = await WebRequest.json<License[]>(url, {
      headers: { "User-Agent": "request" }
    });

    return data;
  }
}
