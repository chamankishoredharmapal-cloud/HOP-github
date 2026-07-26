# Narrative Plan: Landing Pages (Atelier Appointments)

## Arc
- **Arc Type:** Short-form Journey.
- **Tension Curve:** From the desire for something specific to the relief of having a trusted guide.

## Page Sequence (`src/pages/Appointments.tsx`)

### 1. Hero / The Invitation
- **Visual:** A split layout. Left side: An image of the physical atelier or a master weaver at work. Right side: The form.
- **Headline:** The Private Viewing
- **Subtitle:** Time spent together.

### 2. The Philosophy (Short copy above form)
- **Copy:** "Choosing a handloom is rarely a hurried decision. Whether you are seeking a specific drape for a wedding, or looking to understand the weight of a Kanchipuram silk before you commit, we are here to guide you."

### 3. The Form
- **Fields & Labels:**
  - `name`: "How may we address you?"
  - `email`: "Where shall we write to you?"
  - `type`: "The nature of your visit" (Options: Bridal Consultation, Custom Weaving, General Viewing).
  - `location`: "How shall we meet?" (Options: The Atelier in Pondicherry, A Quiet Call).
  - `notes`: "Is there a specific collection or thought on your mind?"
  - `submit`: "Request an Appointment"

## Core Copy Directives
- **Remove:** "Book Now", "Submit", "First Name", "Last Name".
- **Formatting:** Clean React form with minimalist borders and generous padding.

## Version
- **Plan Version:** 1.0
- **Status:** Approved
- **Approved By:** Editorial Lead
