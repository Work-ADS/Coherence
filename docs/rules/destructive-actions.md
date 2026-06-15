# Destructive actions — skill

> Source-of-truth rule for any UI affordance whose primary effect is to **delete, remove, archive, or otherwise discard** user data or work.
> Loaded by Builder before wiring up Borrar / Eliminar / Archivar / Vaciar / Resetear actions.
> Cross-referenced from [accessibility.md](./accessibility.md), [component-skill.md](./component-skill.md), and [copy-skill.md](./copy-skill.md).

---

## 1. The rule (LOCKED)

**Every destructive action must require an explicit confirmation step before it executes.** No silent deletes, no "click and it's gone" shortcuts, no `confirm()` browser dialogs.

This applies whenever the action would:

- delete a row from a table (per-row trash icon, bulk Borrar);
- remove a saved item from a list or canvas;
- discard unsaved form work that took >5 seconds to enter (close-with-changes);
- archive in a way the user can't easily restore from the same screen;
- reset or wipe state (clear filters that hold meaningful work, "Empezar de cero").

It does NOT apply to reversible UI state — toggling a filter, collapsing a section, switching tabs.

---

## 2. The confirmation modal — shape

Use the `<afi-modal>` primitive at `size="sm"` with this exact composition:

```html
<afi-modal
  [open]="confirmOpen()"
  size="sm"
  title="¿Borrar {{ thing.name }}?"
  [closeOnEsc]="true"
  [closeOnBackdrop]="false"
  (openChange)="$event ? null : cancelConfirm()"
>
  <p class="text-body-md-400 text-foreground-secondary">
    Esta acción no se puede deshacer.
    <!-- Optional second line: what the user loses.
         Keep to one sentence. No legalese. -->
  </p>

  <ng-container slot="footer">
    <afi-button variant="ghost" size="md" (clicked)="cancelConfirm()">
      Cancelar
    </afi-button>
    <afi-button variant="danger" size="md" (clicked)="confirmDelete()">
      Borrar
    </afi-button>
  </ng-container>
</afi-modal>
```

Required pieces:

- `size="sm"` — confirm dialogs are short. No `md` / `lg` for destructive confirms.
- `[closeOnBackdrop]="false"` — backdrop clicks must NOT confirm or cancel. ESC cancels; explicit button confirms.
- Danger-variant primary button on the right. The Cancelar (ghost) is the safe default; the danger button is the deliberate one.
- Title asks the question; body states the consequence in one sentence.

---

## 3. Copy (RAE Spanish, formal `usted`)

| Slot | Pattern | Examples |
|---|---|---|
| Title | `¿{Verb} {thing}?` | `¿Borrar Inversiones Siglo XXI, SL?` · `¿Eliminar el ingreso "Salario"?` · `¿Archivar la propuesta SIM-2025-0011?` |
| Body (line 1) | `Esta acción no se puede deshacer.` | Always. Drop nothing else here. |
| Body (line 2, optional) | What disappears with it. | `Se borrarán también sus 4 participantes.` · `El cliente perderá su histórico de simulaciones.` |
| Confirm button | The verb that matches the action. | `Borrar` · `Eliminar` · `Archivar` · `Restablecer` |
| Cancel button | Always `Cancelar`. | — |

**Do not** soften ("Are you sure?" / "Confirma que…"). Ask the question, name the consequence, present the choice.

**Do not** stack consequences in a bullet list inside the body — if you need a list, the action is probably too coarse-grained; split it into smaller actions.

Glossary: stay consistent with [copy-skill.md](./copy-skill.md). When in doubt: `Borrar` (per-item delete), `Eliminar` (system-level, e.g. usuario), `Archivar` (reversible from another screen), `Vaciar` (bulk clear with no individual undo).

---

## 4. Keyboard

- **ESC** → cancel (returns focus to the trigger).
- **Enter** → confirm (when the danger button has focus OR when no input is focused inside the modal).
- **Tab** → cycles between Cancelar and Confirm; focus is trapped inside the modal.
- **First focus on open** → Cancelar button. The safe default holds focus, so a stray Enter does not delete.

`<afi-modal>` handles trap + ESC. The page binds `(keydown.enter)` on the modal body to call the confirm method.

---

## 5. Accessibility

- `<afi-modal>` already sets `role="dialog"`, `aria-modal="true"`, and the focus trap; no extra ARIA wiring needed at the page level.
- The danger button uses `variant="danger"` — color is NOT the only signal. Use `Borrar` as the explicit verb, not a trash icon alone.
- If the trigger is icon-only (e.g. the trash icon in an `<afi-table>` row), it must carry `ariaLabel` describing the target: `aria-label="Borrar sociedad"` not just `aria-label="Borrar"`.

See [accessibility.md § Modal](./accessibility.md) for the modal-level checklist (focus trap, ESC, aria-labelledby).

---

## 6. Action toast — receipt + undo (REQUIRED on Add, Delete, and any persistent mutation)

After any persistent mutation (Add, Delete, Archive), **show an `<afi-toast>` that names what just happened AND offers `Deshacer · ⌘ Z`**. No exceptions. The toast is both the receipt and the safety net for a user who realises a half-second too late they meant the other row.

This is one unified pattern across Add and Delete — same toast component, same shortcut, same shape — so the user learns it once.

```html
<afi-toast
  [visible]="actionToastVisible()"
  [message]="actionToastMessage()"
  [showUndo]="true"
  [shortcut]="undoShortcut"
  undoLabel="Deshacer"
  (undo)="undoLastAction()"
  (dismissed)="dismissActionToast()"
/>
```

```ts
readonly undoShortcut: string[] = ['⌘', 'Z'];
```

Rules:

- **Use the DS primitive `<afi-toast>` from `@coherence/ui`.** Never `site-action-toast` (older demo-shell wrapper) for new pages.
- **Message:** past-participle naming what happened. Examples: `{Thing} añadida`, `{Thing} borrada`, `{Thing} eliminada`, `{Thing} archivada`. Use the row's own name when known (`Inversiones Siglo XXI, SL borrada`); fall back to the type (`Sociedad sin nombre borrada`) when it isn't.
- **`[showUndo]="true"` always.** Even after a confirmation modal — the modal asks consent, the toast offers a take-back. They are different layers, not duplicates.
- **`[shortcut]="['⌘', 'Z']"` always.** The chip is display-only; the consumer wires the actual binding (see § 7).
- **Auto-dismiss:** ~5 seconds. The parent owns the timer (the toast is stateless). Clear the timer on a new toast firing so back-to-back actions don't pile up.
- **Position:** the primitive pins itself bottom-center via `position: fixed`. Render it as a sibling of the page content, outside the shell wrapper but inside the route component, so it tracks the route lifecycle.

The toast is not optional and is not gated by "destructive" — it fires after Add too, because the same undo affordance should be available for every persistent mutation. Coexists with the destructive-confirm modal: modal asks consent, toast offers undo.

---

## 7. Keyboard binding for undo — `document:keydown` (REQUIRED)

The toast chip is display-only. Wire the actual binding via `@HostListener('document:keydown')` on the route component. The handler:

- guards on the toast being visible AND `lastAction !== null` (so a stray ⌘Z when nothing is undoable is a no-op);
- matches `(meta || ctrl) + 'z'`, no Shift (Shift+⌘Z = redo, which we don't support yet);
- skips when the event target is `INPUT` or `TEXTAREA` so native field-level undo still wins inside a text input.

```ts
@HostListener('document:keydown', ['$event'])
onUndoKeydown(event: KeyboardEvent): void {
  if (!this.actionToastVisible() || this.lastAction() === null) return;
  const isUndo =
    (event.key === 'z' || event.key === 'Z') &&
    (event.metaKey || event.ctrlKey) &&
    !event.shiftKey;
  if (!isUndo) return;
  const tag = (event.target as HTMLElement | null)?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  event.preventDefault();
  this.undoLastAction();
}
```

---

## 8. State machine — recommended shape

For a table page that supports Add + Delete with shared action toast + undo:

```ts
// Destructive confirm state
readonly pendingDeleteId = signal<string | null>(null);
readonly confirmDeleteOpen = computed(() => this.pendingDeleteId() !== null);

// Action toast state (one shared toast for both Add and Delete)
readonly actionToastVisible = signal<boolean>(false);
readonly actionToastMessage = signal<string>('');
readonly undoShortcut: string[] = ['⌘', 'Z'];
private lastAction = signal<
  | { kind: 'add'; addedId: string }
  | { kind: 'delete'; snapshot: Thing }
  | null
>(null);
private actionToastTimer: ReturnType<typeof setTimeout> | null = null;

// Add flow — Guardar fires the toast with kind='add'.
saveDialog(): void {
  const newId = this.pendingAddId();
  this.pendingAddId.set(null);
  this.editingId.set(null);
  if (newId !== null) {
    const added = this.store.things().find((t) => t.id === newId);
    this.lastAction.set({ kind: 'add', addedId: newId });
    this.showActionToast(`${added?.name || 'Sin nombre'} añadido`);
  }
}

// Delete flow — snapshot before removing so undo can restore.
confirmDelete(): void {
  const id = this.pendingDeleteId();
  if (id !== null) {
    const target = this.store.things().find((t) => t.id === id);
    if (target) {
      const snapshot = structuredClone(target); // or deep-copy by hand
      this.store.removeThing(id);
      this.lastAction.set({ kind: 'delete', snapshot });
      this.showActionToast(`${target.name || 'Sin nombre'} borrado`);
    }
  }
  this.pendingDeleteId.set(null);
}

undoLastAction(): void {
  const last = this.lastAction();
  if (last === null) return;
  if (last.kind === 'add') {
    this.store.removeThing(last.addedId);
  } else {
    // Restore via add + populate. Id is not preserved unless the store
    // exposes an insertAt API; user-visible data is.
    const next = this.store.addThing();
    this.store.updateThing(next.id, { ...last.snapshot });
  }
  this.dismissActionToast();
}
```

The table's `(rowActionClicked)` handler dispatches:

```ts
case 'delete':
  this.askDelete(event.row['id'] as string);
  break;
```

Bulk delete uses the same shape, with `lastAction.kind === 'bulk-delete'`, a `snapshot: Thing[]`, and a body line that names the count (`3 gastos borrados`).

---

## 9. Reference implementations

- Sociedades — [apps/site/src/app/pages/demos/sociedades/sociedades.page.html](../../apps/site/src/app/pages/demos/sociedades/sociedades.page.html) — per-row Borrar with `afi-modal` confirm. Canonical example.
- Gastos — [apps/site/src/app/pages/demos/gastos/gastos.page.html](../../apps/site/src/app/pages/demos/gastos/gastos.page.html) — per-row + bulk delete confirm. Reference for bulk variant.

---

## 10. Anti-patterns (do not do these)

- ❌ Native `window.confirm()` or `prompt()` — breaks brand, focus, a11y, and theming.
- ❌ Inline "Are you sure?" tooltip-style hover. Persistent confirmation must be a modal so the page can't change underneath it.
- ❌ Two-click destructive buttons ("click again to confirm"). Easy to mis-tap, no consequence statement, no a11y story.
- ❌ Toast-with-undo as the ONLY safety net for delete. Undo toasts are a *recovery* layer; the confirmation modal is the *consent* layer. Both run — modal first, toast after.
- ❌ Silent delete with no toast. The receipt is required (see § 6).
- ❌ Auto-confirming after a delay ("deleting in 3… 2… 1…"). Confusing, accessible only to fast readers, demos badly.

---

## 11. When the action is genuinely instant + low-stakes

Some "destructive" actions are non-destructive in practice: removing a chip from a filter bar, dismissing an empty draft, clearing a single search term. Skip the modal. The test:

> Could the user, 30 seconds later, want this back AND not be able to reproduce it by retyping or reselecting?

If the answer is "yes" → confirm. If "no" → silent action + optional toast with Deshacer.

---

*Locked 2026-06-15. Loaded by Builder before any Borrar/Eliminar/Archivar wiring.*
