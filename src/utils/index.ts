export const replaceAuthor = (author: string, key: string, text: string) => {
  switch (key) {
    case "agpl-3.0":
    case "gpl-2.0":
    case "gpl-3.0":
    case "lgpl-2.1":
      text = text.replace(/<name of author>/g, author);
      break;

    case "apache-2.0":
      text = text.replace(/\[name of copyright owner\]/g, author);
      break;

    case "bsd-2-clause":
    case "bsd-3-clause":
    case "mit":
      text = text.replace(/\[fullname\]/g, author);
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

  return text;
};

export const replaceYear = (year: string, key: string, text: string) => {
  switch (key) {
    case "agpl-3.0":
    case "gpl-2.0":
    case "gpl-3.0":
    case "lgpl-2.1":
      text = text.replace(/<year>/g, year);
      break;

    case "apache-2.0":
      text = text.replace(/\[yyyy\]/g, year);
      break;

    case "bsd-2-clause":
    case "bsd-3-clause":
    case "mit":
      text = text.replace(/\[year\]/g, year);
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

  return text;
};
