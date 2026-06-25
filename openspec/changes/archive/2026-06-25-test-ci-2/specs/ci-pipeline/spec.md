## ADDED Requirements

### Requirement: CI Validation on Pull Request

The system SHALL validate all OpenSpec changes and specs automatically when a pull request is opened or updated.

#### Scenario: PR with valid changes
- **WHEN** a pull request with valid OpenSpec changes is opened
- **THEN** the CI pipeline runs `openspec validate --all --json`
- **AND** the pipeline passes with exit code 0

#### Scenario: PR with invalid changes
- **WHEN** a pull request with invalid OpenSpec changes is opened
- **THEN** the CI pipeline runs `openspec validate --all --json`
- **AND** the pipeline fails with a non-zero exit code
- **AND** the error summary is printed in the CI logs

### Requirement: Local Validation Script

The system SHALL provide a local script to validate all OpenSpec changes before committing.

#### Scenario: All changes valid
- **WHEN** a developer runs `./scripts/validate-openspec.sh`
- **AND** all OpenSpec changes are valid
- **THEN** the script prints "✅ All changes valid" and exits with code 0

#### Scenario: Some changes invalid
- **WHEN** a developer runs `./scripts/validate-openspec.sh`
- **AND** some OpenSpec changes are invalid
- **THEN** the script prints the names and errors of invalid changes
- **AND** exits with code 1
