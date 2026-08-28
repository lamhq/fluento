write a Feature Specification Document for the feature: "list exercises"

the feature "list exercises" is a part of the exercise management feature

## display

it should display a list of exercises created by the current user.

the list should display a table with the following columns: Scenario, Topics (comma-separated), Date Created, Status, Actions (Update, Delete).

## filtering

allow users to filter exercises by scenario (contain text), topics (dropdown multi-select, match any of selected options), status (dropdown, single select).

## sorting

allow users to sort exercises by Scenario (alphabetical), Date Created (newest to oldest, oldest to newest), Status.

## pagination

below the exercise list, provide pagination controls to navigate through the list of exercises.

The user should be able to select the number of exercises displayed per page (e.g., 10, 25, 50).

## searching

do not support free text search capability across multiple fields

## toolbar display

display buttons for:

- Create Exercise
- Import Exercises (from plain text file)
