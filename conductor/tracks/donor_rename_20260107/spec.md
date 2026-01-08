# Specification: Global Rename "Sponsors" to "Donors" & Remove Levels

## 1. Overview
The goal of this track is to globally replace the terminology "Sponsor" with "Donor" throughout the entire Schweitzer PTA application. Additionally, the system will be simplified by removing the concept of "Donor Levels" (e.g., Platinum, Gold, etc.). This is a comprehensive refactor that affects the User Interface, Codebase internals, API routes, File structure, and Database schema.

## 2. Scope
The scope of this refactor includes:
-   **User Interface:** All visible text, labels, buttons, and navigation menu items. Removal of "Level" selectors and displays.
-   **Codebase:** Variable names, function names, interfaces, and component names. Removal of `level` properties.
-   **API & Routes:** All API endpoints and client-side URL routes.
-   **Filesystem:** Directory and file names matching the pattern.
-   **Database:** Table names and column names. Removal of `level` column.

## 3. Functional Requirements

### 3.1 User Interface
-   **Admin Navigation:** Rename "Sponsor Management" link to "Donor Management".
-   **Admin Pages:** Update titles, headers, and text on the Admin Dashboard and Management pages to use "Donor".
    -   **Donor Management:** Remove the "Level" column from the table.
    -   **Forms:** Remove the "Level" dropdown from the "Add Donor" and "Edit Donor" modals.
-   **Public Pages:** Rename the "Sponsors" page to "Donors" (or "Our Donors") and update all related text.
    -   Remove any grouping or sorting by level.
-   **Forms:** Update "Add Sponsor" / "Edit Sponsor" forms to "Add Donor" / "Edit Donor" and remove "Level" field.

### 3.2 API & Routing
-   **Client Routes:**
    -   Change `/sponsors` to `/donors`.
    -   Change `/admin/sponsors` to `/admin/donors`.
-   **API Endpoints:**
    -   Change `/api/sponsors` to `/api/donors`.
    -   Update all API client functions in `src/lib/api.ts` (e.g., `getSponsors` -> `getDonors`).
    -   Remove `level` parameter from `getDonors` and `createDonor` / `updateDonor` payloads.

### 3.3 Database
-   **Table Rename:** Rename the `sponsors` table to `donors`.
-   **Column Rename:** Ensure any foreign keys or columns referencing "sponsor" are updated to "donor" (if applicable).
-   **Column Removal:** Remove the `level` column from the `donors` table.
-   **Migration:** Create a Supabase SQL migration script to perform this rename and column drop safely.

### 3.4 Codebase Refactoring
-   **Component Names:** Rename components like `SponsorManagementPage` to `DonorManagementPage`.
-   **Types/Interfaces:** Rename `Sponsor` interface to `Donor` and remove `level` property.
-   **Files:** Move/Rename:
    -   `src/app/admin/sponsors/` -> `src/app/admin/donors/`
    -   `src/app/sponsors/` -> `src/app/donors/`
    -   `src/app/api/sponsors/` -> `src/app/api/donors/`

## 4. Non-Functional Requirements
-   **Data Integrity:** Existing sponsor records must be preserved and accessible as "donors". The `level` data will be discarded (as it is no longer needed).
-   **Consistency:** The term "sponsor" should not appear in the UI or active code paths.
-   **Build Stability:** The application must build and pass all linting checks after the refactor.

## 5. Acceptance Criteria
-   [ ] Navigating to `/admin/donors` loads the management page successfully without "Level" UI elements.
-   [ ] Navigating to `/donors` loads the public donors page without "Level" grouping.
-   [ ] The database contains a `donors` table and no `sponsors` table, and the `donors` table has no `level` column.
-   [ ] All CRUD operations (Create, Read, Update, Delete) work for "Donors" without "Level".
-   [ ] `npm run lint` and `npx tsc` pass without errors.