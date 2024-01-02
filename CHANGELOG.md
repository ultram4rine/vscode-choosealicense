# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added two new settings, `"useAuthorFromGit"` and `"useGitEmail"` (both `false` by default), whose used to get author string from git if not set in settings.

### Changed

- Various UI fixes and improvements.
- Use Node.js v20 in CI.
- Updated deps.

## [0.9.4] - 2023-12-27

### Added

- Added `BSD-4-Clause` uncommon license.

## [0.9.3] - 2023-09-08

### Added

- Added `LGPL-3.0` uncommon license.
- Added `New Uncommon License` Issue Template.

## [0.9.2] - 2023-01-17

### Changed

- Use `<kbd>` tag in README for keyboard shortcuts.
- Updated dependencies.

## [0.9.1] - 2022-12-26

### Changed

- Updated dependencies.

### Fixed

- Fixed CI/CD badge.

## [0.9.0] - 2022-09-11

### Added

- Added ability to choose multiple licenses. Files named in form `<filename>-<SPDX_ID><extension>`.
- Extension can now work in browser (e.g. [vscode.dev](vscode.dev), [github.dev](github.dev)).

### Changed

- Default license now always visible in quick pick menu (by is `always` meant when searching).
- Make the `a` in the display name lowercase.

## [0.8.0] - 2022-07-20

### Added

- Added uncommon licenses (`CC-BY-4.0`, `ISC` and `WTFPL`).

## [0.7.0] - 2022-06-25

### Added

- Added ability to set filename for licenses.

### Changed

- Use `onCommand` activation event.
- Improved inputs.

## [0.6.2] - 2022-04-24

### Changed

- Cosmetic changes: new icon and gallery banner for marketplace.

## [0.6.1] - 2022-04-24

### Added

- Published to [Open VSX Registry](https://open-vsx.org/extension/ultram4rine/vscode-choosealicense).

### Changed

- [@octokit/rest](https://github.com/octokit/rest.js) is now used to access the GitHub API.
- Extension now bundled with [esbuild](https://esbuild.github.io/).

### Security

- Many dependency updates.

## [0.6.0] - 2021-08-18

### Added

- Ability to set and add default license.

## [0.5.0] - 2021-08-16

### Added

- New setting for access token.

### Changed

- Use GitHub REST API instead of GraphQL.

## [0.4.0] - 2020-12-02

### Changed

- Extension now bundled with rollup.
- @octokit/graphql is now used to access the Github API.

## [0.3.2] - 2020-10-31

### Fixed

- Downgraded @types/vscode to package extension.

## [0.3.1] - 2020-10-31

### Added

- Automatic year detection feature.

### Changed

- License file extension in settings now have dot. Update it if use extensions for licenses.
- Removed lgpl-3.0, added bsl-1.0 API change.

## [0.3.0] - 2020-04-01

### Changed

- Get licenses via GitHub GraphQL api.

### Fixed

- Fixed bug when author name not replacing for `agpl-3.0`.

## [0.2.0] - 2020-03-30

### Added

- New icon for extension.
- Choose folder to create license if you working in workspace.
- Choose license file extension via VSCode quick pick windows.

## [0.1.1] - 2020-03-29

### Removed

- Deleted info message when choose license.

## [0.1.0] - 2020-03-28

### Added

- Choose year, author and file extension for license.

## [0.0.1] - 2020-03-20

### Added

- Added license choosing and creation.
