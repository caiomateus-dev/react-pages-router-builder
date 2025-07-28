#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const PKG_MANAGERS = {
  npm: "npm",
  yarn: "yarn",
  pnpm: "pnpm",
  bun: "bun",
} as const;

type PackageManager = keyof typeof PKG_MANAGERS;

function detectPackageManager(): PackageManager {
  if (fs.existsSync("bun.lockb")) return "bun";
  if (fs.existsSync("pnpm-lock.yaml")) return "pnpm";
  if (fs.existsSync("yarn.lock")) return "yarn";
  return "npm";
}

function execCommand(command: string, cwd: string = process.cwd()) {
  try {
    execSync(command, { cwd, stdio: "inherit" });
    return true;
  } catch (error) {
    console.error(`Error executing: ${command}`);
    return false;
  }
}

function createFile(filePath: string, content: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
}

function updateFile(filePath: string, content: string) {
  fs.writeFileSync(filePath, content);
  console.log(`Updated: ${filePath}`);
}

function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

function createViteConfig() {
  const viteConfigPath = "vite.config.ts";

  if (fileExists(viteConfigPath)) {
    console.log("Vite config already exists, skipping...");
    return;
  } else {
    // Create new config
    const content = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()
  ]
})
`;
    createFile(viteConfigPath, content);
  }
}

function createMainTsx() {
  const content = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from 'react-pages-router-builder'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
`;
  createFile("src/main.tsx", content);
}

function createLayoutTsx() {
  const content = `import { Suspense } from 'react'
import { Outlet } from 'react-router'

export default function RootLayout() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ 
        backgroundColor: '#1f2937', 
        color: 'white', 
        padding: '1rem',
        marginBottom: '1rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>RRGenius App</h1>
        <nav style={{ marginTop: '0.5rem' }}>
          <a href="/" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Home</a>
          <a href="/example" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Example</a>
        </nav>
      </header>
      
      <main style={{ padding: '1rem' }}>
        <Suspense>
          <Outlet />
        </Suspense>
      </main>
      
      <footer style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '1rem', 
        textAlign: 'center', 
        color: '#6b7280',
        marginTop: '2rem'
      }}>
        <p style={{ margin: 0 }}>&copy; 2024 RRGenius App</p>
      </footer>
    </div>
  )
}
`;
  createFile("src/pages/layout.tsx", content);
}

function createPageTsx() {
  const content = `export default function HomePage() {
  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Welcome to RRGenius!
      </h1>
      
      <div style={{ 
        backgroundColor: '#eff6ff', 
        border: '1px solid #bfdbfe', 
        borderRadius: '0.5rem', 
        padding: '1.5rem', 
        marginBottom: '1.5rem' 
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Getting Started</h2>
        <p style={{ marginBottom: '1rem' }}>
          This is your home page. RRGenius has automatically set up file-system routing for you!
        </p>
        <ul style={{ listStyle: 'disc inside', margin: 0, padding: 0 }}>
          <li style={{ marginBottom: '0.5rem' }}>Create page.tsx files to add new routes</li>
          <li style={{ marginBottom: '0.5rem' }}>Use layout.tsx for shared layouts</li>
          <li style={{ marginBottom: '0.5rem' }}>Add [id] folders for dynamic routes</li>
          <li style={{ marginBottom: '0.5rem' }}>Use (group) folders for layout groups</li>
        </ul>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ 
          backgroundColor: '#f0fdf4', 
          border: '1px solid #bbf7d0', 
          borderRadius: '0.5rem', 
          padding: '1.5rem' 
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Features</h3>
          <ul style={{ margin: 0, padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>File-system routing</li>
            <li style={{ marginBottom: '0.5rem' }}>Nested layouts</li>
            <li style={{ marginBottom: '0.5rem' }}>Dynamic routes</li>
            <li style={{ marginBottom: '0.5rem' }}>Loading states</li>
            <li style={{ marginBottom: '0.5rem' }}>Error boundaries</li>
          </ul>
        </div>
        
        <div style={{ 
          backgroundColor: '#faf5ff', 
          border: '1px solid #ddd6fe', 
          borderRadius: '0.5rem', 
          padding: '1.5rem' 
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Next Steps</h3>
          <ul style={{ margin: 0, padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>Explore src/pages/</li>
            <li style={{ marginBottom: '0.5rem' }}>Check out /example</li>
            <li style={{ marginBottom: '0.5rem' }}>Read the documentation</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
`;
  createFile("src/pages/page.tsx", content);
}

function createExamplePage() {
  const content = `export default function ExamplePage() {
  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Example Page</h1>
      
      <div style={{ 
        backgroundColor: '#fefce8', 
        border: '1px solid #fde047', 
        borderRadius: '0.5rem', 
        padding: '1.5rem', 
        marginBottom: '1.5rem' 
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>This is an example route!</h2>
        <p>
          This page demonstrates how easy it is to create new routes with RRGenius.
          Just create a page.tsx file in any folder under src/pages/.
        </p>
      </div>
      
      <div style={{ 
        backgroundColor: '#f9fafb', 
        border: '1px solid #d1d5db', 
        borderRadius: '0.5rem', 
        padding: '1.5rem' 
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>File Structure</h3>
        <pre style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '1rem', 
          borderRadius: '0.25rem', 
          fontSize: '0.875rem', 
          overflowX: 'auto',
          margin: 0
        }}>
{'src/pages/\\n├── layout.tsx          # Root layout\\n├── page.tsx            # Home page (/)\\n├── 404.tsx             # Not found page\\n├── loading.tsx         # Loading state\\n├── error.tsx           # Error boundary\\n└── example/\\n    └── page.tsx        # This page (/example)'}
        </pre>
      </div>
    </div>
  )
}
`;
  createFile("src/pages/example/page.tsx", content);
}

function create404Page() {
  const content = `import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', textAlign: 'center', padding: '3rem 1rem' }}>
      <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: '#d1d5db', margin: '0 0 1rem 0' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link 
        to="/" 
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          display: 'inline-block'
        }}
      >
        Go Home
      </Link>
    </div>
  )
}
`;
  createFile("src/pages/404.tsx", content);
}

function createLoadingPage() {
  const content = `export default function LoadingPage() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '2px solid #e5e7eb',
          borderTop: '2px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem auto'
        }}></div>
        <p style={{ color: '#6b7280', margin: 0 }}>Loading...</p>
      </div>

    </div>
  )
}
`;
  createFile("src/pages/loading.tsx", content);
}

function createErrorPage() {
  const content = `import { useRouteError } from 'react-router'

export default function ErrorPage() {
  const error = useRouteError() as Error

  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', textAlign: 'center', padding: '3rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '1rem' }}>Oops!</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Something went wrong</h2>
      <div style={{ 
        backgroundColor: '#fef2f2', 
        border: '1px solid #fecaca', 
        borderRadius: '0.5rem', 
        padding: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <p style={{ color: '#991b1b', marginBottom: '0.5rem' }}>
          <strong>Error:</strong> {error?.message || 'An unexpected error occurred'}
        </p>
        {error?.stack && (
          <details style={{ textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', color: '#dc2626' }}>
              Show stack trace
            </summary>
            <pre style={{ 
              marginTop: '0.5rem', 
              fontSize: '0.875rem', 
              color: '#b91c1c', 
              backgroundColor: '#fee2e2', 
              padding: '1rem', 
              borderRadius: '0.25rem', 
              overflowX: 'auto',
              margin: 0
            }}>
              {error.stack}
            </pre>
          </details>
        )}
      </div>
      <button 
        onClick={() => window.location.reload()} 
        style={{
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Try Again
      </button>
    </div>
  )
}
`;
  createFile("src/pages/error.tsx", content);
}

// Route generator functions
function createRoutePage(routePath: string, componentName: string) {
  const content = `export default function ${componentName}() {
  return (
    <div>
      <h1>${componentName}</h1>
      <p>This is the ${routePath} page.</p>
    </div>
  )
}
`;
  return content;
}

function createRouteLayout(routePath: string, componentName: string) {
  const content = `import { Suspense } from 'react'
import { Outlet } from 'react-router'

export default function ${componentName}() {
  return (
    <div>
      <header>
        <h2>${componentName} Layout</h2>
      </header>
      <main>
        <Suspense>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
`;
  return content;
}

function generateRouteStructure(
  routePath: string,
  options: {
    group?: boolean;
    layout?: boolean;
    params?: string[];
  }
) {
  const segments = routePath.split("/").filter(Boolean);
  const pagesDir = "src/pages";
  let currentPath = pagesDir;

  // Create group folder if needed
  if (options.group && segments.length > 0) {
    const groupName = segments[0];
    const groupPath = path.join(currentPath, `(${groupName})`);
    if (!fs.existsSync(groupPath)) {
      fs.mkdirSync(groupPath, { recursive: true });
      console.log(`Created group folder: ${groupPath}`);
    }
    currentPath = groupPath;
    segments.shift(); // Remove the group segment
  }

  // Create nested folders and files
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const isLast = i === segments.length - 1;
    const isParam = segment.startsWith("[") && segment.endsWith("]");

    // Create folder for this segment
    const segmentPath = path.join(currentPath, segment);
    if (!fs.existsSync(segmentPath)) {
      fs.mkdirSync(segmentPath, { recursive: true });
      console.log(`Created folder: ${segmentPath}`);
    }

    // Create layout if requested
    if (options.layout) {
      const layoutName =
        segment.charAt(0).toUpperCase() +
        segment.slice(1).replace(/[\[\]]/g, "") +
        "Layout";
      const layoutContent = createRouteLayout(routePath, layoutName);
      const layoutPath = path.join(segmentPath, "layout.tsx");
      createFile(layoutPath, layoutContent);
    }

    // Create page.tsx for the last segment
    if (isLast) {
      let componentName =
        segment.charAt(0).toUpperCase() +
        segment.slice(1).replace(/[\[\]]/g, "") +
        "Page";
      // Handle parameter segments better
      if (isParam) {
        const paramName = segment.slice(1, -1); // Remove [ and ]
        componentName =
          paramName.charAt(0).toUpperCase() + paramName.slice(1) + "Page";
      }
      const pageContent = createRoutePage(routePath, componentName);
      const pagePath = path.join(segmentPath, "page.tsx");
      createFile(pagePath, pageContent);
    }

    currentPath = segmentPath;
  }
}

function showRouteHelp() {
  console.log(`
React Pages Router Builder - Route Generator

Usage:
  npx react-pages-router-builder route <path> [options]

Examples:
  npx react-pages-router-builder route /users                    # Simple route
  npx react-pages-router-builder route /users/[id]               # Route with parameter
  npx react-pages-router-builder route /admin --group            # Route with group
  npx react-pages-router-builder route /dashboard --layout       # Route with layout
  npx react-pages-router-builder route /products/[id]/edit       # Nested route

Options:
  --group    Create a route group (folder with parentheses)
  --layout   Create a layout.tsx file for this route
  --help     Show this help message

Route Patterns:
  /users              → src/pages/users/page.tsx
  /users/[id]         → src/pages/users/[id]/page.tsx
  /admin/users --group → src/pages/(admin)/users/page.tsx
  /dashboard --layout → src/pages/dashboard/layout.tsx + page.tsx
`);
}

function updatePackageJson() {
  const pkgPath = "package.json";
  if (!fileExists(pkgPath)) {
    console.log(
      "package.json not found. Please run this command in a Node.js project."
    );
    process.exit(1);
  }

  const pkg = JSON.parse(readFile(pkgPath));

  // Add react-pages-router-builder dependency
  pkg.dependencies = pkg.dependencies || {};
  pkg.dependencies["react-pages-router-builder"] = "^1.0.0";

  // Add react-router if not present
  if (!pkg.dependencies["react-router"]) {
    pkg.dependencies["react-router"] = "^6.0.0";
  }

  // Add react-dom if not present
  if (!pkg.dependencies["react-dom"]) {
    pkg.dependencies["react-dom"] = "^18.0.0";
  }

  updateFile(pkgPath, JSON.stringify(pkg, null, 2));
}

function installDependencies(pkgManager: PackageManager) {
  console.log("Installing dependencies with " + pkgManager + "...");

  const installCommand =
    pkgManager === "npm"
      ? "npm install"
      : pkgManager === "yarn"
      ? "yarn install"
      : pkgManager === "pnpm"
      ? "pnpm install"
      : "bun install";

  if (!execCommand(installCommand)) {
    console.log("Failed to install dependencies. Please install manually:");
    console.log("   " + installCommand);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "route") {
    const routePath = args[1];

    if (!routePath || args.includes("--help")) {
      showRouteHelp();
      return;
    }

    if (!routePath.startsWith("/")) {
      console.log("Error: Route path must start with /");
      console.log("Example: npx react-pages-router-builder route /users");
      return;
    }

    const options = {
      group: args.includes("--group"),
      layout: args.includes("--layout"),
    };

    console.log("Creating route: " + routePath);
    generateRouteStructure(routePath, options);
    console.log("Route created successfully!");
  } else if (command === "init" || !command) {
    console.log(
      "React Pages Router Builder - File-system routing for React Router"
    );
    console.log("");

    const pkgManager = detectPackageManager();
    console.log("Detected package manager: " + pkgManager);
    console.log("");

    // Update package.json
    console.log("Updating package.json...");
    updatePackageJson();

    // Create vite.config.ts
    console.log("Creating vite.config.ts...");
    createViteConfig();

    // Create main.tsx
    console.log("Creating src/main.tsx...");
    createMainTsx();

    // Create pages structure
    console.log("Creating pages structure...");
    createLayoutTsx();
    createPageTsx();
    createExamplePage();
    create404Page();
    createLoadingPage();
    createErrorPage();

    console.log("");
    console.log("React Pages Router Builder setup complete!");
    console.log("");
    console.log("Installing dependencies...");
    installDependencies(pkgManager);

    console.log("");
    console.log("Your React Pages Router Builder project is ready!");
    console.log("");
    console.log("Next steps:");
    console.log("   1. Start the dev server: npm run dev");
    console.log("   2. Open http://localhost:5173");
    console.log("   3. Explore src/pages/ to see the file structure");
    console.log("   4. Create new routes by adding page.tsx files");
    console.log("");
    console.log("Route Generator:");
    console.log("   npx react-pages-router-builder route /users");
    console.log("   npx react-pages-router-builder route /users/[id]");
    console.log("   npx react-pages-router-builder route /admin --group");
    console.log("");
    console.log(
      "Documentation: https://github.com/caiomateus-dev/react-pages-router-builder"
    );
  } else {
    console.log("Unknown command: " + command);
    console.log("Available commands:");
    console.log(
      "  npx react-pages-router-builder init     - Initialize router configuration"
    );
    console.log("  npx react-pages-router-builder route    - Generate routes");
    console.log("  npx react-pages-router-builder --help   - Show help");
  }
}

main();
