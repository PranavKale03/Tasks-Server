# Take-Home Assignment — The Untested API (Final Submission)

This is the completed version of the Task Manager API assignment. It includes comprehensive test coverage, bug fixes, and the requested "Assign" feature.

---

## 🚀 Quick Start

**Prerequisites:** Node.js 18+

```bash
cd task-api
npm install
npm start        # runs on http://localhost:3000
```

---

## 🧪 Testing & Coverage

The project maintains high standards of testing with **88.6% code coverage**.

```bash
cd task-api
npm test           # run test suite
npm run coverage   # run with coverage report
```

### Coverage Summary
- **Statements**: 88.6%
- **Branches**: 75%
- **Functions**: 90.3%
- **Lines**: 89.4%

---

## 🛠 Features & Fixes

### Bug Fixes
- **Pagination Offset**: Corrected formula to `(page - 1) * limit` to prevent skipping tasks.
- **Status Filtering**: Changed from partial string match (`includes`) to exact match.
- **Priority Preservation**: Fixed `completeTask` logic to stop resetting priority to 'medium'.

### New Endpoint: `PATCH /tasks/:id/assign`
- **Validation**: Ensures `assignee` is a non-empty string.
- **Functionality**: Updates the task with the assignee's name and returns the updated task.
- **Error Handling**: Returns `404` for invalid IDs and `400` for validation errors.

---

## 🌐 Deployment (Live Link)

This API can be easily deployed to **Vercel** or **Render**.

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` from the `task-api` directory.
3. Follow the prompts to deploy.

### Deploy to Render
1. Connect your GitHub repository to Render.
2. Create a new **Web Service**.
3. Set **Root Directory** to `task-api`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.

---

## 📂 Project Overview

- **`BUG_REPORT.md`**: Detailed list of identified and fixed bugs.
- **`SUBMISSION.md`**: Reflection on design decisions and future improvements.
- **`SUBMISSION_EMAIL.md`**: Draft email ready for submission.

---
*Submitted by Pranav Kale*
