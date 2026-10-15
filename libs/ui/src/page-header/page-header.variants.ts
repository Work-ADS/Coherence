export type PageHeaderLevel = 'page' | 'section' | 'subsection';
/** Section and subsection only. `framed` is the outline box; `plain` removes it (what `borderless` did). */
export type PageHeaderAppearance = 'framed' | 'plain';

/** Section and subsection only. `end` keeps title and actions on one row at every width; the title ellipsizes. */
export type PageHeaderActionsPlacement = 'inline' | 'end';

export type PageHeaderDensity = 'compact' | 'default';

/** Where the actions go when the header is too narrow for them beside the title. */
export type PageHeaderCompactPlacement = 'after-title' | 'after-description';
