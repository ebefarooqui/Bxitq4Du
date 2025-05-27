# 🧵 Reddit-Style Nested Comment System

This is a [Next.js](https://nextjs.org/) app built with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), showcasing a **local-first, nested comment thread** with RxDB persistence and a polished UI built with [shadcn/ui](https://ui.shadcn.com/).

---

## ✨ Features

- ✅ Add and delete comments  
- ✅ Nested replies with toggleable visibility  
- ✅ Persistent local storage via **RxDB**  
- ✅ Sync across browser tabs  
- ✅ Fully accessible UI with shadcn/ui  
- ✅ Smooth animations via Framer Motion  
- ✅ Unit tests for core logic and UI  

---

## 🚀 Getting Started

Make sure you're using **Node.js v20+**. You can check your version with:

```bash
node -v
```

Then install dependencies and start the dev server:
```bash
npm install
npm run dev
```

Visit http://localhost:3000 to use the app.

## 🗂️ Project Structure

```bash
/src
  /app              # Next.js App Router (layout, pages)
  /components       # UI components (CommentNode, CommentForm, etc.)
  /lib              # RxDB setup, schema, and hooks (useComments.ts)
    /__tests__        # Unit and integration tests
```

## 🧠 Technical Overview
Framework: Next.js App Router (v13+)

State Management: React state + RxDB subscriptions

Persistence: RxDB (localstorage adapter)

UI: Tailwind CSS + shadcn/ui

Animations: Framer Motion

Testing: @testing-library/react, jest, ts-jest

## 🧪 Running Tests

To run the test suite:

```bash
npm test
```

## 🧱 RxDB Notes
This app uses RxDB for local-first persistence with the storage-localstorage plugin. During development, schema validation is enabled via the dev-mode plugin. In tests, RxDB is mocked or avoided using minimal stubs to isolate logic and avoid browser API dependencies.

## 📝 Future Improvements
 Support editing comments

 Auth integration for user-specific comments

 Optimistic UI for replies

 Better error reporting UX

 Pagination for large comment trees
