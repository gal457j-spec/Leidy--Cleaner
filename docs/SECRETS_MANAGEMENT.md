# Secrets Management (recommended)

Store production secrets in GitHub Secrets or an external secrets manager (HashiCorp Vault, AWS Secrets Manager).

Required repository secrets for full CI/CD & deploy:

- `SSH_PRIVATE_KEY` - Private key for deploy user (used by `deploy-ssh.yml`).
- `SSH_USER` - Remote server user (e.g. `deploy`).
- `SSH_HOST` - Remote server address (ip or hostname).
- `GITHUB_TOKEN` - Provided by GitHub Actions, used for GHCR.
- `SENTRY_DSN` - Sentry project DSN (optional, for error tracking).
- `JWT_SECRET` - Production JWT secret.
- `DATABASE_URL` - Production Postgres URL (if using Postgres).
- `STRIPE_SECRET_KEY` - Stripe secret for payments.

Guidelines:

1. Never commit `.env` files with production secrets.
2. Use GitHub Environments and required reviewers for production deploy secrets.
3. Rotate keys regularly and use short-lived credentials when possible.
