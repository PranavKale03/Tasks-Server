# Bug Report — Task Manager API

This report documents the bugs identified in the initial version of the Task Manager API. All bugs listed below were caught through automated tests and have been fixed in the current submission.

## 1. Pagination Offset Error
- **Severity**: High
- **Location**: `src/services/taskService.js:12`
- **Expected Behavior**: When requesting `page=1`, the API should return items starting from index 0.
- **Actual Behavior**: The code used `const offset = page * limit`. For `page=1` and `limit=10`, it calculated an offset of 10, skipping the first 10 tasks entirely.
- **Discovery**: Identified via `getPaginated` unit tests where Task #1 was missing from page 1.

## 2. Fuzzy Status Filtering
- **Severity**: Medium
- **Location**: `src/services/taskService.js:9`
- **Expected Behavior**: Filtering by status should perform an exact match (e.g., `status === 'todo'`).
- **Actual Behavior**: Used `status.includes()`. A search for status `"o"` would incorrectly return both `todo` and `done` tasks.
- **Discovery**: Identified via filtering unit tests attempting to partial-match strings.

## 3. Priority Reset on Completion
- **Severity**: Low (UX/Logic)
- **Location**: `src/services/taskService.js:69`
- **Expected Behavior**: Marking a task as complete should only change its `status` and `completedAt` timestamp.
- **Actual Behavior**: The implementation explicitly reset `priority` to `'medium'`, losing the original priority data of the task.
- **Discovery**: Identified via `completeTask` logic review and verified with integration tests.

## 4. Documentation Discrepancy
- **Severity**: Informational
- **Location**: `README.md`
- **Expected Behavior**: Documentation should list the correct valid status values.
- **Actual Behavior**: `README.md` listed `pending/in-progress/completed`, but both the code and `ASSIGNMENT.md` used `todo/in_progress/done`.
- **Discovery**: Comparison between `README.md` and `src/utils/validators.js`.

---
*All logic bugs (1, 2, 3) have been fixed in this version.*
