# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Project: Aperture CRM & Booking Management System
**Version:** 1.0.0  
**Date:** June 27, 2026  
**Author:** Senior Product Manager & Lead Solution Architect  
**Status:** Approved for Implementation  
**Target Role:** Admin (Single-Role MVP)

---

## 1. Project Overview

### Purpose of the Application
The **Aperture CRM & Booking Management System** is a bespoke, comprehensive, and high-performance digital workspace designed specifically for wedding photography and videography studios. It acts as a single source of truth that fuses customer relationship management, booking administration, interactive public and administrative pricing calculators, automated premium quotation generation, and interaction logging into one cohesive, modern web application.

### Business Goals
*   **Accelerate Sales Velocity:** Empower prospect inquiries with an interactive public calculator that turns curiosity into high-intent leads instantly.
*   **Maximize Operational Efficiency:** Eliminate manual calculations, tedious Word/Excel document formatting, and paper-trail follow-ups for studio administrators.
*   **Professionalize Branding:** Deliver consistently high-quality, modern, typographically elegant, and on-brand PDF quotations that build immediate premium trust.
*   **Minimize Lead Leakage:** Ensure zero active leads are dropped by enforcing clear reminders, follow-up cycles, and systemic interactions.

### Target Users
*   **Studio Administrator / Owner:** Solitary or primary operations manager handling wedding inquiries, client meetings, packages, pricing configurations, and shoots.

### Scope
*   **In-Scope:** Single-user (Admin) role covering dashboard, interactive calendars, pipeline progression tracking, automatic quotation rendering, configurable services engine, 7-day retention management for lost leads, and settings.
*   **Out-of-Scope (Phase 1):** Multi-agent routing, employee payroll systems, integrated payment gateways, customer-facing portals, and automated email broadcast marketing engines.

### Future Scalability
*   **Multi-Tenancy:** The database schemas and interface components are conceptually built to scale gracefully to multiple photographers and branch locations.
*   **Native Client Portals:** Foundation-ready to expose private client viewing rooms, online digital contract signing, and direct retainer payment gates.

---

## 2. Complete Application Modules & Page Specifications

This section outlines the functional details of the application's interface layers. Every page lists its specific structural boundaries and UX constraints to guarantee a premium and deterministic implementation.

---

### Module 2.1: Login Page

#### Purpose
To provide a secure, single-user access gateway for the studio administrator, ensuring all lead lists, contact details, financial configuration metrics, and settings remain private.

#### Description
A minimalist, high-contrast, centered card layout utilizing elegant typography, generous white space, and a soft fade-in entrance transition.

#### Features
*   Standard username/password authentication.
*   "Remember Me" cookie-based persistence.
*   Interactive validation feedback for incorrect credentials.

#### User Actions
*   Input credentials.
*   Toggle password visibility.
*   Submit login request.

#### Buttons
*   **Submit Login (`id="btn-login-submit"`):** Triggers authentication request.
*   **Toggle Password Visibility (`id="btn-login-toggle-pass"`):** Changes input display type between `text` and `password`.

#### Tables
*   *None (N/A)*

#### Filters & Search
*   *None (N/A)*

#### Forms
*   **Admin Sign-In Form (`id="form-login"`):** Directs post data securely to the local auth router.

#### Fields
1.  **Email Address (`id="input-login-email"`):**
    *   *Type:* Email
    *   *Required:* Yes
    *   *Validation:* Standard email regex (`^[^\s@]+@[^\s@]+\.[^\s@]+$`).
2.  **Password (`id="input-login-password"`):**
    *   *Type:* Password
    *   *Required:* Yes
    *   *Validation:* Minimum 8 characters; must not be blank.

#### Empty State
*   Fields initialized blank. Focus defaults to Email Address input on render.

#### Success State
*   Interactive redirect to `/dashboard` with a subtle sliding transition and high-priority welcome notification.

#### Error State
*   Displays inline alert banner: *"Invalid credentials. Please verify your email and password and try again."* framed in soft crimson boundaries.

---

### Module 2.2: Dashboard

#### Purpose
To act as the operations cockpit for the admin, offering an instantaneous, birds-eye view of today's workload, upcoming events, and fresh business inquiries.

#### Description
A bento-grid multi-widget workspace dashboard optimized for 1080p desktop layouts. It features rapid metric highlights, interactive agenda previews, and clean, legible headings.

#### Features
*   High-level cards showing immediate active metrics (New Leads, Upcoming Shoots, Pending Follow Ups).
*   **Today's Reminders Widget:** Lists outstanding tasks due on the current calendar date.
*   **Today's Follow Ups Widget:** Highlights active leads scheduled for communications.
*   **Upcoming Bookings Widget:** Sequential vertical timeline of next 5 confirmed events.
*   **Recent Leads Widget:** Quick-access list of the 5 most recently created active inquiries.
*   **Calendar Mini-Preview Widget:** Clean monthly grid highlighting confirmed shoots.

#### User Actions
*   Click recent leads or bookings to open their details immediately.
*   Mark reminders complete directly from the dashboard card.
*   Quick-link to the full Calendar or Leads page.

#### Buttons
*   **View Full Calendar (`id="btn-dash-view-calendar"`):** Navigates to `/calendar`.
*   **View All Leads (`id="btn-dash-view-leads"`):** Navigates to `/leads`.
*   **Mark Task Complete (`id="btn-dash-complete-task-{id}"`):** Instantly updates task status.

#### Tables
*   *None (N/A)* (Uses lightweight list elements for bento-grid modules to maximize desktop real estate).

#### Filters & Search
*   *None (N/A)* (Global Search in top header navigates outward).

#### Forms
*   *None (N/A)*

#### Fields
*   *None (N/A)*

#### Empty State
*   If no reminders exist for today: *"You're all caught up! No reminders scheduled for today."*
*   If no follow ups exist: *"No follow-ups due. Excellent pipeline maintenance!"*
*   If no bookings exist: *"No shoots on the horizon. Create a new lead to begin."*

#### Success State
*   Fully populated grids with seamless load states and synchronized real-time clocks.

#### Error State
*   Displays localized error state in broken widgets: *"Unable to load widget data. Retrying..."* with a manual refresh button.

---

### Module 2.3: Calendar

#### Purpose
To display only confirmed, contracted, and active wedding shoots in a clear chronological visual workspace.

#### Description
A beautifully stylized monthly and weekly calendar grid using JetBrains Mono for dates and soft, custom accents for scheduled shoots.

#### Features
*   Monthly, Weekly, and Day view toggles.
*   Dynamic navigation (Next Month, Previous Month, Return to Current Month).
*   Visual color indicators indicating the booked package category (e.g., Wedding Photography vs. Pre Wedding).
*   Hover states showing high-level preview tooltips (Customer Name, Location, Shoot Duration).

#### User Actions
*   Toggle calendar view modes.
*   Click date-cell event to navigate directly to that Booking's Lead Details page.
*   Navigate forward or backward through time blocks.

#### Buttons
*   **Month View Mode (`id="btn-cal-view-month"`):** Activates grid.
*   **Week View Mode (`id="btn-cal-view-week"`):** Activates weekly columns.
*   **Today (`id="btn-cal-today"`):** Snaps grid view to current date.
*   **Previous (`id="btn-cal-prev"`):** Navigates back.
*   **Next (`id="btn-cal-next"`):** Navigates forward.

#### Tables
*   Interactive visual CSS grid with 7 column layouts (Sunday - Saturday) mapping events.

#### Filters & Search
*   **Service Category Filter (`id="select-cal-filter-service"`):** Filters events by Wedding Photography or Pre Wedding Shoot.

#### Forms
*   *None (N/A)*

#### Fields
*   *None (N/A)*

#### Empty State
*   A blank date cell shows only the numeric day. Empty days have low-opacity numbers.

#### Success State
*   Events render fluidly with absolute positioning inside date boxes. Tooltips pop up cleanly on hover.

#### Error State
*   Grid displays raw numeric cells; fallback alert on header bar: *"Calendar synchronization failed."*

---

### Module 2.4: Leads Page

#### Purpose
To manage, view, filter, and search the entire active pipeline of prospects from newly submitted inquiries to those undergoing final negotiation.

#### Description
A structured data table layout with comprehensive column sorting, intuitive status badges, and rapid visual filtration.

#### Features
*   Unified data table of all active (unconverted and unlost) leads.
*   Lead status tag rendering with status-specific high-contrast styling.
*   Quick-link details buttons.
*   Lead age tracker highlighting cold inquiries.

#### User Actions
*   Search database records.
*   Filter by status or service type.
*   Click lead row to open full workspace details.

#### Buttons
*   **Add Manual Lead (`id="btn-leads-add-manual"`):** Opens modal form to insert fresh walk-in inquiries.
*   **Export Active Leads (`id="btn-leads-export"`):** Downloads local CSV backup of the current filtered table view.
*   **View Details (`id="btn-leads-view-{id}"`):** Navigates to the unique details page for that lead ID.

#### Tables
*   **Leads Master Table (`id="table-leads"`):**
    *   *Columns:* Date Added, Customer Name, Contact Information, Target Service, Package Selected, Value, Current Status, Quick Actions.

#### Filters & Search
*   **Global Leads Search (`id="input-leads-search"`):** Real-time text filter scanning Customer Name, Email, or Phone.
*   **Status Filter Group (`id="select-leads-filter-status"`):** Multi-select dropdown filtering by pipeline status (New Lead, First Call, etc.).
*   **Service Category Filter (`id="select-leads-filter-service"`):** Filters by Wedding Photography or Pre Wedding.

#### Forms
*   **Add Lead Modal Form (`id="form-leads-manual-add"`):** Handles fast inputs for manual offline inquiries.

#### Fields
1.  **Client Name (`id="input-manual-lead-name"`):** Text, required.
2.  **Client Email (`id="input-manual-lead-email"`):** Email, required.
3.  **Client Phone (`id="input-manual-lead-phone"`):** Text, optional.
4.  **Target Service (`id="select-manual-lead-service"`):** Dropdown, required.
5.  **Target Package (`id="select-manual-lead-package"`):** Dropdown, required (populates dynamically based on Service).

#### Validations
*   Name must not be blank or exceed 100 characters.
*   Email must be logically valid.

#### Empty State
*   *"No active leads found matching your filters. Create a lead or adjust your filter selection."* accompanied by a centered vector graphic.

#### Success State
*   Smooth row animations, bold, clean alignment of values, and precise truncation for long text paths.

#### Error State
*   Inline banner error: *"Error fetching database lead list. Retrying connection..."*

---

### Module 2.5: Lead Details Page

#### Purpose
To serve as the definitive interaction hub and record page for a specific prospect, compiling all historical context, package selections, quotations, notes, timelines, and reminders.

#### Description
An elegant, split-screen master workspace layout: Left Pane contains high-level Customer Profile, Package configurations, and generated Quotations; Right Pane hosts the chronological Activities/Timeline stream, Notes pad, and Reminders console.

#### Features
*   **Client Information Card:** Editable baseline details of the customer.
*   **Active Package Breakdown:** Displays the base package selection, including custom additions and subtractions configured for this specific client.
*   **Quotation Log Panel:** Generates and lists previous quotations generated for this client, with PDF review history.
*   **Status Advancement Control Rail:** High-visibility timeline steps (New Lead → Converted or Lost) to update pipeline status dynamically.
*   **Quick Notes Pad:** Persistent text area allowing the admin to record immediate phone or meeting notes.
*   **Interaction Logging Panel:** Form to record client contact events (Calls, Emails, In-Person).
*   **Lead-Specific Reminder Creator:** Sets calendar notifications tied to this client.

#### User Actions
*   Update active status steps.
*   Edit customer metadata details inline.
*   Record interaction history.
*   Generate client-specific PDF quotation.
*   Create a dedicated follow-up reminder.

#### Buttons
*   **Save Basic Info (`id="btn-lead-detail-save-info"`):** Commits text field changes.
*   **Advance Status (`id="btn-lead-detail-advance-{status}"`):** Updates status pipeline.
*   **Log Interaction (`id="btn-lead-detail-log-interaction"`):** Commits interaction record.
*   **Generate PDF Quotation (`id="btn-lead-detail-gen-quote"`):** Triggers Admin Calculator loaded with client data.
*   **Add Reminder (`id="btn-lead-detail-add-reminder"`):** Schedules new notification.
*   **Convert to Booking (`id="btn-lead-detail-convert"`):** Finalizes sales funnel; schedules calendar event.
*   **Mark as Lost (`id="btn-lead-detail-lost"`):** Moves lead into 7-day retention holding.

#### Tables
*   **Interaction History Log (`id="table-lead-timeline"`):**
    *   *Columns:* Date/Time, Type (Call/Email/Meeting), Record/Note Content, Updated By.

#### Filters & Search
*   *None (N/A)*

#### Forms
*   **Quick Interaction Form (`id="form-lead-log-interaction"`):** Maps input types to pipeline updates.
*   **Client Specific Reminder Form (`id="form-lead-reminder"`):** Maps date, time, and content.

#### Fields
1.  **Interaction Type (`id="select-log-type"`):** Dropdown (Phone Call, Email, Meeting, WhatsApp).
2.  **Interaction Summary (`id="input-log-summary"`):** Text, required.
3.  **Reminder Date (`id="input-lead-remind-date"`):** Date picker, required.
4.  **Reminder Time (`id="input-lead-remind-time"`):** Time picker, required.
5.  **Reminder Title (`id="input-lead-remind-title"`):** Text, required.

#### Validations
*   Reminder dates must not be in the past.
*   Interaction summaries must contain at least 5 characters.

#### Empty State
*   If no timeline events exist: *"No interactions recorded yet. Log your first phone call or email below."*

#### Success State
*   Smooth chronological insertion of items with real-time metadata calculation (e.g., *"Logged 2 minutes ago"*).

#### Error State
*   Error banner: *"Unable to commit updates to the cloud database. Please check connectivity."*

---

### Module 2.6: Follow Ups Panel

#### Purpose
To provide a dedicated screen focusing entirely on active prospects that require action, sorting them dynamically by age, last contact date, and upcoming schedule.

#### Description
A card-based pipeline view prioritizing urgent follow-ups, with quick-action toggles for instant note logging.

#### Features
*   **Actionable Leads Card List:** Shows client card grids containing last contact timestamps, pipeline step status, and scheduled reminder flags.
*   **Overdue Actions Panel:** Dedicated list highlighting prospects who have exceeded standard follow-up timelines without communication.

#### User Actions
*   Quick-update status.
*   Review last recorded interaction summary text inline.
*   Initiate quick note update.

#### Buttons
*   **Log Quick Note (`id="btn-follow-quick-note-{id}"`):** Displays instant modal to write notes without leaving the list.
*   **Reschedule Follow Up (`id="btn-follow-reschedule-{id}"`):** Updates the follow-up reminder date.

#### Tables
*   *None (N/A)* (Uses card grids to highlight content).

#### Filters & Search
*   **Follow Up Urgency Sort (`id="select-follow-sort"`):** Sort by "Overdue First", "Newest Inquiry", "Highest Package Value".

#### Forms
*   **Quick Note Modal Form (`id="form-follow-quick-note"`):** Simple text area for fast logging.

#### Fields
1.  **Follow Up Note Content (`id="input-follow-note-text"`):** Textarea, required.

#### Validations
*   Note text must contain content.

#### Empty State
*   *"No follow-ups due. Excellent pipeline maintenance!"*

#### Success State
*   Removing or rescheduling a lead slides the card out of the view with a transition.

#### Error State
*   Toast notification: *"Failed to save quick note."*

---

### Module 2.7: Converted Bookings List

#### Purpose
To list all secured, locked-in, and successfully closed sales contracts.

#### Description
A professional ledger table highlighting contracted services, revenue breakdowns, shoot dates, and package details.

#### Features
*   Exhaustive repository of confirmed weddings and shoots.
*   Direct link to the related calendar date.
*   Financial summary showing contract values.

#### User Actions
*   Click booking row to inspect complete contract, timeline, and shoot notes.
*   Export booking calendar data.

#### Buttons
*   **Export Calendar Feed (`id="btn-booking-export-ical"`):** Generates static standard iCal link.
*   **View Shoot Layout (`id="btn-booking-layout-{id}"`):** Focuses details view on shoot details.

#### Tables
*   **Bookings Ledger Table (`id="table-bookings"`):**
    *   *Columns:* Shoot Date, Client Name, Package Value, Services Included, Location, Booking Note, Status Indicator.

#### Filters & Search
*   **Search Bookings (`id="input-bookings-search"`):** Real-time search across names and packages.
*   **Chronological Date Filter (`id="input-bookings-date-range"`):** Start and end date picker limits ledger rows.

#### Empty State
*   *"No bookings secured yet. Convert a lead to populate your calendar and ledger."*

#### Success State
*   Bold financial layout showing contract value calculations clearly.

#### Error State
*   Alert: *"Failed to compile booking database records."*

---

### Module 2.8: Lost Leads Panel (7-Day Retention)

#### Purpose
To isolate rejected, cancelled, or unresponsive leads in a separate temporary holding bin before permanent automated deletion.

#### Description
A low-contrast pipeline archive table displaying deletion countdown progress bars, allowing admins to restore records if a client restarts talks.

#### Features
*   **7-Day Countdown Indicator:** Visual clock or bar indicating remaining time before database purging.
*   **One-Click Recovery:** Restores the lead to its last active status.

#### User Actions
*   Manually delete a lead permanently instantly.
*   Restore a lost lead back into the active pipeline.

#### Buttons
*   **Restore Lead (`id="btn-lost-restore-{id}"`):** Resurrects lead; returns it to active Leads list.
*   **Delete Permanently Now (`id="btn-lost-purge-{id}"`):** Bypasses 7-day clock, purges database record immediately.

#### Tables
*   **Lost Leads Bin (`id="table-lost-leads"`):**
    *   *Columns:* Date Marked Lost, Customer Name, Email, Packages, Time Left Before Deletion, Restore Button, Purge Button.

#### Filters & Search
*   *None (N/A)* (Archive is designed to keep data minimal).

#### Empty State
*   *"The recycling bin is empty. No lost leads recorded in the last 7 days."*

#### Success State
*   Restored or purged rows dissolve cleanly.

#### Error State
*   Toast error: *"Unable to process lead status modification."*

---

### Module 2.9: Reminder Center

#### Purpose
To provide a consolidated inbox and calendar view of all user-scheduled reminder tasks.

#### Description
An inbox-style interactive todo workspace. Tasks are separated into "Overdue", "Today", "This Week", and "Completed" folders.

#### Features
*   Global list of reminders across all clients.
*   Checkbox-style interactions for rapid completion.
*   High-contrast indicators for overdue events.

#### User Actions
*   Toggle reminder statuses.
*   Modify reminder text, date, and time.
*   Navigate to the associated client page.

#### Buttons
*   **Add General Reminder (`id="btn-remind-new"`):** Opens form to create standalone non-client reminders.
*   **Delete Reminder (`id="btn-remind-delete-{id}"`):** Remembers selected ID and purges.

#### Tables
*   **Reminders Grid Ledger (`id="table-reminders-list"`):**
    *   *Columns:* Checkbox status, Target Time, Task Title, Related Client Link, Note Content, Actions.

#### Filters & Search
*   **Folder Select (`id="select-remind-folder"`):** Tabs for All, Pending, Overdue, and Completed.

#### Forms
*   **Universal Reminder Form (`id="form-remind-universal"`):** Configures general notifications.

#### Fields
1.  **Title (`id="input-remind-title"`):** Text, required.
2.  **Date/Time (`id="input-remind-datetime"`):** Datetime-local, required.
3.  **Notes (`id="input-remind-note"`):** Textarea, optional.
4.  **Target Client Link (`id="select-remind-client-link"`):** Searchable dropdown of active leads.

#### Validations
*   Datetime must be in the future for new reminders.

#### Empty State
*   *"No tasks scheduled. Create a task to outline your schedule."*

#### Success State
*   Completing a task applies a line-through style and moves it to the "Completed" tab with a subtle animation.

#### Error State
*   Error banner: *"Unable to store task configurations."*

---

### Module 2.10: Services Management

#### Purpose
To allow the administrator to define, configure, and manage core photography services (e.g., Wedding Photography, Pre Wedding Shoot).

#### Description
A simple, highly functional setup panel where admins can enable or disable primary categories, write baseline definitions, and create future service offerings.

#### Features
*   Services ledger containing active status toggles.
*   Baseline description editors.

#### User Actions
*   Create new services.
*   Edit service names and descriptions.
*   Toggle visibility (hide from calculations).

#### Buttons
*   **Create New Service (`id="btn-service-create"`):** Launches modal editor.
*   **Save Service (`id="btn-service-save"`):** Commits modifications.
*   **Toggle Service Status (`id="btn-service-status-{id}"`):** Enables/disables service availability.

#### Tables
*   **Services System List (`id="table-services"`):**
    *   *Columns:* Service Name, Total Packages Attached, Status, Actions.

#### Forms
*   **Service Configuration Form (`id="form-service"`):** Defines core parameters.

#### Fields
1.  **Service Name (`id="input-service-name"`):** Text, required.
2.  **Service Description (`id="input-service-desc"`):** Textarea, required.

#### Validations
*   Name must be unique across all services.

#### Empty State
*   *"No active services defined. Create a service to configure packages."*

#### Success State
*   Inline updates happen instantly.

#### Error State
*   Inline message: *"Failed to register the new service. Check database constraints."*

---

### Module 2.11: Packages Management

#### Purpose
To allow the administrator to define, customize, update, and manage pricing tiers and add-ons within each core service.

#### Description
An advanced admin editing panel listing each service's packages, detailed pricing components, and structured list items.

#### Features
*   Package card list categorized by parent service.
*   Dynamic list builder for "Included Services" inside packages.
*   Structured tables to configure "Optional Add-on" products with unit pricing metrics.

#### User Actions
*   Create new packages under a service.
*   Update base rates.
*   Add/remove default inclusions.
*   Link optional add-on configurations.

#### Buttons
*   **New Package (`id="btn-pkg-new"`):** Launches blank configuration.
*   **Save Package (`id="btn-pkg-save"`):** Commits details to the data layer.
*   **Add Inclusion Line (`id="btn-pkg-add-inclusion"`):** Inserts empty text row to the inclusion builder.
*   **Add Optional Add-on Line (`id="btn-pkg-add-addon"`):** Inserts empty row to add-ons list.

#### Tables
*   *None (Uses interactive list forms instead of tables to handle row-by-row configurations).*

#### Forms
*   **Package Specification Form (`id="form-pkg"`):** Complete package builder.

#### Fields
1.  **Package Name (`id="input-pkg-name"`):** Text, required.
2.  **Base Price (`id="input-pkg-base-price"`):** Numeric (currency), required.
3.  **Inclusions Builder (`id="input-pkg-inclusion-{idx}"`):** Text list items, required.
4.  **Add-on Name (`id="input-addon-name-{idx}"`):** Text.
5.  **Add-on Price (`id="input-addon-price-{idx}"`):** Currency numeric.

#### Validations
*   Base price cannot be negative.
*   Must include at least one inclusion line.

#### Empty State
*   *"No packages defined under this service. Create a package to activate calculators."*

#### Success State
*   Clean formatting of base pricing structures and instant alignment.

#### Error State
*   Toast warning: *"Validation failed. Package requires a base rate and valid titles."*

---

### Module 2.12: Calculator Configuration

#### Purpose
To act as the master administrative panel controlling the layout, display logic, and packages rendered in both the Public and Admin Calculators.

#### Description
A visual toggle and priority-ordering dashboard matching the exact live preview layout of the pricing calculator.

#### Features
*   **Calculator Visibility Matrix:** Enable/disable specific packages with a single click.
*   **Drag-and-Drop Display Ordering:** Controls the layout sequence of services and packages.
*   **Default State Configurations:** Define pre-selected default services and package configurations.

#### User Actions
*   Toggle visibility states.
*   Update calculator instruction text.
*   Reorder listings.

#### Buttons
*   **Save Calculator Setup (`id="btn-config-calc-save"`):** Updates live settings.
*   **Reset to Defaults (`id="btn-config-calc-reset"`):** Restores original configurations.

#### Tables
*   *None (N/A)*

#### Filters & Search
*   *None (N/A)*

#### Forms
*   **Calculator Meta Form (`id="form-config-calc"`):** Layout management variables.

#### Fields
1.  **Public Calculator Title (`id="input-config-title"`):** Text, required.
2.  **Public Help Banner Content (`id="input-config-help"`):** Textarea, optional.

#### Validations
*   Title must be present.

#### Empty State
*   Pre-populated with baseline data from active packages.

#### Success State
*   *"Configuration updated successfully. Public calculator updated."*

#### Error State
*   *"Unable to apply calculator changes."*

---

### Module 2.13: Public Calculator (Public URL)

#### Purpose
To offer a clean, interactive, and customer-facing interface where prospects can browse offerings, configure add-ons, and submit direct pricing inquiries.

#### Description
A stunning, responsive, customer-facing single-page interface styled with soft off-whites, elegant display headings (e.g., Space Grotesk), clear borders, and zero administration controls.

#### Features
*   **Interactive Service Selectors:** Elegant cards to toggle between Wedding Photography and Pre Wedding Shoot.
*   **Dynamic Package Selector:** Populates dynamically with visible packages based on the selected service.
*   **Add-on Customization Console:** Checkboxes and numeric quantity inputs to add/remove optional services with real-time total price updating.
*   **Enquiry Capture Form:** Inline card to capture prospect information and submit the lead to the CRM.

#### User Actions
*   Select service tier.
*   Choose base package.
*   Toggle optional services.
*   Adjust add-on quantities.
*   Input personal details.
*   Submit enquiry.

#### Buttons
*   **Select Service (`id="btn-pub-service-{type}"`):** Selects primary service path.
*   **Select Package (`id="btn-pub-pkg-{id}"`):** Activates base package.
*   **Submit Booking Enquiry (`id="btn-pub-submit"`):** Submits form, generates CRM Lead.

#### Tables
*   *None (N/A)* (Uses aesthetic cards for customer interaction).

#### Filters & Search
*   *None (N/A)*

#### Forms
*   **Customer Inquiry Form (`id="form-pub-enquiry"`):** Captures customer details.

#### Fields
1.  **Full Name (`id="input-pub-name"`):** Text, required.
2.  **Email Address (`id="input-pub-email"`):** Email, required.
3.  **Phone Number (`id="input-pub-phone"`):** Text, required.
4.  **Wedding Date (`id="input-pub-date"`):** Date, required.
5.  **Location/Venue Details (`id="input-pub-venue"`):** Text, optional.
6.  **Special Notes (`id="input-pub-notes"`):** Textarea, optional.

#### Validations
*   All required fields must be complete.
*   Wedding date cannot be in the past.
*   Standard phone structure validations applied.

#### Empty State
*   Initial state displays pre-selected default service and default package.

#### Success State
*   Full-page modern confirmation overlay: *"Thank you! Your enquiry has been received. Our team will contact you shortly."* framed with minimalist, elegant design.

#### Error State
*   Inline banner error: *"Unable to submit inquiry. Please verify your entries and try again."*

---

### Module 2.14: Admin Calculator

#### Purpose
To provide administrators with an in-office calculator interface to construct custom pricing configurations for walk-ins, phone consultations, or custom client packages.

#### Description
A structured workspace matching the Public Calculator mechanics but displaying additional operations-only fields and actions.

#### Features
*   Interactive service and package selectors.
*   Dynamic add-on configurations.
*   **Three High-Priority Operations Actions:** Generate Quotation PDF, Save as Lead, Update Existing Lead.
*   Client assignment modal interface.

#### User Actions
*   Select service, packages, and adjust add-ons.
*   Input client target details.
*   Initiate PDF quotation rendering.
*   Save setup to CRM.

#### Buttons
*   **Generate Quotation PDF (`id="btn-admin-calc-pdf"`):** Triggers quotation modal, generates PDF.
*   **Save as New Lead (`id="btn-admin-calc-save-lead"`):** Commits pricing setup and creates a new lead.
*   **Update Existing Lead (`id="btn-admin-calc-update-lead"`):** Integrates current configuration back into the active lead record.

#### Tables
*   *None (N/A)*

#### Filters & Search
*   **Search Active Leads (`id="input-admin-calc-lead-search"`):** Dynamic dropdown to link calculations to an existing client.

#### Forms
*   **Admin Calculator Target Form (`id="form-admin-calc-target"`):** Captures recipient details for the quotation.

#### Fields
1.  **Customer Name (`id="input-admin-calc-name"`):** Text, required.
2.  **Phone Number (`id="input-admin-calc-phone"`):** Text, optional.
3.  **Target Existing Lead Selector (`id="select-admin-calc-link-lead"`):** Dropdown, optional.

#### Validations
*   Customer Name is strictly required if "Save as Lead" or "Generate Quotation" is selected.

#### Empty State
*   Initialized with default configurations.

#### Success State
*   Triggers browser print preview dialog showing the beautifully formatted PDF, or returns confirmation notice.

#### Error State
*   *"Failed to process calculator metrics."*

---

### Module 2.15: Quotation Generator

#### Purpose
To output an elegant, modern, and print-ready digital PDF quotation based on active configurations.

#### Description
A stylized print-layout screen utilizing strict CSS styling optimized for Standard Letter and A4 dimensions, completely hidden from general app interface rails.

#### Features
*   High-contrast company branding layout.
*   Structured grids mapping packages, base prices, additions, and deductions.
*   Standardized payment schedules and legal terms block.

#### User Actions
*   Trigger PDF generation or print pipeline.

#### Buttons
*   **Confirm & Print (`id="btn-quote-print"`):** Opens native system print console.
*   **Cancel View (`id="btn-quote-cancel"`):** Closes print layout mode.

#### Tables
*   **Quotation Itemized Table (`id="table-quote-items"`):**
    *   *Columns:* Item Description, Unit Type, Action (Included/Added/Removed), Standard Unit Price, Extended Cost.

#### Forms
*   *None (N/A)*

#### Fields
*   *None (N/A)*

#### Empty State
*   *None (N/A)*

#### Success State
*   Launches system print panel with clean, print-ready columns.

#### Error State
*   *"System failure rendering PDF layout. Return to dashboard."*

---

### Module 2.16: Settings Page

#### Purpose
To allow the administrator to manage core studio parameters, contact information, terms, quotation validities, and footer disclosures.

#### Description
A structured dashboard with clean groupings, clear description blocks, and input arrays mapping core settings.

#### Features
*   **Company Information Section:** Address, Phone, Website, and Logo asset targets.
*   **Legal & Contract Controls:** Text areas to edit default Quotation Terms & Conditions and Invoice Footers.
*   **Operational Rules:** Set global defaults (e.g., Quotation Validity Duration in days).

#### User Actions
*   Upload/configure corporate logo.
*   Update company information.
*   Modify legal terms.
*   Adjust quotation parameters.

#### Buttons
*   **Save Settings (`id="btn-settings-save"`):** Commits configurations to persistent storage.

#### Tables
*   *None (N/A)*

#### Filters & Search
*   *None (N/A)*

#### Forms
*   **Settings Form Grid (`id="form-settings-master"`):** Organizes corporate metadata.

#### Fields
1.  **Studio Name (`id="input-set-name"`):** Text, required.
2.  **Email Address (`id="input-set-email"`):** Email, required.
3.  **Phone Number (`id="input-set-phone"`):** Text, required.
4.  **Website URL (`id="input-set-web"`):** Text, required.
5.  **Studio Address (`id="input-set-addr"`):** Text, required.
6.  **Quotation Validity (`id="input-set-validity"`):** Numeric (Days), required.
7.  **Quotation Footer Details (`id="input-set-footer"`):** Textarea, required.
8.  **Terms & Conditions Markup (`id="input-set-terms"`):** Textarea (supports Markdown), required.

#### Validations
*   Quotation Validity cannot be empty, negative, or exceed 365 days.
*   All primary communication fields must be valid.

#### Empty State
*   Initialized with default placeholder settings if none exist in the database.

#### Success State
*   *"Studio parameters updated. New settings applied to all generated documents."*

#### Error State
*   *"Failed to commit settings updates. Verify database connection."*

---

## 3. Comprehensive Feature Matrix & Layout Standards

All screens inside **Aperture CRM & Booking Management System** must adhere to the following layout standards:

*   **Responsive Desktop-First Execution:** Designed primarily for 1080p dashboard monitors. Navigation and operations remain sidebar-accessible and multi-column.
*   **Unified Sidebar:** An elegant vertical sidebar containing navigation links: Dashboard, Calendar, Leads, Follow Ups, Bookings, Services, Configuration, and Settings.
*   **Global Layout Typography:** Primary typography set to "Inter" for interface elements, paired with "JetBrains Mono" for numbers, values, statuses, and counts.
*   **Standard Modal Pattern:** Modals overlay with an opaque dark backdrop and slide up cleanly. They contain a standard close icon and an Escape key listener.

---

## 4. Public Calculator Specifications

The Public Calculator serves as the primary digital gateway of the website, giving prospective clients immediate access to dynamic pricing structures.

```
+-------------------------------------------------------------+
|                     STUDIO LOGO / TITLE                     |
|                                                             |
|   1. SELECT SERVICE:                                        |
|   [ Wedding Photography ]       [ Pre Wedding Shoot ]       |
|                                                             |
|   2. CHOOSE BASE PACKAGE:                                   |
|   +--------------------+  +--------------------+            |
|   | Standard Pack      |  | Premium Elite      |            |
|   | $1,500             |  | $3,000             |            |
|   +--------------------+  +--------------------+            |
|                                                             |
|   3. CONFIGURE ADD-ONS:                                     |
|   [x] Extra Photographer (+ $500)                           |
|   [ ] Raw Files Delivery (+ $300)                           |
|   [x] Drone Coverage  Qty [ 2 ] (+ $200 / hr)               |
|                                                             |
|   -------------------------------------------------------   |
|   TOTAL ESTIMATED PRICE:                             $2,400 |
|   -------------------------------------------------------   |
|                                                             |
|   4. SUBMIT YOUR INQUIRY:                                   |
|   Name: [____________]  Email: [____________]               |
|   Phone: [___________]  Date:  [____________]               |
|   [                       SUBMIT                          ] |
+-------------------------------------------------------------+
```

### Flow and Logic Specifications
1.  **Service Entry:**
    *   Customer lands on the public URL `/calculator`.
    *   System checks active configuration settings. Only services marked `enabled` in **Services Management** are displayed.
2.  **Package Population:**
    *   Selecting a service dynamically updates the visible package cards in step 2.
    *   Packages flagged as `hidden` are bypassed.
    *   Each package displays its Base Price, baseline description, and Included Services clearly.
3.  **Add-on Customization Console:**
    *   The console displays optional services and add-ons associated with the selected package.
    *   Each add-on item has a clear description, price, and toggle state.
    *   If the add-on is marked as "quantifiable" in the configuration, the system displays increment/decrement controls.
    *   If an inclusion is designated as "removable with credit", the user can uncheck it to apply a pre-configured discount value.
4.  **Automatic Pricing Calculation Engine:**
    *   The dynamic price calculation runs instantly on any client interaction.
    *   **Calculation Formula:**
        $$\text{Total Price} = \text{Package Base Price} + \sum (\text{Add-on Unit Price} \times \text{Quantity}) - \sum \text{Removal Credits}$$
    *   The calculated total update is highlighted with a clean, fluid transition effect.
5.  **Enquiry Capture & Lead Synchronization:**
    *   To finalize the inquiry, the prospect must fill out the integrated Inquiry Form.
    *   Clicking **Submit Enquiry** triggers validation. If valid, the engine creates a new record in the database with status `New Lead`.
    *   All package selections, toggled add-ons, calculated prices, dates, and client information are saved directly to this lead record.
    *   The user is shown a clean success confirmation overlay.

---

## 5. Admin Calculator Specifications

The Admin Calculator is located inside the secure workspace `/admin/calculator`. It mirrors the pricing calculation engine of the Public Calculator but provides additional administrative actions.

```
+-------------------------------------------------------------+
| SECURE WORKSPACE | ADMIN PRICING CALCULATOR                  |
|                                                             |
|   [ Active Service and Package Selector Modules ... ]       |
|                                                             |
|   -------------------------------------------------------   |
|   CALCULATED CONTRACT TOTAL:                         $2,400 |
|   -------------------------------------------------------   |
|                                                             |
|   ASSIGN INQUIRY RECIPIENT:                                 |
|   Select Existing Lead: [ Search Active Leads ...      [v] ]|
|   -- OR --                                                  |
|   Customer Name (Req):  [_________________________________] |
|   Customer Phone (Opt): [_________________________________] |
|                                                             |
|   ADMIN ACTIONS:                                            |
|   [ GENERATE QUOTATION ]  [ SAVE AS NEW ]  [ UPDATE LEAD ]  |
+-------------------------------------------------------------+
```

### Detailed Functional Interactions
1.  **Dual Client Assignment Channels:**
    *   **Method A (Existing Lead):** Admin searches and selects an existing lead from the active CRM. The system automatically populates the Customer Name and Phone Number fields based on the selected lead's record.
    *   **Method B (Manual Walk-In):** Admin leaves the dropdown empty and types directly into the Customer Name and Phone fields.
2.  **Action Matrix:**
    *   **Generate Quotation:** Generates a structured digital layout optimized for PDF rendering and printing. **This action is entirely transient; it does not save, write, or alter any database records.** This allows the admin to experiment with custom layouts without cluttering the pipeline.
    *   **Save as New Lead:** Commits the current calculator layout, configurations, and pricing totals, creating a new record in the database with status `First Call`.
    *   **Update Lead:** If an existing lead is selected, this action overwrites that lead's associated package settings, pricing, and item lists with the active configurations.
3.  **Validation Matrix:**
    *   If the admin clicks "Generate Quotation", the system validates that **Customer Name** is completed.
    *   If the admin clicks "Save as New Lead", the system validates that **Customer Name** is completed.
    *   If the admin clicks "Update Lead", the system validates that an **Existing Lead** is selected from the dropdown list.

---

## 6. Quotation Generator Specifications

The generated quotation is designed to be elegant, professional, and print-ready. It uses high-contrast typography, generous padding, and a structured grid layout.

```
+-------------------------------------------------------------------------+
|                                                                         |
|  [ COMPANY LOGO ]                                      QUOTATION        |
|  APERTURE PHOTOGRAPHY STUDIO                           Date: 2026-06-27 |
|  Phone: +1 (555) 123-4567                             Valid Until: +30D |
|  Email: contact@aperture.com                                            |
|  Web: www.aperture.com                                                  |
|  Address: 100 Creative Way, Suite A, SF, CA                             |
|                                                                         |
|  ---------------------------------------------------------------------  |
|  PREPARED FOR:                                                          |
|  Customer Name: Sarah Jenkins                                           |
|  Customer Phone: +1 (555) 987-6543                                      |
|                                                                         |
|  ---------------------------------------------------------------------  |
|  SELECTED SERVICE PACKAGE SUMMARY                                       |
|                                                                         |
|  SERVICE: Wedding Photography                                           |
|  PACKAGE: Elite Premium Gold Edition                   Base: $3,000.00  |
|                                                                         |
|  INCLUDED SERVICES:                                                     |
|  * 10 Hours of Continuous Coverage                                      |
|  * Two Senior Photographers                                             |
|  * 500 High-Res Edited Digital Images                                   |
|  * Complimentary Pre-Wedding Engagement Shoot                           |
|                                                                         |
|  MODIFICATIONS & OPTIONS:                                               |
|  [+] Added: Custom Lay-Flat Leather Album (Qty 1)          +$400.00     |
|  [+] Added: Same-Day Edit Slideshow                        +$600.00     |
|  [-] Removed: Engagement Shoot Credit                      -$300.00     |
|                                                                         |
|  ---------------------------------------------------------------------  |
|  TOTAL CONTRACT VALUE:                                     $3,700.00    |
|  ---------------------------------------------------------------------  |
|                                                                         |
|  TERMS & CONDITIONS:                                                    |
|  1. A non-refundable 30% retainer is required to secure the date.       |
|  2. Balance payments are due 14 days prior to the wedding event date.    |
|  3. All images are subject to creative copyright edits.                 |
|                                                                         |
|  Thank you for choosing Aperture. We look forward to capturing your day. |
+-------------------------------------------------------------------------+
```

### Visual and Print Layout Rules
*   **Print CSS Stylesheet:** Employs explicit standard `@media print` rules:
    *   Hides sidebars, navigation bars, buttons, and notifications.
    *   Removes background drop-shadows and page fills.
    *   Uses 100% width grids to align perfectly to the physical page borders.
*   **Typography Scale:** Elegant headings styled with standard serif or clean sans-serif typefaces. Financial values and metrics are aligned right in `JetBrains Mono`.
*   **Branding Assets:** The quotation pulls the company logo, address, phone, website, and footer details dynamically from the global **Settings** configuration.
*   **Date Calculations:** The system automatically calculates the **Valid Until** date by adding the default Quotation Validity configuration (e.g., 30 Days) to the current calendar date.

---

## 7. Lead Management Workflow & Status Lifecycles

Leads are organized into a structured pipeline of status states. The status dictates how inquiries flow through the system.

```
 [ Public Calc Submission ] 
            |
            v
     ( New Lead ) -------> ( First Call ) -------> ( 1st Follow Up )
                                                        |
  ( Lost Lead ) <=================== ( 3rd ) <--- ( 2nd Follow Up )
        |
        +---> Purged automatically after 7 Days
        |
        v
  ( Converted ) -------> Moves to Bookings LEDGER & CALENDAR
```

### Detailed Pipeline Transitions
1.  **New Lead:**
    *   The entry status for any lead submitted via the **Public Calculator**.
    *   Admin is notified immediately of the new inquiry on the dashboard.
2.  **First Call:**
    *   Applied once the admin initiates initial contact (e.g., schedules or conducts an introductory call).
3.  **1st Follow Up:**
    *   Triggered when the first proposal or follow-up email is sent after the initial consultation.
4.  **2nd Follow Up:**
    *   Applied when a second check-in is initiated to follow up on the proposal.
5.  **3rd Follow Up:**
    *   The final follow-up attempt before marking the lead as unresponsive.
6.  **Converted (Closed Won):**
    *   Applied when the client approves the proposal, signs the contract, or pays the retainer.
    *   **Workflow Trigger:** The lead is moved from the Leads pipeline to the active **Bookings Ledger**, and the wedding date is automatically added to the **Calendar**.
7.  **Lost (Closed Lost):**
    *   Applied if the client declines, books another photographer, or remains unresponsive.
    *   **Workflow Trigger:** The lead is moved to the **Lost Leads Panel**, starting a strict 7-day retention countdown.

---

## 8. Follow Up Module & Interaction Logging

The Follow Up Module is designed to streamline communications and ensure active leads are checked on consistently.

### Core Logging Specifications
*   **Manual Activity Capture:** Allows the admin to record interaction notes easily:
    *   *Type Toggle:* Phone Call, Email, Meeting, WhatsApp Message.
    *   *Timestamp:* Automatically logs the date and time of the interaction.
    *   *Summary Text:* Admin inputs key takeaways and updates.
*   **Chronological Activity Feed:** Displays all logged interactions on the Lead Details page, keeping team members aligned on the client's history.
*   **Next Action Date Sync:** Saving an interaction dynamically updates the lead's "Last Contacted Date," helping identify which cold leads require follow-up.

---

## 9. Converted Bookings Transition Logic

Moving a lead to the **Converted** status triggers automated workflows to process the contract.

```
                  +-------------------------+
                  |  LEAD STATUS: CONVERTED |
                  +-------------------------+
                               |
                               | (Transition Triggered)
                               v
                  +-------------------------+
                  |  1. Generate Booking    |
                  |     Ledger Entry        |
                  +-------------------------+
                               |
                               v
                  +-------------------------+
                  |  2. Create Calendar     |
                  |     Event on Date       |
                  +-------------------------+
                               |
                               v
                  +-------------------------+
                  |  3. Lock Pricing        |
                  |     Configuration       |
                  +-------------------------+
```

### Technical Workflow Steps
1.  **Booking Registration:**
    *   The system creates a new entry in the **Bookings Ledger**, copying the client details, wedding date, and final pricing configuration from the lead record.
2.  **Calendar Integration:**
    *   The system schedules a new event on the **Calendar** for the client's wedding date, using the format `Wedding: Client Name`.
3.  **Configuration Lock:**
    *   The pricing configuration is locked. Future changes to packages or base prices in **Calculator Configuration** will not alter the pricing of already converted bookings.

---

## 10. Lost Leads Holding & Retention Rules

To keep the CRM organized while allowing room to recover cold prospects, lost leads are handled with a temporary retention model.

```
                  +-------------------------+
                  |    LEAD STATUS: LOST    |
                  +-------------------------+
                               |
                               v
                  +-------------------------+
                  | Move to Lost Leads Panel|
                  | Start 7-Day Countdown   |
                  +-------------------------+
                               |
                 +-------------+-------------+
                 | (Within 7 Days)           | (After 7 Days)
                 v                           v
    +-------------------------+  +-------------------------+
    | Admin clicks RESTORE    |  | System Background Job  |
    | Return Lead to CRM      |  | Permanently Purge Lead  |
    +-------------------------+  +-------------------------+
```

### Retention and Deletion Engine Rules
*   **Automatic 7-Day Purge:** When a lead is marked `Lost`, the system schedules its permanent deletion exactly 168 hours (7 days) from the status update timestamp.
*   **Recovery and Restore Option:** Admins can click "Restore" on any lead in the holding bin to return it to active CRM lists instantly.
*   **Immediate Manual Purge:** Admins can also choose to bypass the 7-day holding period and permanently delete a lead immediately with one click.

---

## 11. Calendar Synchronization & Event Behaviors

The Calendar serves as the master schedule for the studio's wedding shoots.

*   **Confirmed Shoots Only:** The calendar displays only events linked to bookings with the `Converted` status. Active, new, or lost leads do not appear on the calendar grid.
*   **Interactive Event Routing:** Clicking on a calendar event opens the related **Lead Details** page instantly, allowing the admin to view event logistics, packages, and notes with one click.
*   **Status Color Coding:** Events are color-coded by service category (e.g., soft blue for Wedding Photography, subtle lavender for Pre Wedding Shoots) to help admins understand the upcoming schedule at a glance.

---

## 12. Reminder Center Alerts & Scheduling

The Reminder Center manages operational tasks, timelines, and action items.

```
                  +-------------------------+
                  |  SCHEDULE NEW TASK      |
                  +-------------------------+
                               |
                               v
             +-----------------+-----------------+
             | (Tied to Client ID)               | (Standalone Task)
             v                                   v
+-----------------------------+     +-----------------------------+
| Link dynamically on Lead    |     | Render on General dashboard |
| Details Chronology Page     |     | lists and todo grids        |
+-----------------------------+     +-----------------------------+
```

### Detailed Functional Requirements
*   **Client Association:** Reminders can be linked to a specific client record, or created as a standalone operational task (e.g., "Clean camera lenses").
*   **Automatic Notification System:** Reminders reaching their scheduled date and time trigger visual alerts in the header bar and highlight the task on the dashboard.
*   **Interactive Completion Checkbox:** Completing a task automatically archives it from active lists, updating metrics across the dashboard.

---

## 13. Services Structure & Custom Configurations

Services serve as the foundation of the pricing model.

```
+------------------------------------------------------------+
| SERVICE META SCHEMA                                        |
+------------------------------------------------------------+
|  ID: "srv_wedding_photo" (Primary Key)                     |
|  Name: "Wedding Photography"                               |
|  Description: "Full day coverage of main event ceremonies"|
|  Status: "Enabled" (Boolean Toggle)                        |
+------------------------------------------------------------+
```

### Business Rules
*   **Unique Names:** Service names must be unique to prevent calculation conflicts.
*   **Status Toggle:** Disabling a service instantly hides it and its packages from the public and admin calculators, without deleting historical lead data.

---

## 14. Packages Configuration & Options Schema

Packages are specific pricing configurations structured within a parent service.

```
+------------------------------------------------------------+
| PACKAGE DATA SCHEMATICS                                    |
+------------------------------------------------------------+
|  Parent Service ID: "srv_wedding_photo"                     |
|  Package ID: "pkg_elite_gold"                              |
|  Package Name: "Elite Gold Special"                        |
|  Base Price: $3,200.00                                     |
|                                                            |
|  Default Included Services:                                |
|    - [ "10 Hours of coverage", "2 Photographers" ]         |
|                                                            |
|  Optional Custom Add-ons:                                  |
|    - { Name: "Additional Hour", UnitPrice: $250.00 }       |
|    - { Name: "Leather Photo Album", UnitPrice: $450.00 }   |
+------------------------------------------------------------+
```

### Detailed Package Configuration Rules
*   **Base Price Setup:** Admins configure a base rate for each package.
*   **Included Services List:** A simple line-by-line builder defines default inclusions.
*   **Optional Add-ons List:** Admins can attach optional add-on services with set unit prices, which clients can select on the calculator.

---

## 15. Calculator Configuration Engine

This page gives administrators complete control over the pricing mechanics of the public-facing and internal calculators.

*   **Dynamic Packaging Rules:** Changes saved here update the pricing logic and package listings across both calculators instantly.
*   **Package Toggles:** Hide or display packages dynamically with a single switch.
*   **Custom Reordering:** Simple controls allow admins to drag and drop listings to highlight specific packages or promotional tiers.

---

## 16. System Settings & Studio Metadata

Global settings configure the branding, legal foundations, and operations of the studio.

*   **Corporate Identity Profile:** Configures studio metadata used across header, footer, and email formats.
*   **Legal & Terms Editor:** A Markdown text editor allows the admin to format legal terms, payment schedules, and disclosures for generated quotations.
*   **Default Invoice Validity:** Configures the default expiration timeframe (e.g., 30 days) for new quotations.

---

## 17. Dashboard Widgets & Metrics

The dashboard displays high-priority operational metrics.

```
+-----------------------+ +-----------------------+ +-----------------------+
| NEW LEADS             | | OVERDUE TASKS         | | UPCOMING SHOOTS       |
|  08 Inquiries This Wk | |  03 Action Items Due  | |  04 Bookings Next 14D |
+-----------------------+ +-----------------------+ +-----------------------+
```

### Metric Widget Logic
*   **Today's Reminders:** Displays a list of tasks scheduled for the current date. Completing tasks updates the dashboard list in real time.
*   **Today's Follow Ups:** Displays active leads scheduled for follow-up on the current date, sorted by age and status.
*   **Revenue Metrics (Future Phase):** Designed to display revenue summaries based on confirmed bookings in the bookings ledger.

---

## 18. Notification Specifications

The system features real-time notifications to alert the admin of critical events.

*   **Immediate Inquiry Notification:** A persistent header alert and toast notification trigger when a new lead is submitted through the Public Calculator.
*   **Overdue Follow Up Alerts:** Highlight active leads requiring action on the dashboard and Leads lists.
*   **System Notifications:** System confirmations trigger for database updates, manual exports, or successful settings saves.

---

## 19. Global Search Specifications

A unified search bar is located in the primary navigation header of the admin dashboard.

```
+---------------------------------------------------------+
| SEARCH: [ S_                                          ] |
|---------------------------------------------------------|
|  MATCHING LEADS:                                        |
|  - Sarah Jenkins (Wedding Photo | Status: New Lead)     |
|  - Samuel Carter (Pre-Wedding   | Status: First Call)   |
|                                                         |
|  MATCHING BOOKINGS:                                     |
|  - Sarah & Michael (Shoot Date: Aug 12, 2026)           |
+---------------------------------------------------------+
```

### Functional Search Rules
*   **Multi-Column Queries:** Search queries match across Customer Name, Email Address, and Phone Number fields.
*   **Categorized Search Results:** Results are organized into clear categories (Leads, Bookings, Completed Projects) to help the admin navigate directly to relevant files.
*   **Minimalist Interface:** Results are styled in a lightweight overlay panel that appears as the user types.

---

## 20. Comprehensive Business Rules

The system follows a strict set of business rules to ensure consistency and prevent data conflicts.

1.  **Strict Status Separation:**
    *   Leads and Bookings are strictly separated. Only leads marked `Converted` are moved to the Bookings Ledger and displayed on the Calendar.
2.  **Transient Quotations:**
    *   Generating a quotation from the Admin Calculator does not save lead details or create dummy files in the database, allowing admins to calculate custom estimates freely.
3.  **Client-Initiated Leads:**
    *   Submitting an inquiry through the Public Calculator is the only customer action that creates a lead in the CRM.
4.  **No Hardcoded Pricing:**
    *   All package rates, add-on costs, and discounts are dynamically pulled from the active **Calculator Configuration** settings. No pricing values are hardcoded.
5.  **Locked Invoice Historical Data:**
    *   Updating package pricing in settings does not affect existing leads or converted bookings. This preserves historical contract data and ensures financial consistency.

---

## 21. Future Enhancements & Roadmap

These potential features can be integrated into future development phases to further streamline studio operations:

1.  **Interactive Client Account Portals:**
    *   Provide clients with secure portals to review package selections, sign contracts online, view photo previews, and make secure retainer payments.
2.  **External Calendar Sync (Google Calendar / iCal):**
    *   Integrate two-way calendar synchronization to sync confirmed bookings directly with Google Calendar, Outlook, or Apple Calendar.
3.  **Automated Email & SMS Follow Up Sequences:**
    *   Trigger automated follow-up messages when a lead changes status (e.g., sending a thank-you note on "New Lead" or payment details on "Converted").
4.  **Online Retainer Payment Integration (Stripe):**
    *   Add integrated payment options to let clients pay retainers or invoices securely from the quotation or calculator screens.
5.  **Interactive Digital Contract Signing:**
    *   Attach legal agreements to quotations, letting clients sign contracts digitally inside their client workspace.

---
*End of Product Requirements Document.*
