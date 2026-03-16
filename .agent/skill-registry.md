# 📦 SKILL REGISTRY - NoteMarket

**Proyecto:** NoteMarket
**Última actualización:** 2026-03-16

---

## 🎯 QUÉ ES ESTE REGISTRO

Este archivo mapea qué skills se cargan automáticamente según el contexto del trabajo que el agente está realizando.

---

## 📋 SKILLS LOCALES DEL PROYECTO

### 1. frontend-design

| Aspecto | Detalle |
|---------|---------|
| **Ubicación** | `.agents/skills/frontend-design/` |
| **Trigger** | UI, diseño, componentes, páginas |
| **Qué hace** | Interfaces distintivas sin "AI slop" |
| **Archivos** | `SKILL.md`, `LICENSE.txt` |

### 2. tailwind-design-system

| Aspecto | Detalle |
|---------|---------|
| **Ubicación** | `.agents/skills/tailwind-design-system/` |
| **Trigger** | Tailwind, componentes, design tokens |
| **Qué hace** | Design systems con Tailwind v4 |
| **Archivos** | `SKILL.md` |

### 3. vercel-react-best-practices

| Aspecto | Detalle |
|---------|---------|
| **Ubicación** | `.agents/skills/vercel-react-best-practices/` |
| **Trigger** | React, Next.js, performance, data fetching |
| **Qué hace** | 62 reglas de optimización |
| **Archivos** | `SKILL.md`, `AGENTS.md`, `rules/` |

---

## 🗺️ MAPA DE TRIGGERS

| Si el trabajo incluye... | Cargar skill(s)... |
|--------------------------|-------------------|
| Crear UI, componentes | `frontend-design` + `tailwind-design-system` |
| React hooks, state | `vercel-react-best-practices` |
| Performance | `vercel-react-best-practices` |
| Data fetching | `vercel-react-best-practices` |
| Tailwind config | `tailwind-design-system` |
| Design tokens | `tailwind-design-system` |

---

## 📂 ESTRUCTURA COMPLETA

```
📦 AGENTES REALES (OpenCode) - .opencode/agents/
.opencode/
├── agents/
│   ├── pm.md                       ← ✅ NUEVO: Agente PM/Orquestador
│   ├── frontend-developer.md       ← ✅ Desarrollo frontend
│   ├── testing-engineer.md         ← ✅ Testing
│   ├── code-reviewer.md            ← ✅ Code review
│   ├── ocr-specialist.md          ← ✅ OCR
│   └── ui-designer.md              ← ✅ Diseño UI
└── rules/
    ├── orchestrator.md
    ├── frontend.md
    ├── testing.md
    └── code-review.md
.agent/
├── AGENTS.md                          ← Orchestrator principal
├── skill-registry.md                  ← Este archivo
├── agents/
│   ├── frontend-developer/
│   │   └── AGENT.md
│   ├── testing-engineer/
│   │   └── AGENT.md
│   ├── code-reviewer/
│   │   └── AGENT.md
│   ├── ocr-specialist/
│   │   └── AGENT.md
│   └── ui-designer/
│       └── AGENT.md
└── skills/
    ├── _shared/                       ← Convenciones compartidas
    ├── frontend-design/
    │   └── SKILL.md
    ├── tailwind-design-system/
    │   └── SKILL.md
    └── vercel-react-best-practices/
        ├── SKILL.md
        ├── AGENTS.md
        └── rules/
            ├── _sections.md
            ├── async-*.md
            ├── bundle-*.md
            └── ...
```

---

## 🔄 AGENTES DEL PROYECTO

| Agente | Archivo | Trigger |
|--------|---------|---------|
| **Orchestrator** | `AGENTS.md` | (principal) |
| **Frontend Developer** | `agents/frontend-developer/AGENT.md` | crea, implementa, build |
| **Testing Engineer** | `agents/testing-engineer/AGENT.md` | test, coverage |
| **Code Reviewer** | `agents/code-reviewer/AGENT.md` | review, lint |
| **OCR Specialist** | `agents/ocr-specialist/AGENT.md` | ocr, scanner, tesseract |
| **UI Designer** | `agents/ui-designer/AGENT.md` | diseño, UI, estilo |

---

## 💾 CÓMO USAR

### Como Orchestrator

1. Leer el mensaje del usuario
2. Detectar keywords que matcheen triggers
3. Cargar las skills necesarias
4. Si corresponde, delegar al agente apropiado
5. Al final, guardar contexto en Engram

### Como Sub-agente

1. El orchestrator pasa el contexto completo
2. Skills ya están cargadas
3. Aplicar las reglas de la skill
4. Devolver resultado estructurado
5. Guardar decisiones en Engram

---

## 📝 EJEMPLO DE FLUJO

```
USER: "Creame un nuevo componente para mostrar productos"

ORCHESTRATOR detecta:
  → Trigger: "creame" → Frontend Developer
  → Contexto: componentes → frontend-design + tailwind-design-system

ORCHESTRATOR carga skills:
  1. frontend-design
  2. tailwind-design-system

ORCHESTRATOR → FRONTEND DEVELOPER:
  "Creá el componente ProductCard con las skills cargadas"

FRONTEND DEVELOPER:
  → Aplica frontend-design (diseño distintivo)
  → Aplica tailwind-design-system (componente CVA)
  → Crea componente
  → Devuelve resultado

ORCHESTRATOR → USER:
  "Listo, creé el componente ProductCard"
```

---

## 🎓 NOTAS

- Este registry se usa en combinación con el AGENTS.md principal
- Las skills tienen precedencia sobre las convenciones de los agentes
- Siempre guardar decisiones importantes en Engram

---

**Versión:** 1.0.0
