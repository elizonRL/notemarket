# Testing Rule - NoteMarket

## Propósito

Define el comportamiento para tareas de testing en NoteMarket.

## Trigger

Esta regla se activa cuando:
- El usuario dice: "test", "prueba", "coverage", "spec"
- Se necesitan escribir o ejecutar pruebas
- Hay tests que fallan

## Comportamiento

### Stack de testing

| Herramienta | Versión |
|-------------|---------|
| Vitest | 3.x |
| @testing-library/react | 16.x |
| @testing-library/jest-dom | 6.x |
| @testing-library/user-event | 14.x |
| jsdom | 27.x |

### Comandos

```bash
npm run test           # Ejecutar tests una vez
npm run test -- --coverage  # Con coverage
```

### Estructura de tests

```
src/components/
├── Component/
│   ├── Component.jsx
│   └── Component.test.jsx    ← Tests junto al componente
```

## Convenciones

### Naming

```
describe('ComponentName', () => {
  it('should render correctly', () => {})
  it('should call onClick', () => {})
})
```

### Patrones

```jsx
// Test de componente
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'

// Test con user-event (recomendado)
import userEvent from '@testing-library/user-event'
```

## Output esperado

```markdown
## Resultado - Testing

### Tests ejecutados
- [X] passing, [Y] failing

### Coverage
- Overall: [X]%
- [archivo]: [Y]%

### Archivos modificados
- `src/components/X.test.jsx`
```

---

**Versión:** 1.0.0
