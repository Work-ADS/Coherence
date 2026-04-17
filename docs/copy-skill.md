# Copy skill — agent rules for writing Spanish UI copy

> Consulted before any user-facing string ships. The DS site is Spanish; AFI products are Spanish.

## Dual-mode posture (LOCKED 2026-04-16)

- **Input language:** team talks to agents in English, Spanish, or mixed. Agents answer in the team's language.
- **Output language** (UI strings, labels, human-facing docs): always Spanish, RAE-compliant.
- **Rule of thumb:** if the string renders to code (variables, classes, logs), English. If it renders to a human, Spanish.

## RAE baseline

Agents follow the current rules of the Real Academia Española (*Diccionario de la lengua española*, *Ortografía*, *Nueva Gramática*, *DPD*).

### Orthography — the rules that fail most often

1. **Accents are mandatory.** *Más* (adverb) vs *mas* (conjunction). *Sí* (affirmation) vs *si* (conditional). *Té* vs *te*. *Sólo* is no longer recommended as an accented form (post-2010) — write *solo*.
2. **Capital letters take accents.** *Éxito*, *Último*, *África*. Never strip the accent from caps.
3. **Inverted punctuation.** Every question opens with `¿` and closes with `?`. Every exclamation opens with `¡` and closes with `!`. Mid-sentence: *"Esto es correcto, ¿no?"*
4. **`ñ`**, never ASCII `n`. Never `tilde-n`.
5. **No English quotation marks.** Use `«»` for primary quotes, `" "` for nested. `' '` is not Spanish.
6. **Numbers use `.` for thousands and `,` for decimals** in general Spanish (RAE 2010 update allows space separator; pick comma-decimal for AFI). *1.250,50 €*, not *1,250.50*.

### Grammar — the rules that fail most often

1. **No English syntax in Spanish clothing.** *"Hacer clic para aplicar"* is correct. *"Click aquí"* is wrong. *"Logout"* is wrong — *"Cerrar sesión"*.
2. **Ser vs estar.** State vs identity. *"Está guardado"* (state), *"Es correcto"* (property).
3. **Por vs para.** *Por* = cause / means / duration. *Para* = purpose / destination / deadline. *"Para guardar"* (purpose), *"Por error"* (cause).
4. **Gerund only for simultaneous action.** *"Guardando..."* (in-progress save) is correct. *"Regla permitiendo filtros"* (adjectival gerund) is wrong — *"Regla que permite filtros"*.
5. **Formal register.** AWM and AFI products are B2B / professional — default to `usted` and formal imperative (*"Seleccione"*, *"Guarde"*). Never switch to *tú* without a team decision.
6. **No leísmo / laísmo / loísmo.** *"Lo vi"* (to him / it) vs *"Le di el archivo"* (to him — indirect). RAE permits `le` for male direct objects but we write the standard form.

## UI copy register (LOCKED — AWM-class products)

- **Voice:** operator-to-operator. The agent is a colleague, not a marketer. No "¡Bienvenido a tu nuevo panel!" energy.
- **Length:** shortest phrase that stays unambiguous. Verbs over nominalizations. *"Guardar"* beats *"Realizar guardado"*.
- **Error messages:** name the constraint, then the action. *"El archivo supera 5 MB. Reduzca el tamaño y vuelva a intentarlo."* Not *"Error. Inténtelo de nuevo."*
- **Success messages:** past tense + what happened. *"Regla creada."* Not *"¡Éxito!"*.
- **Empty states:** name what's missing + the next step. *"No hay datos entrantes pendientes. Conecte un proveedor para empezar."*
- **Buttons:** infinitive verb (*Guardar*, *Importar*, *Cancelar*) or formal imperative (*Seleccione*). Never *"OK"* or *"Done"*.
- **Warnings before destructive action:** name the consequence. *"Esta acción eliminará 12 reglas. No se puede deshacer."*
- **Status tags:** past participle or adjective, never a full sentence. *"En revisión"*, *"Listo para importar"*, *"Importado"*, *"Ignorado"*.

## AFI glossary (standing conventions)

| English | Spanish (RAE-preferred) | Notes |
|---|---|---|
| Dashboard | Panel | *Tablero* only if product already uses it |
| Sign in | Iniciar sesión | Not *Loguearse* |
| Sign out | Cerrar sesión | |
| Settings | Configuración | Not *Ajustes* in AWM |
| Import (noun) | Importación | Verb: *Importar* |
| Provider | Proveedor | |
| Client | Cliente | |
| Mapping rule | Regla de mapeo | |
| Override (v) | Sobrescribir | Noun: *Sobrescritura* |
| Rollback / Undo | Deshacer | |
| Draft | Borrador | |
| Review | Revisar | Noun: *Revisión* |
| Accept | Aceptar | |
| Reject | Rechazar | |
| Ignore | Ignorar | |
| Email | Correo electrónico (first use) / *correo* (after) | Never *email* in UI |
| Password | Contraseña | Never *password* |
| Username | Nombre de usuario | |
| Filter (v) | Filtrar | Noun: *Filtro* |
| Toggle | Activar / Desactivar | Never *togglear* |
| Search | Buscar | Noun: *Búsqueda* |

Missing a term? Check the RAE dictionary (`dle.rae.es`), then propose an addition.

## Pre-flight checklist (runs before strings ship)

- [ ] All user-facing strings in Spanish
- [ ] Accents correct (including caps)
- [ ] `¿...?` and `¡...!` inverted punctuation present where required
- [ ] Register is formal (*usted*) unless product spec overrides
- [ ] Error messages state constraint + recovery
- [ ] No English loanwords where a RAE-accepted term exists
- [ ] Glossary terms above used consistently
- [ ] Numbers formatted with `.` thousands / `,` decimals

## Anti-patterns (seen in wild, don't)

- *"Aplicá los cambios"* — Rioplatense *vos*. AWM is formal Iberian Spanish.
- *"Loading..."* left in a Spanish UI → *"Cargando..."*
- *"Email"*, *"Password"*, *"OK"*, *"Done"* as labels → always translated
- *"Ver más"* as a CTA with no context → specify: *"Ver todas las reglas"*
- *"Tú puedes..."* in a B2B product → *"Puede..."*
- Literal translation of English gerund patterns: *"Guardando su progreso..."* is fine; *"Regla permitiendo..."* is not — use relative clause

## When a rule doesn't fit

RAE rules evolve. If a recent RAE update changes a spelling or syntax, amend this file and cite the source (RAE bulletin / date / rule). Don't silently deviate.
