# AI design-to-code SOP

How we run an AI-driven project from "engineer starts a screen" to "client has the design + programmers have the code."

---

## Roles

- **Engineer** — drives Claude Code on the project. Loads the brand URL.
- **Design lead (Richard)** — maintains the DS in Claude Design (synced from Coherence). Tweaks final designs in Paper. Owns the round-trip into Coherence.
- **Team lead** — rotates per project. Decides whether a screen goes to designer or ships as-is. Reviews ship-as-is output before client sees it.
- **Programmers** — implement in Coherence using Claude Design output.
- **Client** — reviews and iterates in Figma.

## Tools

- **Claude Code** — Anthropic CLI. Engineering surface.
- **Claude Design** — Claude.ai. DS lives here, synced from the Coherence repo folder.
- **Figma** — client review surface.
- **HTML→Figma** — imports AI HTML output into Figma.
- **Paper** ([paper.design](https://paper.design)) — Figma-like tool that builds on HTML/CSS. Visual tweaks emit real code.
- **Coherence** — demo codebase. Handoff target.

---

## The flow

1. **Engineer starts the project.** Loads the brand URL into Claude Code.

2. **Does the DS need updating for this project?**
   - **Yes** → Richard syncs Coherence DS to Claude Design first, then continue.
   - **No** → continue.

3. **Engineer runs the project in Claude Code.** First version of the screen lands.

4. **Send to designer to fine-tune?** Default is yes for anything client-facing. Team lead has the final call.
   - **No** → Team lead reviews the engineer's output. Then client gets the design. *Done.*
   - **Yes** → continue.

5. **Engineer shares the Claude design with Richard.** Prompt: *"Package this into a prompt so we can export to code."*

6. **AFI version, or different brand?**
   - **AFI** → design with components, then go to step 8.
   - **Other brand** → if the brand has a DS, design with components. If not, brand creation is its own parallel project — use AFI defaults as a stand-in for now.

7. **Design with components.**

8. **Tweak final design in Paper.** Code updates as a side effect and lands in Coherence — programmers see the interaction in code, not just static Figma frames.

9. **Client gets the design.**

---

## The design ↔ code round-trip (inside step 8)

1. Claude Design produces HTML.
2. HTML→Figma imports it for client review.
3. Client iterates in Figma.
4. Richard tweaks the final design in Paper.
5. Code updates land in Coherence.
6. Repeat until handoff.

---

## Cheat sheet — when in doubt

- **Client-facing project?** Designer path by default. Team lead can override.
- **Quick experiment or internal tool?** Ship as-is. Team lead reviews before client sees it.
- **New brand we don't have yet?** Brand creation is its own project. Use AFI defaults as stand-in; don't block the demo.
- **DS changed recently?** Richard syncs Coherence → Claude Design before the engineer starts.
