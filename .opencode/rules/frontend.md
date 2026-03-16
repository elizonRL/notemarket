# Frontend Rule - NoteMarket

## Propósito

Define el comportamiento para tareas de desarrollo frontend en NoteMarket.

## Trigger

Esta regla se activa cuando:
- El usuario dice: "crea", "implementa", "hace", "build", "agrega", "modifica"
- Se necesita desarrollar UI/componentes
- Se requiere estilizado con Tailwind

## Comportamiento

### Stack del proyecto

| Tecnología | Versión |
|------------|---------|
| React | 19.x |
| Vite | 6.x |
| Tailwind CSS | 4.x |
| MUI | 7.x |

### Comandos disponibles

```bash
npm run dev      # Desarrollo
npm run build    # Producción
npm run lint     # ESLint
npm run test     # Vitest
```

### Alias configurados

```
@components → src/components
@hooks      → src/hooks
@assets     → src/assets
```

## Skills a cargar

1. **frontend-design** - Para UI distintiva y memorable
2. **tailwind-design-system** - Para componentes Tailwind v4
3. **vercel-react-best-practices** - Para optimización React

## Convenciones

### Estructura de componentes

```
src/components/
├── ComponentName/
│   ├── ComponentName.jsx
│   └── ComponentName.test.jsx
```

### Nombrado

- Componentes: PascalCase (`ProductCard`)
- Hooks: camelCase con prefijo `use` (`useProduct`)
- Funciones: camelCase (`handleClick`)

### Estilos

Usar siempre Tailwind CSS con clases utilitarias.

## Output esperado

Al completar, devolver:

```markdown
## Resultado

### Status
✅ Completado | ⚠️ Parcial | ❌ Fallido

### Archivos modificados
- `src/components/X.jsx`

### Testing
- Tests agregados
```

---

**Versión:** 1.0.0
