export default class Utils {
  public static replaceYear(year: string, lKey: string, lText: string): string {
    switch (lKey) {
      case "agpl-3.0":
      case "gpl-2.0":
      case "gpl-3.0":
      case "lgpl-2.1":
        lText = lText.replace(/<year>/g, year);
        break;

      case "apache-2.0":
        lText = lText.replace(/\[yyyy\]/g, year);
        break;

      case "bsd-2-clause":
      case "bsd-3-clause":
      case "mit":
        lText = lText.replace(/\[year\]/g, year);
        break;

      case "bsl-1.0":
      case "cc0-1.0":
      case "epl-2.0":
      case "mpl-2.0":
      case "unlicense":
        break;

      default:
        break;
    }

    return lText;
  }

  public static replaceAuthor(
    author: string,
    lKey: string,
    lText: string
  ): string {
    switch (lKey) {
      case "agpl-3.0":
      case "gpl-2.0":
      case "gpl-3.0":
      case "lgpl-2.1":
        lText = lText.replace(/<name of author>/g, author);
        break;

      case "apache-2.0":
        lText = lText.replace(/\[name of copyright owner\]/g, author);
        break;

      case "bsd-2-clause":
      case "bsd-3-clause":
      case "mit":
        lText = lText.replace(/\[fullname\]/g, author);
        break;

      case "cc0-1.0":
      case "epl-2.0":
      case "lgpl-3.0":
      case "mpl-2.0":
      case "unlicense":
        break;

      default:
        break;
    }

    return lText;
  }
}
