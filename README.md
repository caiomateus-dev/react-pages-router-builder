# React Pages Router 🚀

**File-system based routing for React Router, inspired by Next.js App Router**

[![npm version](https://badge.fury.io/js/react-pages-router-builder.svg)](https://badge.fury.io/js/react-pages-router-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- ✅ **File-system routing** - Create routes based on your file structure
- ✅ **Nested layouts** - Automatic layout inheritance with `<Outlet />`
- ✅ **Dynamic routes** - Support for `[id]` and `[...slug]` parameters
- ✅ **Loading states** - Built-in loading states per route
- ✅ **Error boundaries** - Error handling for each route
- ✅ **404 pages** - Automatic not found pages
- ✅ **Layout groups** - Use `(group)` folders for shared layouts
- ✅ **Zero configuration** - Works out of the box
- ✅ **TypeScript support** - Full TypeScript support
- ✅ **Code splitting** - Automatic lazy loading

## 🚀 Quick Start

### Install the library

```bash
# npm
npm install react-pages-router-builder

# yarn
yarn add react-pages-router-builder

# pnpm
pnpm add react-pages-router-builder

# bun
bun add react-pages-router-builder
```

## ⚡ Quick Start

### 1. Create Router

```typescript
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "react-pages-router-builder";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
```

### 3. Create Pages

```
src/pages/
├── layout.tsx              # Root layout
├── page.tsx                # Home page (/)
├── products/
│   ├── layout.tsx          # Products layout
│   ├── page.tsx            # /products
│   ├── new/
│   │   └── page.tsx        # /products/new
│   └── [id]/
│       ├── page.tsx        # /products/123
│       └── edit/
│           └── page.tsx    # /products/123/edit
└── (admin)/                # Layout group
    ├── layout.tsx          # Admin layout
    └── dashboard/
        └── page.tsx        # /dashboard
```

## 🎯 Examples

### Basic Page

```tsx
// src/pages/products/page.tsx
export default function ProductsPage() {
  return (
    <div>
      <h1>Products List</h1>
      <p>This is the products page</p>
    </div>
  );
}
```

### Dynamic Route

```tsx
// src/pages/products/[id]/page.tsx
import { useParams } from "react-router";

export default function ProductPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Product {id}</h1>
      <p>Product details for {id}</p>
    </div>
  );
}
```

### Layout with Outlet

```tsx
// src/pages/layout.tsx
import { Outlet } from "react-router";
import { Suspense } from "react";

export default function RootLayout() {
  return (
    <div>
      <header>
        <h1>My Application</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/products">Products</a>
        </nav>
      </header>

      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet /> {/* Pages render here */}
        </Suspense>
      </main>

      <footer>
        <p>&copy; 2024 My Application</p>
      </footer>
    </div>
  );
}
```

## 📚 Documentation

- [User Guide](./docs/USER_GUIDE.md) - Complete usage guide
- [Technical Documentation](./docs/TECHNICAL.md) - Deep technical details

## 🛠️ CLI Commands

### Initialize Router Configuration

```bash
npx react-pages-router-builder init
```

This command will:

- Set up `src/pages/` with example files
- Configure `src/main.tsx` to use the router
- Install necessary dependencies

> **Note:** This command should be run inside an existing React project (created with Vite, CRA, etc.)

### Generate Routes

```bash
npx react-pages-router-builder route <path> [options]
```

**Examples:**

```bash
# Simple route
npx react-pages-router-builder route /users

# Route with dynamic parameter
npx react-pages-router-builder route /users/[id]

# Route with layout group
npx react-pages-router-builder route /admin --group

# Route with custom layout
npx react-pages-router-builder route /dashboard --layout

# Nested route
npx react-pages-router-builder route /products/[id]/edit
```

**Options:**

- `--group` - Create a route group (folder with parentheses)
- `--layout` - Create a layout.tsx file for this route
- `--help` - Show help message

**Route Patterns:**

- `/users` → `src/pages/users/page.tsx`
- `/users/[id]` → `src/pages/users/[id]/page.tsx`
- `/admin/users --group` → `src/pages/(admin)/users/page.tsx`
- `/dashboard --layout` → `src/pages/dashboard/layout.tsx + page.tsx`

## 🛠️ API Reference

### `router`

Pre-configured React Router instance from your file structure.

```typescript
import { router } from "react-pages-router-builder";

// Use directly with RouterProvider
<RouterProvider router={router} />;
```

## 🎨 File Conventions

| File          | Purpose        | Example         |
| ------------- | -------------- | --------------- |
| `page.tsx`    | Route page     | `/products`     |
| `layout.tsx`  | Shared layout  | Header/Footer   |
| `loading.tsx` | Loading state  | Loading spinner |
| `error.tsx`   | Error boundary | Error page      |
| `404.tsx`     | Not found page | 404 page        |

## 🔧 Advanced Usage

### Layout Groups

Use parentheses for layout groups that don't appear in the URL:

```
src/pages/
├── (admin)/              # Admin group (not in URL)
│   ├── layout.tsx        # Admin layout
│   ├── dashboard/
│   │   └── page.tsx      # /dashboard (not /admin/dashboard)
│   └── users/
│       └── page.tsx      # /users (not /admin/users)
└── (public)/             # Public group
    ├── layout.tsx        # Public layout
    └── about/
        └── page.tsx      # /about
```

### Dynamic Routes

```
src/pages/
├── products/
│   ├── [id]/
│   │   ├── page.tsx      # /products/123
│   │   └── [action]/
│   │       └── page.tsx  # /products/123/edit
│   └── [...slug]/
│       └── page.tsx      # /products/a/b/c (catch-all)
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Next.js App Router](https://nextjs.org/docs/app)
- Built on top of [React Router](https://reactrouter.com/)

---

**Made with ❤️ by the React Pages Router Builder community**
