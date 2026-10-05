# Exercise List Screen

## Introduction

- **Purpose**: Let users find and manage their own exercises from a paginated list.
- **Context**: The screen is the entry point for creating, importing, updating, and deleting exercises.
- **Key Goals**:
  - Show each exercise's name, skill, topics, creation date, and status.
  - Help users find exercises with backend-driven filters and sorting.
  - Provide access to exercise creation, import, update, and delete flows.

## Screen Layout

```text
+-------------------------------------------------------------------+
| My Exercises                                                      |
| [Create] [Import]                                                 |
+-------------------------------------------------------------------+
| Name:     [________________]  Topics: [Select topics ▾]          |
| Skill:    [Select skills ▾]   Format: [Select formats ▾]         |
| Status:   [Select statuses ▾]                         [Reset]    |
+----------------------------------------------------------------------------------------------------------+
| Name             | Skill        | Topics       | Date Created | Status   | Actions                    |
| Coffee shop      | Speaking     | Conversation | 2026-08-10   | Active   | Update                     |
| Meeting practice | Listening    | Work         | 2026-08-08   | Archived | Delete                     |
+----------------------------------------------------------------------------------------------------------+
| Page 1 of 3 (30)  Rows per page: [10 ▾]  [First] [Previous] [1] [2] [3] [Next] [Last] |
+-------------------------------------------------------------------+
```

- Use a mobile-first layout with smaller padding, margins, and text sizes on mobile than on desktop.
- Keep filters, list information, and row actions usable at mobile and desktop widths.

## Components

### Header and Toolbar

- Screen title: "My Exercises".
- Create button opens the create-exercise flow.
- Import button opens the import-exercises flow.

### Filters

- Name: text input for case-insensitive contains matching by name.
- Topics: multi-select options loaded from the topics API.
- Skills: multi-select using fixed application values.
- Formats: multi-select using fixed application values.
- Status: multi-select.
- Reset clears all filters and immediately refreshes the list.
- Filter selections are not retained after reload or navigation.

### Exercise Table

| Column       | Display                   |
| ------------ | ------------------------- |
| Name         | Exercise name             |
| Skill        | Exercise skill            |
| Topics       | Exercise topics           |
| Date Created | Exercise creation date    |
| Status       | Exercise status           |
| Actions      | Update and Delete actions |

### Sorting

- Name and status columns can be sorted.
- Multiple sort columns are supported; earlier selections have higher priority.
- Show sort direction on each active sort column.

### Pagination

- Provide page index and page-size controls. Page-size options are 10, 20, 30, 40, and 50 rows.
- Show the current page number and total page count.
- Provide first, previous, numbered-page, next, and last controls. Hide first and last controls on narrow screens.

### Empty State

- Show when no exercises match the current filters.
- Explain that no results were found and offer a way to create an exercise.

## Interactions & Behavior

### Filtering

- Changing any filter immediately requests updated results from the backend.
- Multiple selected topics, skills, formats, or statuses match with OR logic within that filter.
- Different filters combine with AND logic.
- Name matching is case-insensitive and contains the entered text.
- Reset clears every filter and immediately requests results without filters.

### Sorting

- Changing the sort order immediately requests updated results from the backend.
- When multiple columns are sorted, preserve their selection priority.

### Row Actions

- Update opens the update-exercise flow for the selected exercise.
- Delete opens the delete-exercise flow for the selected exercise.

### Pagination

- Changing page index or page size immediately requests the corresponding results from the backend.
- Cancel any in-flight list request when filters, sorting, page size, or page index change.

### Loading States

- Show a loading state while the initial list or refreshed results are being fetched.

### Error Handling

- If loading fails, show an error message and a way to retry.
- If no results match, show the empty state rather than an error.

## Technical & Integration Requirements

### API and Data Requirements

- "Find Exercises API" that applies user scoping, filtering, sorting, and pagination on the backend.
- "Find Topics API" for topic filter options.
- Create, import, update, and delete exercise flows.

### Authentication & Authorization

- Require authentication to access the screen.
- Only show the authenticated user's exercises; user scoping must be enforced by the backend for every list query, independent of filters, sorting, or pagination.

### Accessibility

- Provide visible labels and accessible names for filters, buttons, sort controls, and pagination.
- Support keyboard navigation for all interactive controls.
- Announce loading, errors, empty results, and active sort direction to assistive technologies.
- Ensure text, controls, and focus indicators meet WCAG 2.1 AA contrast requirements.
