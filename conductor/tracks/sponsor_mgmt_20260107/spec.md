# Specification: Enhance Sponsor Management

## Overview
This track focuses on enhancing the existing sponsor management functionality within the admin portal. The goal is to ensure full CRUD (Create, Read, Update, Delete) capabilities for sponsor records, integrating seamlessly with the Supabase backend. A key addition will be the ability to upload and manage sponsor logos.

## Functional Requirements
- **Sponsor List:**
  - Display a paginated list of all sponsors.
  - Show key details: Name, Tier, Active Status, and Logo thumbnail.
  - Provide search and filter options (e.g., by tier or active status).

- **Create Sponsor:**
  - Form to add a new sponsor.
  - Fields: Name, Description, Website URL, Tier (Platinum, Gold, Silver, Bronze), Active Status.
  - **Logo Upload:** Ability to upload an image file for the sponsor's logo. The image should be stored in Supabase Storage, and the public URL saved to the database.

- **Edit Sponsor:**
  - Form to modify existing sponsor details.
  - Ability to replace or remove the existing logo.

- **Delete Sponsor:**
  - Option to soft-delete or permanently remove a sponsor.
  - Ensure associated logo files are handled appropriately (e.g., deleted from storage if permanent delete).

## Non-Functional Requirements
- **Performance:** Sponsor list should load quickly. Image optimization for logos is recommended.
- **Security:** Ensure only authorized administrators can access these management features.
- **UX:** Forms should have validation feedback (e.g., required fields, invalid URL format).

## Acceptance Criteria
- [ ] An admin can view a list of all sponsors fetched from Supabase.
- [ ] An admin can add a new sponsor, including uploading a logo file.
- [ ] An admin can edit all fields of an existing sponsor, including updating the logo.
- [ ] An admin can delete a sponsor record.
- [ ] Sponsor logos are correctly stored in and retrieved from Supabase Storage.
- [ ] Input validation is in place for all form fields.
