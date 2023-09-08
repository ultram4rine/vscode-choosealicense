# vscode-choosealicense

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/ultram4rine.vscode-choosealicense?style=flat-square)](https://marketplace.visualstudio.com/items/ultram4rine.vscode-choosealicense) [![Open VSX Version](https://img.shields.io/open-vsx/v/ultram4rine/vscode-choosealicense?style=flat-square)](https://open-vsx.org/extension/ultram4rine/vscode-choosealicense) [![License](https://img.shields.io/github/license/ultram4rine/vscode-choosealicense?style=flat-square)](https://github.com/ultram4rine/vscode-choosealicense/blob/master/LICENSE) [![CI/CD](https://img.shields.io/github/actions/workflow/status/ultram4rine/vscode-choosealicense/cicd.yaml?label=CI%2FCD&logo=github&style=flat-square)](https://github.com/ultram4rine/vscode-choosealicense/actions/workflows/cicd.yaml) [![Codecov](https://img.shields.io/codecov/c/github/ultram4rine/vscode-choosealicense?logo=codecov&style=flat-square)](https://codecov.io/gh/ultram4rine/vscode-choosealicense) [![Gitpod](https://img.shields.io/badge/Contribute%20with-Gitpod-908a85?style=flat-square&logo=gitpod)](https://gitpod.io/#https://github.com/ultram4rine/vscode-choosealicense)

Choose a license for your project in VS Code via [GitHub Licenses API](https://docs.github.com/en/free-pro-team@latest/rest/licenses/licenses)

![demo](https://raw.githubusercontent.com/ultram4rine/vscode-choosealicense/master/images/demo.gif)

_Theme: [GitHub Dark Default](https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme)_

## Usage

Use `License: Choose license` command to create a license file in your project. You can also set `year` and `author` properties for auto replacing this fields in license.

## Commands

Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> (Windows) or <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> (Mac) to open the command palette and type `License`.

![commands](https://raw.githubusercontent.com/ultram4rine/vscode-choosealicense/master/images/cmds.png)

_Theme: [GitHub Dark Default](https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme)_

| Command                  | Description                           |
| ------------------------ | ------------------------------------- |
| Choose license           | Choose a license to create.           |
| Add default license      | Add default license to repository.    |
| Choose multiple licenses | Add multiple licenses.                |
| Set default license      | Set default license to use.           |
| Set author               | Set author for licenses.              |
| Set year                 | Set year for licenses.                |
| Set extension            | Set extension for license files.      |
| Set filename             | Set filename for license files.       |
| Set token                | Set token for GitHub REST API access. |

## About access token

Setting an access token is optional, but it's increases your [API rate limit](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).

If you want to, you can start with [creating token](https://github.com/settings/tokens/new?description=vscode-choosealicense) (no scopes are required).

## Why not all licenses are available?

List of licenses is retrieved using the [`Get all commonly used licenses`](https://docs.github.com/en/free-pro-team@latest/rest/licenses/licenses?apiVersion=2022-11-28#get-all-commonly-used-licenses) API method. Not all licenses are included in this list. If you need a license that is not presented in this extension, raise an [issue](https://github.com/ultram4rine/vscode-choosealicense/issues/new?template=uncommon_license).
