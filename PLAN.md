# PLAN.md - Rediseño SmartCart + API

## Visión General
Rediseñar la app actual (React frontend-only) añadiendo backend con API REST y SQLite para persistencia, permitiendo consultar compras pasadas.

---

## Fase 1: Backend + API (Semana 1)

### 1.1 Setup Backend
```
server/
├── index.js           # Entry point Express
├── config/
│   └── database.js    # Conexión SQLite
├── models/
│   └── compra.js      # Modelo de datos
├── routes/
│   └── compras.js     # Endpoints API
└── package.json
```

### 1.2 Dependencias Backend
- express
- better-sqlite3
- cors
- dotenv

### 1.3 Modelo de Datos - Tabla `compras`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | PK, auto-increment |
| nombre | TEXT | Nombre del producto |
| precio | REAL | Precio unitario |
| cantidad | INTEGER | Cantidad |
| categoria | TEXT | Categoría del producto |
| total | REAL | precio × cantidad |
| fecha | TEXT | ISO timestamp |
| nombre_compra | TEXT | Nombre del carrito/ticket |

### 1.4 Endpoints API
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/compras` | Listar compras (soporta `?fecha=YYYY-MM-DD&categoria=X`) |
| POST | `/api/compras` | Crear nueva compra |
| GET | `/api/compras/:id` | Ver compra específica |
| DELETE | `/api/compras/:id` | Eliminar compra |
| GET | `/api/compras/resumen` | Stats: total por categoría, historial |

---

## Fase 2: Rediseño Frontend (Semana 2)

### 2.1 Nueva Estructura de Páginas
- **Dashboard** (`/`) - Historial de compras recientes + stats
- **Nueva Compra** (`/nueva`) - Formulario para agregar productos
- **Detalle Compra** (`/compra/:id`) - Ver productos de una compra
- **Historial** (`/historial`) - Lista completa con filtros

### 2.2 Componentes a Crear/Rediseñar
- Sidebar/Navigation
- PurchaseCard - Card para mostrar resumen de compra
- PurchaseDetail - Detalle de productos
- FilterBar - Filtros por fecha/categoría
- StatsPanel - Gráficos y métricas

### 2.3 Mejoras UX
- Persistencia con llamada a API
- Loading skeletons
- Toast notifications
- Responsive design mejorado

---

## Fase 3: Integración y Testing (Semana 3)

### 3.1 Integración
- Conectar App.jsx con endpoints
- Manejo de estados: loading, error, success
- Sincronización de datos

### 3.2 Testing
- Tests de API con Vitest
- Tests de componentes

---

## Tech Stack Final
| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + Vite + MUI + Tailwind |
| Backend | Node.js + Express |
| DB | SQLite (better-sqlite3) |

---

## Orden de Implementación Sugerido
1. Setup backend Express + SQLite
2. Crear endpoints API básicos
3. Testear API con Postman/curl
4. Rediseñar frontend con rutas
5. Integrar frontend con API
6. Testing completo
