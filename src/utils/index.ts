import { json } from "web-request";

interface License {
  key: string;
  name: string;
}

interface LicenseText {
  body: string;
}

export class Utils {
  public static async getLicenses(): Promise<License[]> {
    const url = "https://api.github.com/licenses";
    let data = await json<License[]>(url, {
      headers: { "User-Agent": "request" }
    });

    return data;
  }

  public static async getLicenseText(key: string): Promise<LicenseText> {
    const url = `https://api.github.com/licenses/${key}`;
    let data = await json<LicenseText>(url, {
      headers: { "User-Agent": "request" }
    });

    return data;
  }
}
