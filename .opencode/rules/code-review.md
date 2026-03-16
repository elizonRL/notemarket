# Code Review Rule - NoteMarket

## Propósito

Define el comportamiento para revisiones de código en NoteMarket.

## Trigger

Esta regla se activa cuando:
- El usuario dice: "review", "revisar", "lint", "eslint"
- Se necesita verificar calidad del código
- Pre-commit o pre-merge

## Comportamiento

### Herramientas

```bash
npm run lint   # ESLint
```

### Reglas activas

| Regla | Severidad |
|-------|-----------|
| `react-refresh/only-export-components` | warn |
| `react-hooks/rules-of-hooks` | error |
| `react-hooks/exhaustive-deps` | warn |

## Áreas de revisión

### 1. Correctitud
- El código hace lo esperado?
- Maneja edge cases?

### 2. Performance
- Re-renders innecesarios?
- Datos serializados doble?

### 3. Legibilidad
- Nombres descriptivos?
- Funciones pequeñas?

### 4. Seguridad
- Datos sensibles hardcodeados?
- Inputs validados?

## Output esperado

```markdown
## Code Review

### Veredicto
✅ APROBADO | 🟡 APROBADO CON COMENTARIOS | ❌ BLOQUEADO

### Issues
- 🔴 Críticos: [n]
- 🟡 Warnings: [n]

### Linting
npm run lint: ✅ PASS | ❌ FAIL
```

---

**Versión:** 1.0.0
