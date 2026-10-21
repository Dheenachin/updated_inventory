# Cotton Mill Management Suite v2

Full-stack local-first management application for cotton mill inventory and recorded sales revenue. React + Vite frontend, Express API, SQLite database, spreadsheet import/export, role-based authorization, audit log and database backup.

## Important scope and limitations

This is a **working development/staging foundation**, not a certified production ERP. Test with copies of real data before operational use. Revenue reports reflect only sales records imported or entered; there is no automatic discovery of historical revenue. “Estimated operating difference” is recorded sales minus entered expenses, not audited net profit. Currency is INR. The app does not yet implement tax/GST accounting, invoice PDF generation, purchase-order workflows, inventory valuation/COGS, multi-factor authentication, persistent distributed sessions, rate limiting, or cloud backup.

## Requirements

- Node.js 20 or 22 LTS recommended for the simplest native dependency installation; Node 24 may work with a compatible compiler/toolchain.
- npm.

## Start locally (Windows PowerShell)

1. Extract the project and open the project folder in VS Code.
2. Back up any existing `server/inventory.db` before migration.
3. Install dependencies:

   ```powershell
   npm install
   ```

4. Set a strong initial admin password in the same PowerShell terminal before first start. The first user is only created when the users table is empty:

   ```powershell
   $env:ADMIN_USER = "admin"
   $env:ADMIN_PASSWORD = "Choose-A-Strong-Password-Here"
   npm run server
   ```

   If you already created the default development account, sign in with `admin` / `ChangeMe123!` and change the password in **My Profile** immediately. The environment bootstrap password does not reset an existing user's password.

5. Open a second terminal in the same folder:

   ```powershell
   npm run dev
   ```

6. Open the Vite URL printed in the terminal, normally `http://localhost:5173`.

The backend API runs on port 4000. SQLite database defaults to `server/inventory.db`; override with `DB_PATH` if desired. Keep the backend terminal running while using the app.

## First run and migration

The updated server creates the users, sales, expenses and audit tables and safely adds `createdAt` / `updatedAt` columns to the earlier prototype's `items` and `movements` tables. Existing inventory records are retained. Take a database backup first. Do not overwrite your old database with a blank one. Check the inventory count and balances after migration.

## Default roles

- **admin**: inventory, sales, expenses, users, audit log, exports and backup.
- **manager**: inventory, stock movements, sales, expenses, user listing, audit and reports; cannot create/deactivate users or download database backup.
- **storekeeper**: create inventory items, stock movements, inventory imports and viewing records.
- **viewer**: read-only access to available pages. API writes are role-restricted.

## Excel import

### Inventory workbook columns
Required: `SKU`, `Name`, `Grade`, `Lot`, `Category`, `Warehouse`, `Quantity`, `Unit`, `ReorderLevel`. Optional: `Supplier`, `Location`. Grade must be A/B/C. SKU must be unique. Quantities and reorder level must be non-negative. Import is all-or-nothing and duplicate SKUs are rejected.

### Historical sales workbook columns
Required: `InvoiceNo`, `SaleDate`, `Amount`. Optional: `Customer`, `Description`, `Quantity`, `Unit`, `UnitPrice`. Use dates like `2024-04-15`; invoice numbers must be unique. Amount is INR and must be non-negative. Use a separate line/invoice identifier for every sale record; if the historical source contains multiple product lines per invoice, consolidate to one invoice row or use unique line IDs and adjust the schema before importing. Import is all-or-nothing.

Download the template from **Sales Register** or from the Excel import dialog. The first worksheet is read. Annual revenue comparison covers the latest three calendar years including the current year-to-date; prior-year growth appears only when prior-year revenue is non-zero.

## Backup

Sign in as admin → **Backup & Data** → **Download database backup**. The downloaded `.db` file contains company data and user password hashes; store it securely. For a restore, stop the server, preserve the current database, then restore the backup file to the configured DB path. Verify counts and open the application before resuming use.

## Testing checklist

1. Sign in with an admin account; invalid credentials should be rejected.
2. Create a storekeeper and viewer account; verify viewer cannot POST stock movements (API should return 403).
3. Import a valid inventory workbook; verify item count and rows. Try a duplicate SKU and confirm the whole import is rejected.
4. Record stock IN and OUT; confirm balances update and OUT beyond available stock is rejected.
5. Import historical sales with invoices from three years; verify annual revenue sums and percentage changes against an independent spreadsheet total.
6. Try duplicate invoice number and invalid date/amount; import should reject the whole batch.
7. Add an expense and check the selected-year report. The displayed operating difference is only revenue minus recorded expenses.
8. Change profile name/password, sign out and sign in again.
9. Review audit events and download a backup. Restore to a separate test database and verify row counts.
10. Run `npm test` and `npm run build`.

## Scripts

- `npm run dev` — Vite development server
- `npm run server` — Express API
- `npm run build` — production frontend build
- `npm test` — Node test suite

Do not expose this development server directly to the public internet without HTTPS, secure cookie/session design, rate limiting, secrets management, hardened backup handling and a security review.
