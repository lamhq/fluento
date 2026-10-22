# Create Exercise Dialog

## Introduction

- **Purpose**: Create an exercise without leaving Exercise List.
- **Context**: Opens when user clicks **Create** on Exercise List.
- **Key Goals**:
  - Let users select a format.
  - Show only fields for selected format.
  - Make required fields and errors clear.

## Dialog Layout

```text
+--------------------------------------------------------------------+
| Create Exercise                                                [X]  |
|                                                                    |
| Format *                                                           |
| [Select a format                                              v]   |
|                                                                    |
| Exercise content                                                   |
| Select a format to show required content fields.                   |
|                                                                    |
| Topics *                                                           |
| [Select or add topics                                        v]    |
|                                                                    |
| References                                                         |
| [Enter one reference per line                               ]      |
|                                                                    |
| Status                                                             |
| [Active                                                       v]   |
|                                                                    |
|                                      [Cancel] [Create Exercise]    |
+--------------------------------------------------------------------+
```

- Center a width-constrained modal on desktop.
- On narrow screens, use a full-width dialog, stacked fields, and scrollable content.
- Keep title and actions visible while content scrolls.
- Mark required fields with `*` and show a required-fields note.
- Default Status to `active`.

## Components

### Dialog Header

- Title: **Create Exercise**.
- Close button dismisses dialog.
- Dim Exercise List behind the dialog.

### Common Fields

| Field      | Control                | Behavior                                                           |
| ---------- | ---------------------- | ------------------------------------------------------------------ |
| Format     | Select                 | Required; choose any supported format.                             |
| Topics     | Creatable multi-select | Required; select existing options or add new values, at least one. |
| References | Textarea               | Optional; one reference per line.                                  |
| Status     | Select                 | Required: Active or Archived; default Active.                      |

### Format-specific fields

Use the [core data specification](../../../core/spec/data.md#exercise-format) as the source of truth for available formats and [format-specific fields](../../../core/spec/data.md#format-specific-fields), including requiredness. Show only fields available for the selected format. Use one-value-per-line textareas for arrays; each required list needs one non-empty line.

Before a format is selected, show: “Select a format to show the required content fields.”

## Interactions and Behavior

### Opening and Dismissing

- **Create** on Exercise List opens dialog.
- Move focus into dialog on open; return it to **Create** on close.
- Trap keyboard focus within dialog.
- Close button, **Cancel**, and Escape dismiss it.
- Confirm before discarding entered values.
- Dismissing without saving leaves Exercise List unchanged.

### Selecting a Format

- Show all supported formats in the Format selector.
- Changing Format clears values for the previous format.
- Keep Topics and References when Format changes.

### Topics

- Load topic options from the Get Topics API when dialog opens; show loading state.
- If loading fails, show an inline message and allow manual additions.
- If no topics exist, show an empty hint and allow manual additions; require at least one before saving.
- Keep selected existing and manually added values.
- Show available topic names without duplicate labels.
- Display manually added names in the selected topics list.

### Validation

- Validate Format, at least one Topic, and selected format's required fields.
- Treat whitespace-only values as empty.
- Show errors beside invalid fields and focus first invalid field.
- Clear each error when its field becomes valid.
- Block submission until required fields pass validation.

### Save

- Primary action: **Create Exercise**.
- While saving, prevent duplicates, disable form actions, and show **Creating…**.
- On success, close dialog, confirm creation, and refresh Exercise List.
- On validation, API, or network error, keep dialog open and values intact; explain issue and allow retry.

## Responsive Behavior

- Stack fields on narrow screens.
- On wide screens, Format and Topics may share rows if readable.
- Keep all fields and actions reachable without horizontal scrolling.
- Keep actions distinct and reachable at the bottom.

## Accessibility

- Use a modal dialog named by its title.
- Give every field a visible label; expose required state and errors programmatically.
- Support keyboard use for selects, multi-selects, textareas, and actions.
- Announce loading, saving, validation errors, and results.
- Name close and topic-creation controls accessibly.
- Meet WCAG 2.1 AA contrast for text, controls, errors, and focus indicators.

## Related Documents

- [Exercise List Screen](./exercise-list.md)
- [Create Exercise Feature Specification](../../spec/create-exercise.md)
- [Find Topics API](../api/find-topics.md)
- [Core Exercise Data Specification](../../../core/spec/data.md)
