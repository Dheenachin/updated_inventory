# Security checklist before production

- Replace the development bootstrap password before first launch; if an account already exists, change its password from My Profile.
- Serve only behind HTTPS and a reverse proxy with request-size limits and rate limiting.
- Replace in-memory bearer sessions with persistent, expiring secure sessions; add CSRF protections if cookie-based auth is introduced.
- Add account lockout / login throttling, password reset workflow, MFA for administrators and session revocation.
- Validate role permissions for every business action and test them using each role.
- Keep database and backups outside the public web root, restrict OS permissions, encrypt backups at rest and define retention.
- Test restore and reconciliation with copies of real data; document incident response.
- Establish finance-approved definitions for revenue, discounts, tax, returns, expenses, COGS and profit before relying on reports.
- Review applicable Indian privacy, accounting, GST, labour and industry requirements with qualified professionals.
