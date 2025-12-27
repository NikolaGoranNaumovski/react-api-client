# React API Client Hooks

A lightweight React utility package that provides:
- A configurable `ApiClient` built on top of `fetch`
- A React context provider for dependency injection
- Reusable React hooks for common API patterns (`GET`, mutations, and deletes)

This package is designed to centralize API logic, reduce boilerplate, and provide consistent loading and error handling across your app.

---

## Features

- 🌐 Centralized API client with a base URL
- 🔐 Automatic credential handling (`credentials: include`)
- 🔁 Automatic retry on `401` responses
- 🧵 Trace headers (`traceparent`) for request tracking
- ⚛️ Simple, composable React hooks
- 📦 Supports JSON and `FormData`
- 🔄 Manual and automatic refetching options

---

## Installation

```bash
npm install @nnaumovski/react-api-client
# or
yarn add @nnaumovski/react-api-client
```