# React Pages Router - Documentação Técnica

## Visão Geral

Este sistema implementa roteamento baseado em arquivos para React Router, inspirado no Next.js App Router. Ele converte automaticamente a estrutura de pastas em rotas React Router, incluindo suporte a layouts aninhados, rotas dinâmicas, páginas de erro e loading states.

## Arquitetura do Sistema

### Componentes Principais

1. **`router.tsx`** - Core do sistema de roteamento
2. **`cli.ts`** - CLI para inicialização de projetos
3. **`main.tsx`** - Ponto de entrada da aplicação

### Fluxo de Funcionamento

```
1. CLI (init command)
   ↓ Cria estrutura de projeto
   ↓ Gera arquivos base
   ↓ Configura dependências

2. Router Runtime
   ↓ Carrega arquivos via import.meta.glob
   ↓ Converte para RouteObjects
   ↓ Aplica layouts aninhados
   ↓ Cria BrowserRouter

3. User Application
   ↓ Importa router da lib
   ↓ Usa com RouterProvider
   ↓ Renderiza aplicação
```

## Detalhamento Técnico

### 1. CLI (`cli.ts`)

#### Comando `init`

```typescript
function main() {
  // Cria estrutura de pastas
  createPagesStructure();

  // Gera arquivos base
  createMainTsx();
  createLayoutTsx();
  createPageTsx();

  // Instala dependências
  installDependencies();
}
```

#### Estrutura Criada

```bash
src/
├── main.tsx          # Ponto de entrada
├── pages/
│   ├── layout.tsx    # Layout raiz
│   ├── page.tsx      # Página inicial
│   └── (protected)/  # Grupo de layout
│       ├── layout.tsx
│       └── produtos/
│           └── page.tsx
```

### 2. Core Router (`router.tsx`)

#### Função Principal: `router`

```typescript
export const router = createBrowserRouter([routes]);

// Onde routes é gerado internamente via:
const files = import.meta.glob("/src/pages/**/*(page|layout).tsx", {
  eager: false,
});
const errorFiles = import.meta.glob("/src/pages/**/*error.tsx", {
  eager: false,
});
const notFoundFiles = import.meta.glob("/src/pages/**/*404.tsx", {
  eager: false,
});
const loadingFiles = import.meta.glob("/src/pages/**/*loading.tsx", {
  eager: false,
});

const routes = convertPagesToRoute(files, loadingFiles);
addErrorElementToRoutes(errorFiles, routes);
add404PageToRoutesChildren(notFoundFiles, routes);
```

#### Conversão de Arquivos para Rotas

##### `convertPagesToRoute(files, loadingFiles)`

1. **Mapeia arquivos para RouteObjects**

   ```typescript
   const routeMap = new Map<string, ExtendedRouteObject>();

   for (const [filePath, importFn] of Object.entries(files)) {
     const route = createRoute(filePath, importFn);
     routeMap.set(route.path, route);
   }
   ```

2. **Aplica layouts aninhados via `mergeRoutes()`**
   ```typescript
   for (const route of routeMap.values()) {
     const parentPath = getParentPath(route.path);
     if (parentPath && routeMap.has(parentPath)) {
       const parent = routeMap.get(parentPath)!;
       mergeRoutes(parent, route);
     }
   }
   ```

#### Função `createRoute(filePath, importFn)`

**Converte caminho de arquivo para RouteObject:**

```typescript
function createRoute(
  filePath: string,
  importFn: () => Promise<unknown>
): ExtendedRouteObject {
  const segments = getRouteSegmentsFromFilePath(filePath);
  const path = segments.join("/");
  const type = getRouteType(filePath);

  return {
    path: path === "index" ? "/" : `/${path}`,
    element:
      type === "layout" || isTerminalRoute(path) ? lazy(importFn) : undefined,
    type,
    children: [],
  };
}
```

**Mapeamento de arquivos:**

- `page.tsx` → Rota terminal (renderiza conteúdo)
- `layout.tsx` → Layout (renderiza `<Outlet />`)
- `loading.tsx` → Loading state
- `error.tsx` → Error boundary
- `404.tsx` → Not found page

#### Função `mergeRoutes(parent, child)`

**Responsável pela herança de layouts:**

```typescript
function mergeRoutes(parent: ExtendedRouteObject, child: ExtendedRouteObject) {
  // Adiciona child ao parent
  parent.children!.push(child);

  // Se parent tem elemento próprio (page.tsx), converte para index route
  if (parent.element && child.path !== "index") {
    const indexRoute: ExtendedRouteObject = {
      path: "index",
      element: parent.element,
      index: true,
    };
    parent.children!.unshift(indexRoute);
    parent.element = undefined;
  }
}
```

**Comportamento:**

- Layouts sempre têm `element` (renderizam `<Outlet />`)
- Páginas terminais têm `element` (renderizam conteúdo)
- Páginas com filhos se tornam `index: true` routes
- Rotas dinâmicas (`:id`) seguem mesma lógica

### 3. Sistema de Layouts Aninhados

#### Como Funciona

1. **Detecção de Layouts**

   ```typescript
   // pages/layout.tsx → Layout raiz
   // pages/(protected)/layout.tsx → Layout do grupo
   // pages/(protected)/produtos/layout.tsx → Layout específico
   ```

2. **Aplicação Hierárquica**

   ```typescript
   // Estrutura final:
   {
     path: '/',
     element: <RootLayout>, // pages/layout.tsx
     children: [
       {
         path: 'produtos',
         element: <ProtectedLayout>, // pages/(protected)/layout.tsx
         children: [
           {
             path: ':id',
             element: <ProductLayout>, // pages/(protected)/produtos/layout.tsx
             children: [
               {
                 index: true,
                 element: <ProductPage> // pages/(protected)/produtos/[id]/page.tsx
               },
               {
                 path: 'visualizar',
                 element: <ViewProductPage> // pages/(protected)/produtos/[id]/visualizar/page.tsx
               }
             ]
           }
         ]
       }
     ]
   }
   ```

3. **Renderização com Outlet e Suspense**

   ```tsx
   // pages/layout.tsx
   import { Suspense } from "react";
   import { Outlet } from "react-router";

   export default function RootLayout() {
     return (
       <div>
         <Header />
         <Suspense fallback={<div>Carregando...</div>}>
           <Outlet /> {/* Renderiza children aqui */}
         </Suspense>
         <Footer />
       </div>
     );
   }
   ```

### 4. Rotas Dinâmicas

#### Conversão de Segments

```typescript
function getRouteSegmentsFromFilePath(filePath: string): string[] {
  return filePath
    .split("/")
    .filter((segment) => !segment.startsWith("(") && !segment.endsWith(")"))
    .map((segment) => {
      if (segment.startsWith("[") && segment.endsWith("]")) {
        return `:${segment.slice(1, -1)}`;
      }
      return segment.replace(/\.(page|layout)\.tsx$/, "");
    })
    .filter(Boolean);
}
```

**Exemplos:**

- `[id]` → `:id`
- `[...slug]` → `:slug*` (catch-all)
- `(protected)` → removido (grupo de layout)

#### Comportamento de Rotas Dinâmicas

```typescript
// pages/produtos/[id]/page.tsx → /produtos/:id
// pages/produtos/[id]/visualizar/page.tsx → /produtos/:id/visualizar

// Estrutura resultante:
{
  path: 'produtos/:id',
  element: <ProductLayout>,
  children: [
    {
      index: true,
      element: <ProductPage> // Renderiza quando acessa /produtos/123
    },
    {
      path: 'visualizar',
      element: <ViewProductPage> // Renderiza quando acessa /produtos/123/visualizar
    }
  ]
}
```

### 5. Sistema de Loading e Error States

#### Loading States

```typescript
function addLoadingToRoutes(
  loadingFiles: Record<string, () => Promise<unknown>>,
  routes: RouteObject
) {
  for (const [filePath, importFn] of Object.entries(loadingFiles)) {
    const routePath = getRoutePathFromFilePath(filePath);
    const route = findRouteByPath(routes, routePath);

    if (route) {
      route.loader = async () => {
        // Simula loading
        await new Promise((resolve) => setTimeout(resolve, 100));
        return null;
      };
      route.element = lazy(() =>
        importFn().then((module) => ({ default: LoadingComponent }))
      );
    }
  }
}
```

#### Error Boundaries

```typescript
function addErrorElementToRoutes(
  errorFiles: Record<string, () => Promise<unknown>>,
  routes: RouteObject
) {
  for (const [filePath, importFn] of Object.entries(errorFiles)) {
    const routePath = getRoutePathFromFilePath(filePath);
    const route = findRouteByPath(routes, routePath);

    if (route) {
      route.errorElement = lazy(importFn);
    }
  }
}
```

### 6. Grupos de Layout (Pastas com Parênteses)

#### Detecção e Processamento

```typescript
// pages/(protected)/produtos/page.tsx
// pages/(protected)/usuarios/page.tsx

// Resultado: ambas herdam o layout de (protected)
{
  path: '/',
  element: <RootLayout>,
  children: [
    {
      path: 'produtos',
      element: <ProtectedLayout>, // pages/(protected)/layout.tsx
      children: [
        {
          index: true,
          element: <ProductsPage> // pages/(protected)/produtos/page.tsx
        }
      ]
    },
    {
      path: 'usuarios',
      element: <ProtectedLayout>, // pages/(protected)/layout.tsx
      children: [
        {
          index: true,
          element: <UsersPage> // pages/(protected)/usuarios/page.tsx
        }
      ]
    }
  ]
}
```

### 7. Integração com React Router

#### Criação do Router

```typescript
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([routes]);
```

#### Uso no App

```typescript
// main.tsx
import { RouterProvider } from "react-router";
import { createFileSystemRouter } from "./core";

const router = createFileSystemRouter();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
```

### 8. Lazy Loading e Code Splitting

#### Implementação

```typescript
import { lazy } from "react";

// Cada arquivo é carregado lazy
const element = lazy(importFn);

// React Router gerencia o loading automaticamente
// Suspense boundaries são aplicados automaticamente
```

#### Benefícios

- **Code Splitting Automático**: Cada rota é um chunk separado
- **Loading States**: Estados de carregamento por rota
- **Error Boundaries**: Tratamento de erro por rota
- **Performance**: Carrega apenas o necessário

### 9. Configuração e Customização

#### CLI Commands

```bash
# Inicializar novo projeto
npx react-pages-router init

# Ver ajuda
npx react-pages-router --help
```

#### Estrutura Padrão

```typescript
// Estrutura criada pelo CLI:
src/
├── main.tsx          # Importa router da lib
├── pages/            # Diretório das páginas
│   ├── layout.tsx    # Layout raiz
│   ├── page.tsx      # Página inicial
│   └── (protected)/  # Grupo de layout
```

### 10. Estrutura de Arquivos Suportada

```
pages/
├── layout.tsx              # Layout raiz
├── page.tsx                # Página inicial (/)
├── loading.tsx             # Loading global
├── error.tsx               # Error global
├── 404.tsx                 # Not found
├── (protected)/            # Grupo de layout
│   ├── layout.tsx          # Layout do grupo
│   ├── produtos/
│   │   ├── layout.tsx      # Layout específico
│   │   ├── page.tsx        # /produtos
│   │   ├── novo/
│   │   │   └── page.tsx    # /produtos/novo
│   │   └── [id]/
│   │       ├── page.tsx    # /produtos/:id
│   │       ├── loading.tsx # Loading da rota
│   │       ├── error.tsx   # Error da rota
│   │       └── visualizar/
│   │           └── page.tsx # /produtos/:id/visualizar
│   └── usuarios/
│       └── [id]/
│           └── page.tsx    # /usuarios/:id
└── public/
    └── page.tsx            # /public
```

### 11. Considerações de Performance

#### Build Time

- **Plugin Vite**: Executa apenas em build time
- **Detecção de Arquivos**: O(n) onde n = número de arquivos
- **Geração de Rotas**: O(n²) no pior caso (aninhamento)

#### Runtime

- **Lazy Loading**: Carregamento sob demanda
- **Memoização**: React Router otimiza re-renders
- **Code Splitting**: Chunks separados por rota

### 12. Limitações e Considerações

#### Limitações Atuais

1. **Apenas TypeScript/TSX**: Suporte apenas para `.tsx`
2. **Estrutura Fixa**: Arquivos devem seguir convenção Next.js
3. **React Router**: Dependência obrigatória
4. **Suspense Obrigatório**: Layouts devem usar Suspense

#### Considerações Futuras

1. **Suporte a JavaScript**: Adicionar `.jsx`
2. **Outros Bundlers**: Webpack, Rollup
3. **Rotas API**: Suporte a API routes
4. **Middleware**: Suporte a middleware customizado

### 13. Debugging e Troubleshooting

#### Logs de Debug

```typescript
console.log("[DEBUG] Files found:", Object.keys(files));
console.log("[DEBUG] Routes created:", routes);
console.log("[DEBUG] Final routes:", routes);
```

#### Problemas Comuns

1. **"Matched leaf route does not have an element"**

   - Verificar se `page.tsx` existe
   - Verificar se `createRoute` está gerando `element`

2. **Layout não aparece**

   - Verificar se `layout.tsx` tem `<Outlet />` e `<Suspense>`
   - Verificar se `mergeRoutes` está funcionando

3. **Rotas dinâmicas não funcionam**

   - Verificar conversão `[id]` → `:id`
   - Verificar se não há conflito com rotas estáticas

4. **Rotas não são encontradas**
   - Verificar se os arquivos têm extensão `.tsx`
   - Verificar se a estrutura de pastas está correta

### 14. Testes e Validação

#### Estrutura de Testes Recomendada

```typescript
// __tests__/router.test.ts
describe("File System Router", () => {
  test("should create routes from file structure", () => {
    const router = createFileSystemRouter();
    expect(router).toBeDefined();
  });

  test("should handle dynamic routes", () => {
    // Testa conversão [id] → :id
  });

  test("should apply nested layouts", () => {
    // Testa herança de layouts
  });
});
```

#### Validação de Rotas

```typescript
// Valida se todas as rotas têm elementos válidos
function validateRoutes(routes: RouteObject[]) {
  for (const route of routes) {
    if (route.children) {
      validateRoutes(route.children);
    }

    if (!route.element && !route.children?.length) {
      throw new Error(`Route ${route.path} has no element or children`);
    }
  }
}
```

## Conclusão

Este sistema oferece uma solução robusta para roteamento baseado em arquivos, combinando a simplicidade do Next.js com a flexibilidade do React Router. A arquitetura modular permite fácil extensão e customização, enquanto o CLI garante uma experiência de inicialização simples e rápida.

O sistema é especialmente adequado para projetos que desejam usar roteamento baseado em arquivos com React Router, mantendo a familiaridade do Next.js App Router.
