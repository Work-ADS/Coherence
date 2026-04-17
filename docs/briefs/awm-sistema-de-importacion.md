# AWM — Sistema de Importación

**Status:** active
**Client:** AFI (internal)
**Product:** AFI Wealth Manager (AWM) — B2B platform
**Feature:** Sistema de Importación — back-office data ingestion module
**Started:** 2026-04-16
**Last updated:** 2026-04-16
**Figma reference:** [AWM-Wealth-Manager-DEV · node 1562:23732](https://www.figma.com/design/9CuIYPGooTHSrHBKkUQETj/AWM-Wealth-Manager-DEV?node-id=1562-23732) — prototype by other designers, single-canvas flow example with fake data. **Reference, not spec.**

**Why this matters for Coherence:** table-heavy, drawer-heavy, inline-edit-heavy. Strongest v1 stress test for Table (Notion + Stripe interactive surface, `plan.md` item 3), Drawer (no overlay, row-nav), and the inline-edit pattern. Shipping this flow without hand-rolled overrides = v1 DS passes a meaningful real-world bar.

---

## Context (Phase 0 — Intake · locked 2026-04-16)

**Client / team.** AFI internal — AWM (AFI Wealth Manager), B2B platform.

**Project type.** Redesign.
- *Nuance:* the operational workflow exists today via direct DB intervention; the UI is being drawn fresh on Coherence. Phase 1 pain questions target the DB-only workflow, not an existing UI.

**Existing design system.** Coherence itself — this is the first real brief being built with it. No integrate / restyle / alongside question applies; Coherence **is** the DS.

**Existing mocks.** Figma prototype exists (see link in header). Single canvas, fake data, flow-example only. Status: **reference, not spec.** Flow intent is the starting point; the visual system is being rebuilt on Coherence.

**Stakeholders** (hierarchy, top → bottom):

1. **Borja** — signs off. On-record voice: *"The goal isn't to work more, it's to make more."*
2. **Angel**, **Nico** — tier 2, most likely to carry adoption or block it if the DS doesn't earn their trust.
3. **Oscar**, **Victor** — senior ICs, taste / standard setters (both strategy-oriented per team profile).
4. **Polo** — most junior on the team.

**Carried into Phase 1:** among Angel / Nico / Oscar / Victor / Polo, whose product sensibility most shapes what "good" looks like for this team? To probe alongside the references question.

---

## Frame (Phase 1 — pending)

_Pains · North star · References · Users · Success metrics_

## Scope (Phase 2 — pending)

_v1 surfaces · User stories · Out-of-scope · Golden flow_

## Spec (Phase 3 — pending)

_Technical + instrumentation + golden-flow tracking · Non-technical · Team + timeline_

## Parked (Phase 4 — pending)

_v2 candidates · Backlog · Still-to-determine_

---

## Source material — verbatim AI Project Brief (received 2026-04-16)

_The original brief, preserved as reference. The Coherence-format plan above is the living artifact; this section does not get edited after activation._

### Project Overview

The **Sistema de Importación** is a back-office data ingestion module within AFI Wealth Manager that allows operations staff to connect to external bank/custodian providers, review incoming entity data, apply mapping rules, and import or reject changes into the platform.

---

### Core Problem

AWM needs to automatically receive client, portfolio, asset, price, position, and transaction data from external providers (e.g., Santander, Sabadell). Currently, configuration requires manual database intervention. The new system gives back-office users full control over the import lifecycle through a UI.

---

### Users

- **Back-office operators** — review and action incoming data daily
- **Compliance/admin users** — manage mapping rules and configurations
- **Infrastructure managers** — manage provider connections

---

### Key Entities Being Imported

Clients, accounts, portfolios, assets, contracts, prices, positions, transactions, corporate actions, classifications

---

### Main Sections (Navigation)

| Tab | Purpose |
|---|---|
| **Importaciones** | Log of all import executions |
| **Datos Entrantes** | Pending entity changes to review and action |
| **Historial** | Past import decisions |
| **Configuración de Reglas** | Manage mapping and override rules |

---

### Core User Flows

#### 1. Reviewing Incoming Data
- User sees a table of pending entities grouped by type (clients, operations, etc.)
- Each row shows: provider value → AWM interpretation → current AWM value → proposed final value
- User actions per field: **Accept**, **Ignore**, **Manual override**
- Bulk selection for mass import

#### 2. Conflict Resolution
- When provider data conflicts with existing AWM data, user decides field-by-field
- Inline editing: click row to expand editor below, with "use this value" shortcuts
- After resolving, row status updates from "En revisión" → "Listo para importar"
- Unsaved changes trigger a confirmation warning before navigating away

#### 3. Rule Creation
- After accepting/ignoring a field, user can optionally save the decision as a rule
- **Rule scope options:**
  - This record only
  - All records of this entity type
  - All records from this provider

#### 4. Rule Types

| Type | Behavior |
|---|---|
| **Ignore** | Always keep current AWM value |
| **Overwrite** | Always apply a fixed value |
| **Map** | Convert specific incoming values to AWM values (e.g., "23" → "Persona Física") |
| **Conditional** | Apply logic: if field X = Y, then set field Z to W |

#### 5. Import Execution
- "Importar y pasar al siguiente" for sequential row-by-row processing
- Bulk import via checkboxes for mass operations
- Toast confirmation with 5-second undo option after each import action

---

### Data Display Requirements

Each entity row must show four value states:
1. **Pure provider value** — raw incoming data
2. **AWM interpretation** — after mapping rules applied
3. **Current AWM value** — what exists in the system today
4. **Final value** — editable field representing what will be imported

---

### Special Cases

- **New entities** — appear as new rows; user accepts or rejects creation in AWM
- **Deleted by provider** — requires confirmation dialog before removing from AWM
- **Grouped operations** (e.g., dividends) — 5–6 related transactions that must be imported as a block, configured individually but actioned together
- **Unmatched codes** — user manually maps provider ID to AWM entity; system remembers the mapping for future imports

---

### Rules Configuration Screen

- Central list of all rules with filter and search
- Actions per rule: create, edit, toggle on/off, delete
- Rules created contextually from within the import flow but managed centrally here
- System-level rules are visible to users but not editable — only toggleable

---

### UX Principles & Interaction Design

#### Layout & Navigation
- Main navigation uses tabs across the four sections
- Breadcrumb hierarchy: Administración → Sistema de Importación
- No full-page transitions for row-level actions — everything resolves inline or in a side drawer

#### Drawer Behavior
- Drawers open from the right for row detail and configuration
- **No dark overlay behind drawers** — page remains interactive
- Drawer includes arrow navigation to move between rows ("1 de 5" position indicator)
- Clicking outside the drawer closes it immediately

#### Inline Editing
- Clicking a row expands an edit panel directly below it
- Table shifts down to accommodate the editor
- Three value options shown with "Usar" buttons to paste into the editable field
- Save/Cancel buttons complete the interaction
- Row icon updates to reflect resolved state after saving

#### Status Indicators
- Icon-based status column instead of multiple text tags:
  - Warning icon = changes pending review
  - Error icon = import blocked, requires action
  - Trash icon = marked for deletion by provider
- Status tag on each row: **"En revisión"** or **"Listo para importar"**

#### Tables
- Horizontal scroll only when absolutely necessary
- Column-based structure for alignment stability
- Compact row height (approx. 36px) for data density
- No external borders — horizontal dividers only for a clean, modern look
- Column headers: lighter background, smaller text, clear hierarchy from row content

#### Filters
- Filter panel accessible via button — does not auto-show
- Active filters displayed as chips below the filter bar
- "Limpiar filtros" resets all to defaults
- Filters update results automatically on selection — no "Aplicar" button needed

#### Empty States
- All sections have defined empty states with explanatory text
- Empty states guide the user toward the next action (e.g., "No hay datos entrantes pendientes")

---

### Content & Copy Conventions

- Interface language: **Spanish**
- Status labels: "En revisión", "Listo para importar", "Error", "Ignorado", "Importado"
- Action labels: "Importar", "Ignorar", "Configurar", "Guardar como regla", "Importar y pasar al siguiente"
- Avoid technical jargon in user-facing labels — use plain operational language

---

### Out of Scope (MVP)

- Provider connection management UI (handled by infrastructure team)
- Full audit log / history screen (future version)
- Advanced conditional rule operators (greater than / less than)
- Import notifications or alert system (future V2)
- Mobile or tablet layouts

---

### Success Criteria

- Back-office user can process a full daily import batch without any database access
- Rules reduce manual decisions over time through automation
- All import decisions are traceable and reversible within the session
- Zero ambiguity about what value will be imported before the user confirms
