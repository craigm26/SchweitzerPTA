# Implementation Plan - Enhance Sponsor Management

## Phase 1: Setup and Infrastructure [checkpoint: 39a6652]
- [x] Task: Create Supabase Storage Bucket for Logos 6fc99f1
    - [x] Sub-task: Check if a public storage bucket for images exists; if not, create one (e.g., `sponsor-logos`).
    - [x] Sub-task: Configure storage policies to allow public read access and authenticated upload/delete access.
- [x] Task: Verify Database Schema 98c8e98
    - [x] Sub-task: Ensure the `sponsors` table exists and has the necessary columns (`name`, `description`, `website_url`, `tier`, `is_active`, `logo_url`).
    - [x] Sub-task: Add any missing columns if necessary via a migration script or SQL command.
- [x] Task: Conductor - User Manual Verification 'Setup and Infrastructure' (Protocol in workflow.md) 39a6652

## Phase 2: Backend API Development
- [x] Task: Create/Update Donor API Routes
    - [x] Sub-task: Write Tests for GET /api/donors (List)
    - [x] Sub-task: Implement GET /api/donors to fetch paginated list with filters.
    - [x] Sub-task: Write Tests for POST /api/donors (Create)
    - [x] Sub-task: Implement POST /api/donors to handle text data.
    - [x] Sub-task: Write Tests for PUT /api/donors/[id] (Update)
    - [x] Sub-task: Implement PUT /api/donors/[id] to update details.
    - [x] Sub-task: Write Tests for DELETE /api/donors/[id] (Delete)
    - [x] Sub-task: Implement DELETE /api/donors/[id].
- [x] Task: Implement Image Upload Logic
    - [x] Sub-task: Create a utility function or API route to handle file uploads to Supabase Storage.
    - [x] Sub-task: Ensure the returned URL is valid and accessible.
- [ ] Task: Conductor - User Manual Verification 'Backend API Development' (Protocol in workflow.md)

## Phase 3: Frontend Implementation
- [x] Task: Donor List View (Admin)
    - [x] Sub-task: Write Tests for DonorList Component.
    - [x] Sub-task: Build the table/grid view to display donors.
    - [x] Sub-task: Integrate with GET /api/donors.
- [x] Task: Add/Edit Donor Form
    - [x] Sub-task: Write Tests for DonorForm Component.
    - [x] Sub-task: Create a reusable form component for creating and editing donors.
    - [x] Sub-task: Implement form validation (Zod/React Hook Form recommended).
    - [x] Sub-task: Integrate the file input for logo upload.
- [x] Task: Integrate Form with API
    - [x] Sub-task: Wire up the "Add Donor" action to the POST endpoint.
    - [x] Sub-task: Wire up the "Edit Donor" action to the PUT endpoint.
    - [x] Sub-task: Handle success/error states (toast notifications).
- [ ] Task: Conductor - User Manual Verification 'Frontend Implementation' (Protocol in workflow.md)

## Phase 4: Quality Assurance and Polish
- [x] Task: End-to-End Testing
    - [x] Sub-task: Write a Playwright test spec for the full sponsor lifecycle (Create -> Read -> Update -> Delete).
    - [x] Sub-task: Verify image upload works in the E2E test.
- [x] Task: UI/UX Polish
    - [x] Sub-task: Ensure responsive design for the admin table and forms.
    - [x] Sub-task: Verify loading states and error messages are user-friendly.
- [ ] Task: Conductor - User Manual Verification 'Quality Assurance and Polish' (Protocol in workflow.md)
