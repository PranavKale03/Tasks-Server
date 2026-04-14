# Submission Notes — The Untested API

## Implementation Summary
- **Tests**: Reached **88.6%** code coverage with Jest and Supertest.
- **Bug Fixes**: Addressed pagination offset, status filtering logic, and priority preservation.
- **New Feature**: Implemented `PATCH /tasks/:id/assign` with validation (non-empty string check).

## Design Decisions for `PATCH /tasks/:id/assign`
- **Validation**: Chose to enforce non-empty strings for assignees to ensure data quality.
- **Return Type**: Returns the full updated task object to minimize follow-up GET requests.
- **HTTP 404**: Correctly returns 404 if the task ID is invalid.

## Reflection

### What I'd test next if I had more time
- **Concurrent Requests**: Since the store is in-memory and shared, I'd test for race conditions if multiple requests update the same task simultaneously.
- **Large Dataset Performance**: Test how the filter and pagination logic scales with thousands of in-memory tasks.
- **Boundary Dates**: More rigorous testing on `overdue` logic around midnight and different time zones.

### Anything that surprised you in the codebase
- I was surprised to find that `completeTask` specifically reset the priority to `medium`. This was a subtle bug that might have been intentional in a different context but felt like a regression in a general Task API.
- The use of `Array.includes` for status filtering was a significant logic error that could lead to many false positives.

### Questions I'd ask before shipping this to production
1. **Persistence Strategy**: "When do we move from in-memory to a real database, and which one (SQL vs NoSQL) is preferred for our scale?"
2. **Assignee Data**: "Should the `assignee` be a simple string, or should we link it to a `User` entity with its own ID?"
3. **Audit Logs**: "Do we need to track *who* changed a task's status or assignee for auditing purposes?"
4. **Rate Limiting**: "Since this is a public-facing API, should we implement rate limiting to protect the in-memory store from DoS attacks?"
