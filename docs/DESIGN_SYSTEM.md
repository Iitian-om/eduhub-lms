# EduHub Design System

**Version:** 1.21.2 
**Last Updated:** April 13, 2026 (v1.2.0 - Button & Stats Enhancements)  
**Created:** April 13, 2026 (v1.0.0)

## Overview

The EduHub Design System is a comprehensive guide for building consistent, professional, and accessible user interfaces across the platform. This document outlines all styling conventions, component patterns, color palettes, typography, and DaisyUI integration standards.

---

## Color Palette

### Primary Brand Colors

| Color | Hex Code | RGB | Usage |
|-------|----------|-----|-------|
| **Primary (Aqua)** | `#29C7C9` | rgb(41, 199, 201) | Primary CTAs, highlights, active states |
| **Primary Dark** | `#178E90` | rgb(23, 142, 144) | Hover states for primary buttons |
| **Primary Light** | `#EAF8F8` | rgb(234, 248, 248) | Background accents, light badges |

### Neutral & Background Colors

| Color | Hex Code | RGB | Usage |
|-------|----------|-----|-------|
| **Background Primary** | `#F4FAFA` | rgb(244, 250, 250) | Main page background (light teal tint) |
| **Card Border** | `#D7ECEE` | rgb(215, 236, 238) | Card/container borders |
| **Border Accent** | `#CFE9EA` | rgb(207, 233, 234) | Subtle borders, gradient overlays |

### Text Colors

| Color | Hex Code | RGB | Usage |
|-------|----------|-----|-------|
| **Text Primary** | `#1B2A33` | rgb(27, 42, 51) | Main heading, primary text |
| **Text Secondary** | `#4A6572` | rgb(74, 101, 114) | Body text, secondary content |
| **Text Muted** | `#6A808A` | rgb(106, 128, 138) | Disabled text, helper text, captions |

### Semantic Colors

- **Success/Emerald**: `#059669` (emerald-600) - Completed actions, positive states
- **Error/Red**: `#DC2626` (red-600) - Destructive actions, errors, deletion
- **Warning/Amber**: `#D97706` (amber-600) - Warnings, moderation, in-progress
- **Info/Indigo**: `#4F46E5` (indigo-600) - Information, instructor role

---

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Text Hierarchy

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **H1** | 32-48px | 700 (bold) | 1.2 | Page titles, hero headlines |
| **H2** | 24-32px | 700 (bold) | 1.3 | Section headings |
| **H3** | 18-24px | 600 (semibold) | 1.4 | Subsection headings, card titles |
| **Body** | 14-16px | 400 (regular) | 1.6 | Paragraph text, descriptions |
| **Small** | 12-14px | 400 (regular) | 1.5 | Labels, captions, metadata |

### Text Styles

- **Primary Text**: Color `#1B2A33`, weight 600-700 for headings
- **Secondary Text**: Color `#4A6572`, weight 400
- **Muted Text**: Color `#6A808A`, weight 400
- **Link Color**: `#29C7C9` with underline on hover

---

## Layout & Spacing

### Container Widths

```
- Mobile: 100% - 16px padding on each side
- Tablet: max(600px, 100% - 32px)
- Desktop: max(1024px, 100% - 48px)
- XL Desktop: 1280px (max-w-7xl)
```

### Spacing Scale (Tailwind)

Standard spacing increments (4px base):

- `px-4` (16px horizontal)
- `py-8` (32px vertical)
- `gap-4`, `gap-6`, `gap-8` for grids and flex

### Border Radius

- **Small components** (buttons, badges): `rounded-full` (9999px)
- **Medium components** (cards): `rounded-2xl` (16px)
- **Large containers** (hero sections): `rounded-3xl` (24px)

---

## Component Styles

### Hero Sections

All hero sections follow this pattern:

```jsx
<section className="rounded-3xl border border-[#CFE9EA] bg-gradient-to-br from-[#EAF8F8] via-white to-[#ECF6FF] p-8 shadow-sm">
  <h1 className="text-4xl md:text-5xl font-bold text-[#1B2A33] mb-2">Title</h1>
  <p className="text-lg text-[#4A6572]">Subtitle</p>
</section>
```

**Gradient Breakdown**:
- From: light teal (`#EAF8F8`)
- Via: white
- To: light blue (`#ECF6FF`)
- Border: subtle aqua (`#CFE9EA`)

### Cards

Card styling (using DaisyUI `card` class):

```jsx
<div className="card bg-white border border-[#D7ECEE] shadow-md hover:shadow-lg transition-all">
  <div className="card-body">
    {/* Content */}
  </div>
</div>
```

**States**:
- Normal: `border-[#D7ECEE]`, `shadow-md`
- Hover: `shadow-lg`, `border-[#29C7C9]`
- Active/Selected: `border-[#29C7C9]` with `bg-[#EAF8F8]`

### Buttons

#### Primary Button (CTA)

```jsx
<button className="btn bg-[#29C7C9] hover:bg-[#178E90] text-white border-none rounded-full">
  Action
</button>
```

#### Secondary Button (Outline)

```jsx
<button className="btn border-[#29C7C9] text-[#29C7C9] bg-white hover:bg-[#EAF8F8] rounded-full">
  Action
</button>
```

#### Destructive Button

```jsx
<button className="btn btn-error bg-red-600 hover:bg-red-700 text-white border-none rounded-full">
  Delete
</button>
```

**Sizes**:
- Mobile: `btn-sm` (32px height)
- Desktop: `btn-md`, `btn-lg` with appropriate padding

### Badges

```jsx
<span className="badge gap-2 bg-[#EAF8F8] text-[#29C7C9] border-none">
  Label
</span>
```

**Semantic badges**:
- Success: `bg-emerald-100 text-emerald-700`
- Error: `bg-red-100 text-red-700`
- Warning: `bg-amber-100 text-amber-700`
- Info: `bg-indigo-100 text-indigo-700`

### Modals & Overlays

Use DaisyUI modal patterns with our color scheme:

```jsx
<dialog id="modal_id" className="modal">
  <div className="modal-box bg-white border-[#D7ECEE]">
    {/* Content */}
  </div>
</dialog>
```

### Input Fields

```jsx
<input className="input input-bordered bg-[#F4FAFA] border-[#D7ECEE] text-[#1B2A33]" />
<select className="select select-bordered bg-[#F4FAFA] border-[#D7ECEE]" />
```

**Focus States**:
- Border: `focus:border-[#29C7C9]`
- Ring: `focus:ring-2 focus:ring-[#29C7C9] focus:ring-opacity-20`

### Tabs (DaisyUI)

```jsx
<div className="tabs tabs-bordered">
  <input type="radio" name="tabs" className="tab" label="Tab 1" />
  <input type="radio" name="tabs" className="tab" label="Tab 2" />
</div>
```

**States**:
- Active: `text-[#29C7C9]`, `border-b-2 border-[#29C7C9]`
- Inactive: `text-gray-600`

### Stats (DaisyUI)

```jsx
<div className="stats shadow bg-[#F4FAFA] border border-[#D7ECEE]">
  <div className="stat">
    <div className="stat-title text-[#4A6572]">Title</div>
    <div className="stat-value text-[#29C7C9]">VALUE</div>
    <div className="stat-desc text-[#6A808A]">Description</div>
  </div>
</div>
```

---

## DaisyUI Configuration

### Installed Version
- **Version**: `4.12.24` (as of April 13, 2026)
- **Status**: Actively integrated across all new component designs

### Included Components

Using DaisyUI for the following components:
- `btn` - Button component
- `card` - Card container
- `badge` - Badge/label component
- `stats` - Statistics display
- `tabs` - Tabbed interface
- `modal` - Modal dialogs
- `input` - Text input
- `select` - Dropdown select
- `alert` - Alert messages
- `progress` - Progress bars
- `avatar` - Avatar images
- `divider` - Divider line

### DaisyUI Customization

DaisyUI themes are configured in Tailwind config with our custom color palette applied through CSS custom properties or Tailwind class utilities.

---

## Implementation Guidelines

### Pages Using New Design System

✅ **Updated with DaisyUI (v1.0.0 - April 13, 2026)**:

1. [Homepage](../client/app/page.js) - Hero, services, workflow sections
2. [About Page](../client/app/about/page.js) - Mission, focus, workflow, direction
3. [Profile Page](../client/app/profile/page.js) - User identity, enrolled courses
4. [Contact Page](../client/app/contact/page.js) - Form with hero section
5. [Courses Page](../client/app/courses/page.js) - Course grid with filters and modal
6. [Notes Page](../client/app/notes/page.js) - Notes discovery and management
7. [Books Page](../client/app/books/page.js) - Book discovery and downloads
8. [Research Papers Page](../client/app/research-papers/page.js) - Paper discovery
9. [Privacy Policy Page](../client/app/privacy/page.js) - Legal content sections
10. [Terms of Service Page](../client/app/terms/page.js) - Legal content sections
11. [Dashboard Page](../client/app/dashboard/page.js) - User dashboard with DaisyUI stats
12. [Profiles Browse Page](../client/app/profiles/page.js) - Community profile discovery
13. [Content Review Page](../client/app/moderation/page.js) - Admin moderation workspace

### Pages Pending Update

- Admin sub-pages (analytics, audit-logs, content, courses, instructors, notifications, reports, settings, users)
- Course detail pages
- Edit/upload pages with forms
- Debug and other utility pages

---

## Accessibility Standards

- **Color Contrast**: All text meets WCAG AA standards (minimum 4.5:1 for normal text)
- **Focus States**: All interactive elements have visible focus indicators
- **Semantic HTML**: Proper use of headings, lists, form labels
- **ARIA Labels**: Used on icon-only buttons and skip navigation links

---

## Responsive Design

### Breakpoints (Tailwind)

```
sm: 640px   - Tablet
md: 768px   - Tablet/Desktop
lg: 1024px  - Desktop
xl: 1280px  - Large Desktop
2xl: 1536px - Ultra-wide
```

### Mobile-First Approach

- Start with mobile styles
- Use `md:`, `lg:`, `xl:` prefixes for larger breakpoints
- Grid columns: `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-3`

---

## Version History

### Version 1.2.0 - April 13, 2026 (Button & Stats Enhancements)

**Release Date**: April 13, 2026

**Updates**:
- **Dashboard Button Improvements**:
  - Hero action buttons enlarged to `btn-lg` with `px-8` padding
  - Added `shadow-sm` for visual depth
  - "Continue Learning" button increased from `btn-sm` to `btn-md`
  - "Explore Courses" CTA upgraded to `btn-lg` with enhanced styling

- **Quick Stats Cards Redesign**:
  - Background changed to white (from light teal)
  - Border increased to `border-2` for stronger contrast
  - Stat values enlarged to `text-4xl`
  - Titles styled with uppercase + semibold + letter spacing
  - Internal padding increased to `py-6`
  - Grid gap increased to `gap-5`
  - Added hover shadow transition (`hover:shadow-lg`)

- **Header Navigation Additions**:
  - Added role-gated "Moderation" link for Admin/Mod users
  - Added role-gated "Admin" link for Admin users
  - Navigation links styled with `rounded-full` shape

- **Profiles Browse Enhancements**:
  - Fixed JSX structural errors (duplicate forms)
  - Role-based badge color improvements
  - Enhanced profile card visuals

- **Content Review Page Improvements**:
  - Component renamed to `ContentReviewPage` for clarity
  - Enhanced hero section with access badges
  - Platform stats display with semantic colors

**Pages Refined**:
- Dashboard (button sizing, stats visibility)
- Profiles Browse (bug fixes, enhancements)
- Content Review/Moderation (naming, UX)
- Header Navigation (role-based routing)

---

### Version 1.0.0 - April 13, 2026 (Initial Design System)

**Release Date**: April 13, 2026

**Additions**:
- Comprehensive color palette definition
- DaisyUI 4.12.24 integration
- Typography hierarchy standards
- Component patterns for all major UI elements
- Layout & spacing guidelines
- Responsive design documentation
- Implementation roadmap for all pages

**Pages Updated**:
- Dashboard, Profiles, Content Review/Moderation
- Homepage, About, Profile, Contact (from previous phases)
- Courses, Notes, Books, Research Papers, Privacy, Terms

**Component Library**:
- Cards with consistent borders and shadows
- Buttons (primary, secondary, destructive)
- Hero sections with gradient backgrounds
- Stats cards and information displays
- Form inputs with DaisyUI styling
- Badges with semantic color coding
- Tabs and navigation patterns
- Modals and overlays

---

## Best Practices

1. **Always use the color palette**: Don't add arbitrary colors - use the defined hex codes
2. **Consistent spacing**: Use Tailwind's spacing scale (4px increments)
3. **DaisyUI first**: Leverage DaisyUI component utilities before writing custom CSS
4. **Mobile-responsive**: Design for mobile first, then enhance for desktop
5. **Accessibility**: Test keyboard navigation and screen reader compatibility
6. **Dark mode ready**: Structure allows for future dark mode toggle
7. **Code comments**: Document component purpose with JSX comments

### Example Component Comment

```jsx
{/* Hero section with gradient background and call-to-action */}
<section className="rounded-3xl border border-[#CFE9EA] ...">
  {/* Section content */}
</section>
```

---

## Future Roadmap

- **Dark mode** theme implementation
- **shadcn/ui** integration for advanced components (popovers, dropdowns, date pickers)
- **Component library** export for design tools
- **Animation guidelines** for transitions and interactions
- **Motion design** specifications with Framer Motion examples
- **Micro-interactions** standards for hover, focus, loading states

---

## Support & Contributions

For design system updates or contributions:
1. Ensure all changes maintain WCAG accessibility standards
2. Update this document with any new patterns or color additions
3. Test across multiple devices and browsers
4. Follow the existing code comment patterns

---

**Last Updated By**: GitHub Copilot  
**Next Review Date**: May 13, 2026
