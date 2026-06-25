## 1. GitHub Actions

- [ ] 1.1 Create `.github/workflows/openspec-validate.yml` with triggers on PR and push (~15 min)
- [ ] 1.2 Add step to install OpenSpec and validate all specs (~10 min)
- [ ] 1.3 Add step to check validation result and fail if invalid (~5 min)

## 2. Script

- [ ] 2.1 Create `scripts/validate-openspec.sh` with JSON output parsing (~15 min)
- [ ] 2.2 Make script executable and test locally (~5 min)

## 3. Verification

- [ ] 3.1 Run `./scripts/validate-openspec.sh` and confirm it passes (~5 min)
- [ ] 3.2 Temporarily break a spec and confirm script reports failure (~5 min)
