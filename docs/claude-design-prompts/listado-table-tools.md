# Pattern — listado with table tools

> Prepend [`_foundation.md`](./_foundation.md) before using this.
>
> Related: [`page-section-layout.md`](./page-section-layout.md) for the page
> header and the content rail, [`responsive-canvas.md`](./responsive-canvas.md)
> for the breakpoints, and [`multi-select-menu.md`](./multi-select-menu.md) for
> the checkbox menu the column chooser is built from.
> [`listado-product-shell.md`](./listado-product-shell.md) is the rejected
> alternative — a tinted shell around the same list. Don't combine them.
>
> Catalog: [`page-structure-skill.md`](../rules/page-structure-skill.md) §3, §4,
> §11; [`motion-skill.md`](../rules/motion-skill.md) §4.1 (`hover-tint`), §4.3
> (`focus-ring`), §4.13 (`selection-slide`, for the density control).
>
> **Proposed, not built — but every part exists.** This is an assembly of
> shipped v1 primitives, not new components. `afi-table` already does sorting,
> two densities and row actions; nothing below asks it to do anything it can't.
> The three gaps are listed at the end, and one of them is the reason this file
> exists rather than a ticket.
>
> **Structure and interaction only.** Colour and type come from the design
> system you already have, named here by role. Component names are given because
> the point of this brief is to reuse what exists, not to invent shapes.

**Use for** — the listado de planificaciones, rebuilt as a working table rather
than a display surface. It assumes the wealth manager knows what they're looking
for and wants to get at it: sort any column, choose the columns, choose the row
height, see more rows per screen than anything else in the product.

This is the **low-opinion** option on purpose. Other designs for this screen
decide which columns matter; this one hands that decision to the person using it
and optimises for rows-per-screen instead.

![Listado with table tools](./listado-table-tools.png)

*Reference render, 1440px, at rest: `compact` density, the default column set
(Código and Creada hidden — the chooser shows 2), sorted by Modificada
descending.*

---

## Anatomy

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Afi ∞  Wealth Planner                                    [GA] Gestor afi ▾   │  top bar
├──────────────────────────────────────────────────────────────────────────────┤
│ Planificaciones                                                              │  page header
│                          [ Buscar…  ] [Cómoda|Compacta] [▥] [Nueva planif.]  │  filters + action
├──────────────────────────────────────────────────────────────────────────────┤
│ Nombre ⇅   Código    Cliente        Estado ⇅   Patrimonio  Creada  Modif. ↓  │
│ ──────────────────────────────────────────────────────────────────────────── │
│ Borja PFC  Zx4bryqG  Borja Fonc…    • Borr.    2.412.000 €  02/05  23/07 8:33│
│ Sergio     Z2h6tjqz  Sergio Gómez   • Desc.      880.400 €  24/02  22/07 18:37│
│ KzK37FnJ   KzK37FnJ  Elena Ruiz     • Desc.             —   22/07  22/07 17:46│
└──────────────────────────────────────────────────────────────────────────────┘
```

No tinted ground, no floating card, no container around the table. The page is
the default surface and the table sits flush in it, closed top and bottom by its
own rules.

---

## Component map

Build it from these. Nothing here needs a new component.

| Part | Component | Notes |
|---|---|---|
| Top bar | `afi-top-bar` | `variant="solid"`. Slots: `start`, `center`, `end`. **`center` stays empty.** |
| Brand | `coherence-logo` + a label | In `slot=start`. |
| Account control | `afi-avatar` + `afi-menu` | In `slot=end`. Avatar takes `name` and derives initials. |
| Page header | `afi-page-header` | `title`, `count`, `level="page"`. |
| Page action | `afi-button` | `variant="primary" size="sm"`, in `slot=actions`. **One only.** |
| Search | `afi-search` | `size="sm"`, in `slot=filters`. |
| Density control | `afi-segmented-control` | `size="sm"`, in `slot=filters`. Options are `{value, label}`. |
| Column chooser | `afi-icon-button` + `afi-menu` + `afi-checkbox` | In `slot=filters`. Trigger is `variant="ghost"`, with `expanded` bound to the menu. |
| Table | `afi-table` | See below. |
| Estado cell | `afi-badge` | Via `cellTemplates`, **not `afi-status-chip`** — see Gaps. |
| Rename | `afi-inline-edit` | Via `cellTemplates` on the Nombre column. |
| Tooltips | `afi-tooltip` | On the column-chooser trigger. |

**Do not reach for `afi-table-apron`.** It is a v2 component that only renders
correctly inside `[data-foundation="modern"]`, and this is a v1 page. Its job —
result count and active filters — is done here by the page header's `count`.

---

## 1. The top bar

Two zones, and the middle one is deliberately empty.

- **Start:** the brand mark and "Wealth Planner".
- **Centre:** nothing. *There is no global search in this design.* Search is a
  page-level control and lives in the page header with the other table tools.
- **End:** one account control — avatar with the gestor's initials, their name,
  and a chevron opening a menu. **No notification bell.**

That end control replaces the two plain text labels ("Cliente: afi | Gestor:
afi") the screen has today. Client is not top-bar chrome on this screen: with no
plan open there is no single client, and the list spans all of them.

---

## 2. The page header

`afi-page-header` with the title, the live result count, and two slots.

**`slot=actions`** takes exactly one control: the primary button. This is a
locked rule — the actions slot is for the one page-wide action, never for table
controls.

**`slot=filters`** takes the three table tools, in this order, pushed to the
trailing edge:

1. **Search** — one field over name, client and code. It grows to fill the space
   left by the other two.
2. **Density** — the segmented control.
3. **Columns** — an icon button opening the chooser.

The order is loosest-to-tightest scope: search changes which rows, density
changes how they're drawn, columns change what's drawn. Keep it.

> **Decision to confirm.** The search field is here because the global search in
> the top bar was cut, and without either one the screen has no way to find a
> plan by name. If you would rather the list rely on sorting alone, delete it —
> but delete it knowingly, not by omission.

---

## 3. The table

`afi-table`, with the page owning all state — it does not sort or filter itself.

| Input | Value |
|---|---|
| `columns` | The visible columns, in order. The page filters this array; see §5. |
| `rows` | The current page of rows. |
| `sortBy` / `sortChange` | `{key, direction}`. Default sort is Modificada, descending. |
| `density` | `'comfortable'` or `'compact'`; see §4. |
| `rowActions` | Duplicar, Renombrar, Archivar. |
| `actionsReveal` | `'hover'` |
| `rowClicked` | Opens the plan. **The whole row is the target.** |
| `emptyText` | See §6. |

**Columns.** Seven, all sortable except Progreso:

| Column | Notes |
|---|---|
| Nombre | The rename control lives here. When a plan was never named it falls back to its code — set that in the monospace face and the quiet tone so an unnamed plan reads as unnamed, not as a bad name. |
| Código | The support identifier. Monospace, quiet tone. Hidden by default — see §5. |
| Cliente | Full name. |
| Estado | Borrador · Cumplimentada · Descargada · Archivada. |
| Patrimonio | Trailing-aligned, tabular figures. An em dash when the plan has not reached the figure — never a zero. |
| Creada | Date only. Hidden by default. |
| Modificada | Date and time. The default sort column. |

**Rules stay on.** Header rule, a rule between every row, and a rule closing the
last row. The table reads as one surface, not as an object inside another.

---

## 4. Density

The control has **exactly two options**, because the component has exactly two
values:

| Option | Component value | Cell block padding | Row |
|---|---|---|---|
| Cómoda | `comfortable` | the small space step | 44px |
| Compacta | `compact` | the extra-small step | 36px |

Order them loose-to-tight. **Compacta is the default** — it is the component's
own default, and this design exists to show more rows.

Do not invent a third, denser option. 36px is already below the 44px minimum
touch target, which is why the next rule exists:

**Density is a desktop affordance.** Below the tablet breakpoint the control
disappears and the table returns to `comfortable` regardless of what was chosen.
The preference persists per user and is re-applied when the viewport widens
again.

---

## 5. The column chooser

An icon button in `slot=filters` opening a menu of checkboxes, one per optional
column, each showing the column's own header label.

- **Nombre and Estado cannot be hidden.** Their checkboxes are present but
  disabled — a list with no name and no state is not a list. Everything else is
  optional.
- **Toggling applies immediately.** No Apply button, no cancel. The menu stays
  open so several columns can be changed in one visit.
- **Código and Creada start hidden.** They are the two columns the current screen
  wastes width on. They stay available for whoever needs them with support.
- The trigger shows how many optional columns are hidden, if any.
- The chooser hides and shows columns; **it does not reorder them.** Column order
  is fixed by the table.
- The choice persists per user, like density.

Mechanically the page owns the `columns` array and passes a filtered copy. The
table has no column-visibility input and does not need one.

---

## 6. Empty, loading and no-results

Three different states, and they must not collapse into one message.

- **No planificaciones at all** — the page-structure empty state inside the table
  area, with the primary action repeated in it.
- **Loading** — the table's own loading state. The header, search and controls
  stay interactive.
- **Search or filter returned nothing** — *not* the empty state. It says what was
  searched and offers to clear it, because the fix is to change the query, not
  to create a planificación.

---

## 7. Narrow screens (≤ 768px)

In order:

1. **The density control goes**, and the table returns to `comfortable` (§4).
2. **The column chooser goes**, and the default column set is restored — a column
   chooser you cannot see the result of is worse than none.
3. **Search stays.** It is the last control standing, and on a small screen it is
   the only practical way through the list.
4. The table follows whatever collapse rule it already has.

---

## Motion

| Change | Behaviour |
|---|---|
| Density change | Rows resize instantly. **Do not animate row height** — it reflows layout, and a table that grows under the cursor loses the row the user was aiming at. |
| Column shown or hidden | Instant. Same reason. |
| Sort change | The rows re-render; the header's sort indicator rotates at the fast duration. |
| Column-chooser menu | The standard overlay reveal. |
| Density indicator | The segmented control's own indicator slide. |
| Row hover | Tint only, at the fast duration. |
| Search | Results settle after the field goes quiet, not on every keystroke. |

## Reduced motion

The sort indicator changes instantly, the menu appears in place, the density
indicator moves instantly. Row tint changes with no transition. Nothing in this
screen travels.

---

## Gaps — read before building

Three, and the first is the one that turns this from a ticket into a brief.

1. **`afi-status-chip` cannot render two of the four estados.** Its vocabulary is
   borrador, pendiente, aprobada, rechazada, ejecutada, cancelada, en revisión,
   archivada. The real screen shows **Cumplimentada** and **Descargada**, and
   neither exists. That is why this brief specifies `afi-badge` for the estado
   cell — `afi-badge` takes any text. It is a workaround, and it means the
   listado sits outside the component that owns state everywhere else in the
   product. **Either the primitive's vocabulary grows by two, or this stays a
   permanent exception.** Decide before building, not after.

2. **There is no pagination component.** The live screen has results-per-page,
   "Mostrando 1 a 20 de 20", and previous/next. Nothing in the library does that,
   and this brief does not draw it. Either the list loads in full and the count
   in the page header is enough, or pagination becomes a component first.

3. **Two data questions, still unanswered.** Can the listado return each plan's
   patrimonio? If not, that column is an em dash on every row and should be cut
   from the default set. And is there a "complete but not yet exported" state
   behind *Cumplimentada*? The estado column's whole vocabulary depends on it.
