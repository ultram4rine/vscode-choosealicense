# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
