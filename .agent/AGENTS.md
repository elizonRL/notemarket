# 🤖 AGENTS.md - NoteMarket

> **NOTA:** Los agentes reales de OpenCode están en `.opencode/agents/`. Este archivo es documentación de referencia interna.

**Proyecto:** NoteMarket - App de gestión de gastos y carrito de compras
**Stack:** React 19 + Vite + Tailwind CSS v4 + MUI + Tesseract.js + Vitest
**Versión:** 1.0.0

---

## 📋 ÍNDICE

1. [Agentes Reales OpenCode](#agentes-reales-opencode)
2. [Documentación de Referencia](#documentación-de-referencia)
3. [Reglas de Comunicación](#reglas-de-comunicación)
4. [Workflows](#workflows)

---

## 📦 AGENTES REALES OPENCODE

Los agentes configurados correctamente según la documentación de OpenCode están en:

```
.opencode/agents/
├── pm.md                       ← NUEVO: Agente PM/Orquestador
├── frontend-developer.md       ← Se activa: "crea", "implementa", "build"
├── testing-engineer.md       ← Se activa: "test", "coverage"
├── code-reviewer.md          ← Se activa: "review", "lint"
├── ocr-specialist.md        ← Se activa: "ocr", "tesseract"
└── ui-designer.md           ← Se activa: "diseño", "UI"
```

### Cómo usarlos

```bash
# Con @mention
@pm coordiname esta tarea
@frontend-developer creame un componente
@testing-engineer agregame tests

# O el PM puede delegar automáticamente
```

### Configuración

Cada agente tiene en su frontmatter:
- `description`: Cuándo activarse
- `mode`: `subagent` o `primary` (PM es primary)
- `tools`: Qué herramientas puede usar

---

## 🎯 FLUJO DE TRABAJO

```
USER → PM (este proyecto) → [Frontend | Testing | OCR | UI] → Code Review → USER
```

---

## 📚 DOCUMENTACIÓN DE REFERENCIA

Para información más detallada de cada rol, ver:

```
.agent/agents/
├── frontend-developer/AGENT.md   ← Referencia completa
├── testing-engineer/AGENT.md    ← Referencia completa
├── code-reviewer/AGENT.md        ← Referencia completa
├── ocr-specialist/AGENT.md      ← Referencia completa
└── ui-designer/AGENT.md          ← Referencia completa
```

> ⚠️ Estos archivos son documentación de referencia, NO agentes de OpenCode.

---

## 🏗️ ARQUITECTURA

```
                        ┌─────────────────────┐
                        │   USER (vos)       │
                        └─────────┬───────────┘
                                  │
            ┌─────────────────────┼─────────────────────┐
            │         .opencode/agents/              │
            ▼                                           ▼
   ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
   │   FRONTEND    │   │   TESTING      │   │  CODE REVIEW  │
   │   DEVELOPER   │   │   ENGINEER     │   │    AGENT      │
   └────────────────┘   └────────────────┘   └────────────────┘
            │                     │                     │
            ▼                     ▼                     ▼
   ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
   │  UI Design    │   │  Test Writer    │   │  Linter       │
   │  Specialist   │   │  (Vitest)       │   │  Runner       │
   └────────────────┘   └────────────────┘   └────────────────┘
```

---

## 👑 AGENTE PRINCIPAL (ORCHESTRATOR)

### Propósito
Coordinar todas las decisiones, delegar trabajo a agentes especializados, y mantener la visión global del proyecto.

### Responsabilidades
- **Recibir instrucciones del usuario**
- **Decidir qué agente(s) necesitan actuar**
- **Coordinar flujos de trabajo complejos**
- **Mantener contexto entre sesiones**
- **Gestionar el estado del proyecto**

### Cuándo actuar
- El usuario hace una petición que requiere código
- Hay que tomar decisiones de arquitectura
- Se necesita coordinar múltiples agentes
- Fin de sesión → guardar contexto en Engram

### Reglas de Operación
1. **NUNCA hacer trabajo inline** — siempre delegar
2. **Cargar skills relevantes** antes de delegar
3. **Preservar contexto** en Engram después de cada sesión
4. **Verificar decisiones** antes de proceder

---

## 🧑‍💻 AGENTES ESPECIALIZADOS

> **NOTA IMPORTANTE:** Los agentes reales de OpenCode están en `.opencode/agents/`. Abajo está la referencia rápida.

### 1. FRONTEND DEVELOPER

**Archivo real:** `.opencode/agents/frontend-developer.md`
**Referencia:** `.agent/agents/frontend-developer/AGENT.md`

| Aspecto | Detalle |
|---------|----------|
| **Trigger** | "crea", "implementa", "hace", "build", "agrega", "modifica" |
| **Skills** | `frontend-design`, `tailwind-design-system`, `vercel-react-best-practices` |
| **Enfoque** | UI/UX, componentes, rendimiento, accesibilidad |

**Responsabilidades:**
- Crear componentes React
- Implementar funcionalidades frontend
- Aplicar diseño con Tailwind
- Optimizar performance
- Seguir mejores prácticas de React 19

**Comandos típicos:**
- "Creame el componente X"
- "Agrega esta funcionalidad"
- "Refactoriza el componente Y"

---

### 2. TESTING ENGINEER

**Archivo real:** `.opencode/agents/testing-engineer.md`
**Referencia:** `.agent/agents/testing-engineer/AGENT.md`

| Aspecto | Detalle |
|---------|----------|
| **Trigger** | "test", "prueba", "coverage", "spec", "describe", "it" |
| **Skills** | `vitest`, `@testing-library/react` |
| **Enfoque** | Tests unitarios, integración, e2e, coverage |

**Responsabilidades:**
- Escribir tests con Vitest
- Testing library para React
- Coverage analysis
- Mock de dependencias
- TDD cuando aplique

**Comandos típicos:**
- "Escribi tests para X"
- "Agrega coverage al proyecto"
- "Fixear el test que falla"

---

### 3. CODE REVIEWER

**Archivo real:** `.opencode/agents/code-reviewer.md`
**Referencia:** `.agent/agents/code-reviewer/AGENT.md`

| Aspecto | Detalle |
|---------|----------|
| **Trigger** | "review", "revisar", "calidad", "lint", "eslint" |
| **Skills** | `eslint`, `prettier` (configurados) |
| **Enfoque** | Calidad, seguridad, mejores prácticas |

**Responsabilidades:**
- Revisar código antes de commit
- Ejecutar linter
- Verificar TypeScript
- Detectar code smells
- Sugerir refactors

**Comandos típicos:**
- "Revisa este código"
- "Runnea el linter"
- "Que falta para estar clean?"

---

### 4. OCR SPECIALIST

**Archivo real:** `.opencode/agents/ocr-specialist.md`
**Referencia:** `.agent/agents/ocr-specialist/AGENT.md`

| Aspecto | Detalle |
|---------|----------|
| **Trigger** | "ocr", "tesseract", "scanner", "lectura", "ticket" |
| **Skills** | `tesseract.js`, procesamiento de imágenes |
| **Enfoque** | Reconocimiento óptico de caracteres, extracción de datos |

**Responsabilidades:**
- Mejorar el módulo OCR existente
- Extraer datos de tickets/recibos
- Optimizar calidad de imagen
- Manejar errores de reconocimiento

**Comandos típicos:**
- "Mejora el OCR"
- "Como extraigo los datos del ticket?"
- "El OCR no funciona bien con X"

---

### 5. UI DESIGNER

**Archivo real:** `.opencode/agents/ui-designer.md`
**Referencia:** `.agent/agents/ui-designer/AGENT.md`

| Aspecto | Detalle |
|---------|----------|
| **Trigger** | "diseño", "UI", "UX", "estilo", "look", "feel" |
| **Skills** | `frontend-design`, `tailwind-design-system` |
| **Enfoque** | Estética, usabilidad, consistencia |

**Responsabilidades:**
- Diseñar interfaces memorables
- Definir sistema de diseño
- Paletas de colores
- Tipografía
- Animaciones

**Comandos típicos:**
- "Diseña la pantalla de X"
- "Agregale estilo a esto"
- "Esta UI parece muy genérica"

---

## 📞 REGLAS DE COMUNICACIÓN

### Del Orchestrator a Agentes

```
START PROMPT WITH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 CONTEXTO DEL PROYECTO:
- Nombre: NoteMarket
- Stack: React 19 + Vite + Tailwind v4 + MUI + Tesseract.js
- Funcionalidad: Carrito de compras, gestión de gastos, OCR

📋 TAREA:
[Descripción de lo que necesita el agente]

🔧 RECURSOS DISPONIBLES:
- Skills disponibles: [listar]
- Archivos relevantes: [listar]

✅ INSTRUCCIONES:
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

📤 OUTPUT ESPERADO:
[Qué debe devolver el agente]

💾 GUARDAR EN MEMORIA:
[Cosas importantes para guardar en Engram]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Del Agente al Orchestrator

El agente debe devolver:
1. **Status**: success | partial | failed
2. **Resumen ejecutivo**: 1-2 oraciones
3. **Cambios realizados**: Archivos modificados/creados
4. **Problemas encontrados**: Si los hay
5. **Próximos pasos sugeridos**: Si aplica

---

## 🔄 WORKFLOWS

### Workflow 1: Nueva Feature

```
USER → ORCHESTRATOR → FRONTEND DEVELOPER
                              │
                              ▼
                    Testing Engineer (opcional)
                              │
                              ▼
                    Code Reviewer (opcional)
                              │
                              ▼
                    ORCHESTRATOR → USER (resultado)
```

### Workflow 2: Bug Fix

```
USER → ORCHESTRATOR → Testing Engineer (reproduce)
              │
              ▼
        Frontend Developer (fix)
              │
              ▼
        Code Reviewer (verify)
              │
              ▼
        ORCHESTRATOR → USER (resultado)
```

### Workflow 3: Refactor

```
USER → ORCHESTRATOR → Code Reviewer (analyze)
              │
              ▼
        Frontend Developer (implement)
              │
              ▼
        Testing Engineer (verify tests)
              │
              ▼
        ORCHESTRATOR → USER (resultado)
```

---

## 🎯 SKILLS AUTO-LOAD

El orchestrator debe cargar automáticamente estas skills según el contexto:

| Contexto | Skill a cargar |
|----------|---------------|
| UI/Componentes | `frontend-design` + `tailwind-design-system` |
| React/Next.js | `vercel-react-best-practices` |
| Testing | `vitest` (del proyecto) |
| OCR | `tesseract.js` (del proyecto) |

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
📦 AGENTES REALES (OpenCode) - .opencode/agents/
.opencode/
├── agents/
│   ├── frontend-developer.md    ← ✅ Agente real
│   ├── testing-engineer.md      ← ✅ Agente real
│   ├── code-reviewer.md         ← ✅ Agente real
│   ├── ocr-specialist.md        ← ✅ Agente real
│   └── ui-designer.md           ← ✅ Agente real
└── rules/
    ├── orchestrator.md
    ├── frontend.md
    ├── testing.md
    └── code-review.md

📚 REFERENCIA INTERNA - .agent/
.agent/
├── AGENTS.md                    ← Documentación (no es agente)
├── skill-registry.md            ← Registro de skills
├── agents/                      ← Documentación de referencia
│   ├── frontend-developer/
│   │   └── AGENT.md
│   ├── testing-engineer/
│   │   └── AGENT.md
│   └── ...
└── skills/                      ← Skills del proyecto
    ├── frontend-design/
    ├── tailwind-design-system/
    └── vercel-react-best-practices/
```

---

## 🚀 USO

### Iniciar sesión de trabajo:
```
npx opencode@latest
```

### Delegar a un agente:
El orchestrator automáticamente detecta qué agente necesita según el contexto del mensaje del usuario.

### Guardar contexto:
Al finalizar, el orchestrator debe guardar en Engram:
- Decisiones de arquitectura
- Bugs encontrados
- Patrones establecidos
- Preferencias del usuario

---

## 📝 NOTAS

- Este archivo sirve como **source of truth** para la coordinación de agentes
- Los agentes son ** stateless** - el orchestrator mantiene el contexto
- Las skills se cargan **dinámicamente** según necesidad
- **SIEMPRE** preservar contexto en Engram entre sesiones
