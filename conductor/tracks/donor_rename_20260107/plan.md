# Plan: Global Rename "Sponsors" to "Donors" & Remove Levels

## Phase 1: Database Migration & Type Definition
- [x] Task: Create and Execute Database Migration (Rename Table)
    - [x] Create a Supabase migration script to rename table `public.sponsors` to `public.donors`.
- [ ] Task: Remove Level Column and Update Types
    - [ ] Create a migration to drop the `level` column from `public.donors`.
    - [x] Update `src/lib/api.ts` to rename `Sponsor` interface to `Donor`.
    - [ ] Remove `level` field from `Donor` interface in `src/lib/api.ts`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Database Migration & Type Definition' (Protocol in workflow.md)

## Phase 2: Backend API Refactoring
- [x] Task: Rename API Routes
    - [x] Rename directory `src/app/api/sponsors` to `src/app/api/donors`.
    - [x] Update `src/app/api/donors/route.ts` to query from `donors` table instead of `sponsors`.
    - [x] Update error messages and logging to use "Donor" terminology.
- [ ] Task: Update API Logic for Level Removal
    - [ ] Update `src/app/api/donors/route.ts` to remove `level` from SELECT, INSERT, and UPDATE queries.
    - [ ] Remove `level` filtering logic from GET endpoint.
- [x] Task: Update Client API Library
    - [x] Refactor `src/lib/api.ts`:
        - [x] Rename `getSponsors` -> `getDonors`.
        - [x] Rename `createSponsor` -> `createDonor`.
        - [x] Rename `updateSponsor` -> `updateDonor`.
        - [x] Rename `deleteSponsor` -> `deleteDonor`.
        - [x] Update API endpoint paths in these functions to point to `/api/donors`.
    - [ ] Update these functions to remove `level` parameter.
- [x] Task: Update/Rename Backend Tests
    - [x] Rename `src/app/api/sponsors/__tests__/` to `src/app/api/donors/__tests__/`.
    - [x] Update tests to use new function names and endpoint paths.
    - [ ] Update tests to remove `level` assertions and mocks.
    - [ ] Verify tests pass.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Backend API Refactoring' (Protocol in workflow.md)

## Phase 3: Admin UI Refactor
- [x] Task: Rename Admin Directories and Navigation
    - [x] Rename `src/app/admin/sponsors` to `src/app/admin/donors`.
    - [x] Update `src/app/admin/layout.tsx` to link to `/admin/donors` with label "Donor Management".
- [x] Task: Refactor Admin Page Component
    - [x] Update `src/app/admin/donors/page.tsx`:
        - [x] Rename component `SponsorManagementPage` to `DonorManagementPage`.
        - [x] Replace all imports of `getSponsors` etc. with `getDonors`.
        - [x] Update state variables (e.g., `sponsors` -> `donors`).
        - [x] Update UI text (headers, buttons, empty states) from "Sponsor" to "Donor".
    - [ ] Remove "Level" column from the table.
    - [ ] Remove "Level" dropdown from Add/Edit modal.
    - [ ] Remove "Level" filter.
- [ ] Task: Verify Admin Functionality
    - [ ] Manually verify CRUD operations in Admin panel.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Admin UI Refactor' (Protocol in workflow.md)

## Phase 4: Public UI Refactor
- [ ] Task: Rename Public Directories
    - [ ] Rename `src/app/sponsors` to `src/app/donors`.
- [ ] Task: Refactor Public Page Component
    - [ ] Update `src/app/donors/page.tsx`:
        - [ ] Rename component (if applicable).
        - [ ] Update imports and API calls.
        - [ ] Update UI text and "Sponsor" labels to "Donor".
        - [ ] Remove any grouping or display of "Level".
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Public UI Refactor' (Protocol in workflow.md)

## Phase 5: Global Cleanup & Final Verification
- [ ] Task: Global Search and Replace
    - [ ] Search project for case-insensitive "sponsor".
    - [ ] Fix any remaining variable names, comments, or string literals that should be "donor".
    - [ ] **Caution:** Do not change keys in `package-lock.json` or external library code.
- [ ] Task: Final Build and Lint Check
    - [ ] Run `npm run lint` and fix issues.
    - [ ] Run `npx tsc` and fix type errors.
    - [ ] Run `npm run build` to ensure production build succeeds.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Global Cleanup & Final Verification' (Protocol in workflow.md)