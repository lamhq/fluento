# Exercise List Screen

## Introduction

- **Purpose**: Display a paginated, filterable list of exercises owned by the current user, allowing them to manage exercises through create, read, update, and delete operations.
- **Context**: This screen is the primary entry point for the exercise management feature. Users access it from the main navigation and can move into create, update, delete, or import workflows.
- **Key Goals**:
  - Display all exercises for the current user.
  - Enable users to filter and sort exercises efficiently.
  - Provide quick access to create, update, delete, and import actions.
  - Ensure the experience works seamlessly on mobile and desktop devices.

## Wireframes & Mockups

```
┌────────────────────────────────────────────────────────────────────────┐
│ Exercise Management                                                    │
├────────────────────────────────────────────────────────────────────────┤
│ [+ Create] [↗ Import] [≡ Filters]                                      │
├────────────────────────────────────────────────────────────────────────┤
│ Filter Panel (Collapsed/Expanded)                                      │
│ ┌──────────────────────────────────────────────────────────┐           │
│ │ Scenario: [____________]                                 │           │
│ │ Topics: [Conversation ▼] [Grammar ▼]                     │           │
│ │ Status: [Active ▼]                                       │           │
│ │ [Clear Filters]                                          │           │
│ └──────────────────────────────────────────────────────────┘           │
├────────────────────────────────────────────────────────────────────────┤
│ Scenario  │ Topics       │ Date Created   │ Status   │ Actions         │
├────────────────────────────────────────────────────────────────────────┤
│ Coffee... │ Vocabulary   │ Jan 15, 2024   │ Active   │ [Edit] [Delete] │
│ Meeting   │ Grammar,...  │ Jan 10, 2024   │ Active   │ [Edit] [Delete] │
│ Doctor    │ Listening    │ Jan 8, 2024    │ Archived │ [Edit] [Delete] │
├────────────────────────────────────────────────────────────────────────┤
│ Rows per page: [10 ▼]   1 - 10 of 45                                   │
│ [< 1 2 3 ... >]                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## Displayed Information

### Header & Toolbar

- **Screen Title**: "Exercises"
- **Action Buttons**:
  - Create Exercise (primary button, icon + text)
  - Import Exercises (secondary button, icon + text)
- **Filter Toggle**: Hamburger or chevron icon to collapse/expand the filter panel

### Filter Panel

- **Scenario Filter**:
  - Label: "Scenario"
  - Input: Text field (placeholder: "Contain word...")
  - Behavior: Case-insensitive, partial match, 500ms debounce

- **Topics Filter**:
  - Label: "Topics"
  - Input: Multi-select dropdown
  - Behavior: Match any selected topic

- **Status Filter**:
  - Label: "Status"
  - Input: Single-select dropdown (options: Active, Archived, All)
  - Behavior: Single selection only

- **Clear Button**: Resets all filters to defaults

### Table Columns

| Column       | Data Type | Sortable | Notes                                        |
| ------------ | --------- | -------- | -------------------------------------------- |
| Scenario     | String    | Yes      | Exercise scenario or title                   |
| Topics       | Array     | No       | Comma-separated list of topics; not sortable |
| Date Created | Date      | Yes      | Format: MMM DD, YYYY                         |
| Status       | Enum      | Yes      | Active or Archived badge                     |
| Actions      | Buttons   | No       | Edit and Delete buttons for each row         |

### Pagination Controls

- **Rows Per Page Dropdown**: Default 10, options [5, 10, 25, 50]
- **Page Info**: "X - Y of Z" (e.g., "1 - 10 of 45")
- **Pagination Buttons**: Previous, page numbers, Next

### Empty State

- Display when no results match filters
- Message: "No exercises found. Try adjusting your filters or [Create a new exercise]."
- Link to create exercise

## User Interactions

### Filter Panel Interactions

- **Toggle Filters**: Click filter icon → expand/collapse filter panel
- **Scenario Text Input**:
  - Type characters → wait 500ms after last keystroke → fetch filtered data
  - Clear input → immediately refresh list

- **Topic Multi-Select**:
  - Click dropdown → show topic list with checkboxes
  - Select/deselect topics → immediately refresh list
  - Show count badge: "Topics (2)" when filters applied

- **Status Single-Select**:
  - Click dropdown → show status options
  - Select status → immediately refresh list

- **Clear Filters Button**:
  - Reset all filter inputs to defaults
  - Reset pagination to page 1
  - Refresh list with default filters

### Table Interactions

- **Sort Column Headers**:
  - Click a header that is not currently in the sort criteria → add it to the active sort criteria list
  - Click a header already in the sort criteria → cycle: ascending → descending → clear sort for that field
  - Multi-column sort: click another unsorted header to add it to the current sort criteria
  - Visual indicator (↑ ↓) shows sort direction only for fields included in the current sort criteria
  - Earlier selected columns have higher priority

- **Row Actions**:
  - Each row displays Edit and Delete buttons in the Actions column
  - Edit → navigate to edit exercise screen with pre-filled data
  - Delete → show confirmation dialog

### Pagination Interactions

- **Rows Per Page Dropdown**:
  - Select new value → immediately update page size
  - Remain on page 1 or adjust to valid page

- **Page Navigation**:
  - Click page number → fetch that page
  - Click Previous/Next → move one page
  - Disabled state when at first/last page

## Error Handling

### System Errors

- **Failed to Load Exercises**: "Failed to load exercises. Please try again."
- **Failed to Delete Exercise**: "Failed to delete exercise. Please try again."

## Dependencies & Integration

### APIs Required

- `GET /manage/exercises`: Fetch paginated, filtered, sorted exercise list
  - Query params: `page`, `pageSize`, `scenario`, `topics`, `status`, `sortBy`, `sortOrder`
  - Response: Paginated list of exercises + total count

- `GET /topics`: Fetch available topics for topic filter dropdown
  - Response: Array of topic objects

- `DELETE /manage/exercises/{id}`: Delete a single exercise
  - Authorization: User can only delete their own exercises

## Authentication & Authorization

- **Login Required**: Screen only accessible to authenticated users.
- **Permission Required**: Users can only view and manage their own exercises.

## Accessibility Requirements

- **WCAG 2.1 Level AA** compliance required
- **Keyboard Navigation**:
  - Tab through filters, buttons, and table rows
  - Enter/Space to activate buttons and expand dropdowns
  - Arrow keys to navigate dropdown options
  - Esc to close dropdowns and modals

- **Screen Reader Support**:
  - Sort indicators announced: "Ascending", "Descending"
  - Empty state announced clearly
  - Form labels associated with inputs via `<label for>`

- **Alt Text**: Icons have aria-labels or title attributes
- **Focus Indicators**: Visible focus ring on all interactive elements

## Performance Requirements

- **Expected Load Time**: < 2 seconds (initial page load + first exercise list)
- **Filter Response Time**: < 500ms (after debounce)
- **Table Render Time**: < 1 second (100 rows)
- **Caching**:
  - Cache topic list for 1 hour
  - Cache exercise list for 1 hour (invalidate on events from API service)

- **Optimization**:
  - Cancel in-flight requests when filters change
  - Debounce scenario text input (500ms)

## Security Considerations

- **HTTPS**: All API calls must use HTTPS
- **CSRF Protection**: Use CSRF tokens for state-changing operations (delete)
