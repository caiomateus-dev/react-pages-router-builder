# React Pages Router - User Guide

## 🚀 Introduction

React Pages Router is a file-system based routing system for React Router, inspired by Next.js App Router. It allows you to create routes automatically based on folder structure, with support for nested layouts, dynamic routes, and much more.

---

# React Pages Router - Guia do Usuário

## 🚀 Introdução

O React Pages Router é um sistema de roteamento baseado em arquivos para React Router, inspirado no Next.js App Router. Ele permite criar rotas automaticamente baseadas na estrutura de pastas, com suporte a layouts aninhados, rotas dinâmicas e muito mais.

## 📦 Installation

### 1. Create a React project (if you don't have one)

```bash
# With Vite (recommended)
npm create vite@latest my-app -- --template react-ts
cd my-app

# Or with Create React App
npx create-react-app my-app --template typescript
cd my-app
```

### 2. Install react-pages-router-builder

```bash
npm install react-pages-router-builder
# or
yarn add react-pages-router-builder
# or
pnpm add react-pages-router-builder
# or
bun add react-pages-router-builder
```

### 3. Initialize the router structure (inside your React project folder)

```bash
npx react-pages-router-builder init
```

> The `init` command only creates the pages/layouts structure. It does NOT create a React project from scratch.

### 4. Configure the entry point

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

---

## 📦 Instalação

### 1. Crie um projeto React (se ainda não tiver)

```bash
# Com Vite (recomendado)
npm create vite@latest my-app -- --template react-ts
cd my-app

# Ou com Create React App
npx create-react-app my-app --template typescript
cd my-app
```

### 2. Instale o react-pages-router-builder

```bash
npm install react-pages-router-builder
# ou
yarn add react-pages-router-builder
# ou
pnpm add react-pages-router-builder
# ou
bun add react-pages-router-builder
```

### 3. Inicialize a estrutura do roteador (dentro da pasta do seu projeto React)

```bash
npx react-pages-router-builder init
```

> O comando `init` apenas cria a estrutura de páginas/layouts. Ele NÃO cria um projeto React do zero.

### 4. Configure o ponto de entrada

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

## 📁 File Structure

### Naming Conventions

| File          | Purpose        | Example         |
| ------------- | -------------- | --------------- |
| `page.tsx`    | Route page     | `/products`     |
| `layout.tsx`  | Shared layout  | Header/Footer   |
| `loading.tsx` | Loading state  | Loading spinner |
| `error.tsx`   | Error page     | Error boundary  |
| `404.tsx`     | Not found page | Not found       |

### Basic Structure

```
src/pages/
├── layout.tsx              # Root layout (applies to all pages)
├── page.tsx                # Home page (/)
├── products/
│   ├── page.tsx            # /products
│   ├── new/
│   │   └── page.tsx        # /products/new
│   └── [id]/
│       ├── page.tsx        # /products/123
│       └── edit/
│           └── page.tsx    # /products/123/edit
└── users/
    └── [id]/
        └── page.tsx        # /users/456
```

---

## 📁 Estrutura de Arquivos

### Convenções de Nomenclatura

| Arquivo       | Propósito              | Exemplo         |
| ------------- | ---------------------- | --------------- |
| `page.tsx`    | Página da rota         | `/produtos`     |
| `layout.tsx`  | Layout compartilhado   | Header/Footer   |
| `loading.tsx` | Estado de carregamento | Loading spinner |
| `error.tsx`   | Página de erro         | Error boundary  |
| `404.tsx`     | Página não encontrada  | Not found       |

### Estrutura Básica

```
src/pages/
├── layout.tsx              # Layout raiz (aplica a todas as páginas)
├── page.tsx                # Página inicial (/)
├── produtos/
│   ├── page.tsx            # /produtos
│   ├── novo/
│   │   └── page.tsx        # /produtos/novo
│   └── [id]/
│       ├── page.tsx        # /produtos/123
│       └── editar/
│           └── page.tsx    # /produtos/123/editar
└── usuarios/
    └── [id]/
        └── page.tsx        # /usuarios/456
```

## 🎨 Creating Pages

### Simple Page

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

### Page with Dynamic Parameters

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

---

## 🎨 Criando Páginas

### Página Simples

```tsx
// src/pages/produtos/page.tsx
export default function ProdutosPage() {
  return (
    <div>
      <h1>Lista de Produtos</h1>
      <p>Esta é a página de produtos</p>
    </div>
  );
}
```

### Página com Parâmetros Dinâmicos

```tsx
// src/pages/produtos/[id]/page.tsx
import { useParams } from "react-router";

export default function ProdutoPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Produto {id}</h1>
      <p>Detalhes do produto {id}</p>
    </div>
  );
}
```

## 🏗️ Creating Layouts

### Root Layout

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
          <a href="/users">Users</a>
        </nav>
      </header>

      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet /> {/* This is where pages are rendered */}
        </Suspense>
      </main>

      <footer>
        <p>&copy; 2024 My Application</p>
      </footer>
    </div>
  );
}
```

### Specific Layout

```tsx
// src/pages/products/layout.tsx
import { Outlet } from "react-router";
import { Suspense } from "react";

export default function ProductsLayout() {
  return (
    <div>
      <h2>Products Section</h2>
      <nav>
        <a href="/products">List</a>
        <a href="/products/new">New Product</a>
      </nav>

      <div className="products-content">
        <Suspense fallback={<div>Loading products...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
```

---

## 🏗️ Criando Layouts

### Layout Raiz

```tsx
// src/pages/layout.tsx
import { Outlet } from "react-router";
import { Suspense } from "react";

export default function RootLayout() {
  return (
    <div>
      <header>
        <h1>Minha Aplicação</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/produtos">Produtos</a>
          <a href="/usuarios">Usuários</a>
        </nav>
      </header>

      <main>
        <Suspense fallback={<div>Carregando...</div>}>
          <Outlet /> {/* Aqui é onde as páginas são renderizadas */}
        </Suspense>
      </main>

      <footer>
        <p>&copy; 2024 Minha Aplicação</p>
      </footer>
    </div>
  );
}
```

### Layout Específico

```tsx
// src/pages/produtos/layout.tsx
import { Outlet } from "react-router";
import { Suspense } from "react";

export default function ProdutosLayout() {
  return (
    <div>
      <h2>Seção de Produtos</h2>
      <nav>
        <a href="/produtos">Lista</a>
        <a href="/produtos/novo">Novo Produto</a>
      </nav>

      <div className="produtos-content">
        <Suspense fallback={<div>Carregando produtos...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
```

## 🔄 Layout Groups

Use parentheses folders to create layout groups that don't appear in the URL:

```
src/pages/
├── (admin)/              # Admin group (doesn't appear in URL)
│   ├── layout.tsx        # Layout for admin pages
│   ├── dashboard/
│   │   └── page.tsx      # /dashboard (not /admin/dashboard)
│   └── users/
│       └── page.tsx      # /users (not /admin/users)
└── (public)/             # Public group
    ├── layout.tsx        # Layout for public pages
    └── about/
        └── page.tsx      # /about
```

### Group Layout

```tsx
// src/pages/(admin)/layout.tsx
import { Outlet } from "react-router";
import { Suspense } from "react";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside>
        <h3>Admin Panel</h3>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/users">Users</a>
        </nav>
      </aside>

      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
```

---

## 🔄 Grupos de Layout

Use pastas com parênteses para criar grupos de layout que não aparecem na URL:

```
src/pages/
├── (admin)/              # Grupo admin (não aparece na URL)
│   ├── layout.tsx        # Layout para páginas admin
│   ├── dashboard/
│   │   └── page.tsx      # /dashboard (não /admin/dashboard)
│   └── usuarios/
│       └── page.tsx      # /usuarios (não /admin/usuarios)
└── (public)/             # Grupo público
    ├── layout.tsx        # Layout para páginas públicas
    └── sobre/
        └── page.tsx      # /sobre
```

### Layout do Grupo

```tsx
// src/pages/(admin)/layout.tsx
import { Outlet } from "react-router";
import { Suspense } from "react";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside>
        <h3>Painel Admin</h3>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/usuarios">Usuários</a>
        </nav>
      </aside>

      <main>
        <Suspense fallback={<div>Carregando...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
```

## ⚡ Estados de Loading

### Loading Global

```tsx
// src/pages/loading.tsx
export default function LoadingPage() {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Carregando...</p>
    </div>
  );
}
```

### Loading Específico

```tsx
// src/pages/produtos/[id]/loading.tsx
export default function ProdutoLoading() {
  return (
    <div className="produto-loading">
      <div className="skeleton"></div>
      <div className="skeleton"></div>
      <div className="skeleton"></div>
    </div>
  );
}
```

## ❌ Tratamento de Erros

### Error Global

```tsx
// src/pages/error.tsx
import { useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="error">
      <h1>Ops! Algo deu errado</h1>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>Tentar Novamente</button>
    </div>
  );
}
```

### Error Específico

```tsx
// src/pages/produtos/[id]/error.tsx
import { useRouteError } from "react-router";

export default function ProdutoError() {
  const error = useRouteError();

  return (
    <div className="produto-error">
      <h2>Erro ao carregar produto</h2>
      <p>{error.message}</p>
      <a href="/produtos">Voltar para lista</a>
    </div>
  );
}
```

### Página 404

```tsx
// src/pages/404.tsx
import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <h1>404 - Página não encontrada</h1>
      <p>A página que você está procurando não existe.</p>
      <Link to="/">Voltar para o início</Link>
    </div>
  );
}
```

## 🔗 Navegação

### Usando Link

```tsx
import { Link } from "react-router";

export default function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/produtos">Produtos</Link>
      <Link to="/produtos/novo">Novo Produto</Link>
      <Link to="/produtos/123">Produto 123</Link>
    </nav>
  );
}
```

### Navegação Programática

```tsx
import { useNavigate } from "react-router";

export default function ProdutoForm() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await saveProduto(data);
    navigate("/produtos"); // Redireciona após salvar
  };

  return <form onSubmit={handleSubmit}>{/* campos do formulário */}</form>;
}
```

## 📊 Exemplos Práticos

### Estrutura Completa de E-commerce

```
src/pages/
├── layout.tsx                    # Layout principal
├── page.tsx                      # Home (/)
├── loading.tsx                   # Loading global
├── error.tsx                     # Error global
├── 404.tsx                       # Not found
├── (auth)/                       # Grupo de autenticação
│   ├── layout.tsx               # Layout de auth
│   ├── login/
│   │   └── page.tsx             # /login
│   └── cadastro/
│       └── page.tsx             # /cadastro
├── (shop)/                       # Grupo da loja
│   ├── layout.tsx               # Layout da loja
│   ├── produtos/
│   │   ├── layout.tsx           # Layout de produtos
│   │   ├── page.tsx             # /produtos
│   │   ├── [categoria]/
│   │   │   └── page.tsx         # /produtos/eletronicos
│   │   └── [id]/
│   │       ├── page.tsx         # /produtos/123
│   │       ├── loading.tsx      # Loading do produto
│   │       ├── error.tsx        # Error do produto
│   │       └── comprar/
│   │           └── page.tsx     # /produtos/123/comprar
│   └── carrinho/
│       └── page.tsx             # /carrinho
└── (admin)/                      # Grupo admin
    ├── layout.tsx               # Layout admin
    ├── dashboard/
    │   └── page.tsx             # /dashboard
    └── produtos/
        ├── page.tsx             # /admin/produtos
        ├── novo/
        │   └── page.tsx         # /admin/produtos/novo
        └── [id]/
            └── page.tsx         # /admin/produtos/123
```

### Componentes de Layout

```tsx
// src/pages/layout.tsx
import { Outlet } from "react-router";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout() {
  return (
    <div className="app">
      <Header />
      <main>
        <Suspense fallback={<div>Carregando...</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
```

```tsx
// src/pages/(shop)/layout.tsx
import { Outlet } from "react-router";
import { Suspense } from "react";
import ShopHeader from "@/components/ShopHeader";
import CartWidget from "@/components/CartWidget";

export default function ShopLayout() {
  return (
    <div className="shop">
      <ShopHeader />
      <div className="shop-content">
        <aside>
          <CartWidget />
        </aside>
        <main>
          <Suspense fallback={<div>Carregando...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
```

## 🎯 Dicas e Boas Práticas

### 1. Organização de Arquivos

- ✅ Use nomes descritivos para pastas
- ✅ Mantenha `page.tsx` no final da hierarquia
- ✅ Use `layout.tsx` para elementos compartilhados
- ❌ Evite aninhamento muito profundo

### 2. Performance

- ✅ Use lazy loading (automático)
- ✅ Implemente loading states
- ✅ Trate erros adequadamente
- ✅ Use code splitting (automático)

### 3. SEO e Acessibilidade

```tsx
// src/pages/produtos/[id]/page.tsx
import { Helmet } from "react-helmet";

export default function ProdutoPage() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>Produto {id} - Minha Loja</title>
        <meta name="description" content={`Detalhes do produto ${id}`} />
      </Helmet>

      <div>
        <h1>Produto {id}</h1>
        {/* conteúdo */}
      </div>
    </>
  );
}
```

### 4. Autenticação

```tsx
// src/pages/(protected)/layout.tsx
import { Outlet, Navigate } from "react-router";
import { Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Suspense fallback={<div>Verificando autenticação...</div>}>
      <Outlet />
    </Suspense>
  );
}
```

## 🔧 Configuração Avançada

### Comandos CLI

```bash
# Inicializar novo projeto
npx react-pages-router init

# Ver ajuda
npx react-pages-router --help
```

### Integrando com TypeScript

```typescript
// src/types/router.ts
export interface RouteParams {
  id: string;
  categoria: string;
}

// src/pages/produtos/[categoria]/[id]/page.tsx
import { useParams } from "react-router";
import type { RouteParams } from "@/types/router";

export default function ProdutoPage() {
  const { id, categoria } = useParams<RouteParams>();

  return (
    <div>
      <h1>
        Produto {id} da categoria {categoria}
      </h1>
    </div>
  );
}
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Página não carrega

- ✅ Verifique se o arquivo `page.tsx` existe
- ✅ Verifique se o caminho está correto
- ✅ Verifique se não há erros de sintaxe

#### 2. Layout não aparece

- ✅ Verifique se `layout.tsx` tem `<Outlet />`
- ✅ Verifique se o arquivo está no local correto
- ✅ Verifique se não há erros no layout

#### 3. Rotas dinâmicas não funcionam

- ✅ Use `[id]` no nome da pasta
- ✅ Use `useParams()` para acessar parâmetros
- ✅ Verifique se não há conflitos com rotas estáticas

#### 4. Rotas não são encontradas

- ✅ Verifique se os arquivos têm extensão `.tsx`
- ✅ Verifique se a estrutura de pastas está correta
- ✅ Reinicie o servidor de desenvolvimento

## 📚 Recursos Adicionais

- [React Router Documentation](https://reactrouter.com/)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🤝 Contribuindo

Encontrou um bug ou tem uma sugestão? Abra uma issue no repositório!

---

**Happy coding! 🎉**
