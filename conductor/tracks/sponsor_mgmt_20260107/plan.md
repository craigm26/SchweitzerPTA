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
- [~] Task: Create/Update Sponsor API Routes
    - [ ] Sub-task: Write Tests for GET /api/sponsors (List)
    - [ ] Sub-task: Implement GET /api/sponsors to fetch paginated list with filters.
    - [ ] Sub-task: Write Tests for POST /api/sponsors (Create)
    - [ ] Sub-task: Implement POST /api/sponsors to handle text data.
    - [ ] Sub-task: Write Tests for PUT /api/sponsors/[id] (Update)
    - [ ] Sub-task: Implement PUT /api/sponsors/[id] to update details.
    - [ ] Sub-task: Write Tests for DELETE /api/sponsors/[id] (Delete)
    - [ ] Sub-task: Implement DELETE /api/sponsors/[id].
- [ ] Task: Implement Image Upload Logic
    - [ ] Sub-task: Create a utility function or API route to handle file uploads to Supabase Storage.
    - [ ] Sub-task: Ensure the returned URL is valid and accessible.
- [ ] Task: Conductor - User Manual Verification 'Backend API Development' (Protocol in workflow.md)

## Phase 3: Frontend Implementation
- [ ] Task: Sponsor List View (Admin)
    - [ ] Sub-task: Write Tests for SponsorList Component.
    - [ ] Sub-task: Build the table/grid view to display sponsors.
    - [ ] Sub-task: Integrate with GET /api/sponsors.
- [ ] Task: Add/Edit Sponsor Form
    - [ ] Sub-task: Write Tests for SponsorForm Component.
    - [ ] Sub-task: Create a reusable form component for creating and editing sponsors.
    - [ ] Sub-task: Implement form validation (Zod/React Hook Form recommended).
    - [ ] Sub-task: Integrate the file input for logo upload.
- [ ] Task: Integrate Form with API
    - [ ] Sub-task: Wire up the "Add Sponsor" action to the POST endpoint.
    - [ ] Sub-task: Wire up the "Edit Sponsor" action to the PUT endpoint.
    - [ ] Sub-task: Handle success/error states (toast notifications).
- [ ] Task: Conductor - User Manual Verification 'Frontend Implementation' (Protocol in workflow.md)

## Phase 4: Quality Assurance and Polish
- [ ] Task: End-to-End Testing
    - [ ] Sub-task: Write a Playwright test spec for the full sponsor lifecycle (Create -> Read -> Update -> Delete).
    - [ ] Sub-task: Verify image upload works in the E2E test.
- [ ] Task: UI/UX Polish
    - [ ] Sub-task: Ensure responsive design for the admin table and forms.
    - [ ] Sub-task: Verify loading states and error messages are user-friendly.
- [ ] Task: Conductor - User Manual Verification 'Quality Assurance and Polish' (Protocol in workflow.md)
