---
title: "Chart accessibility"
side_nav_title: "Chart accessibility"
side_nav_order: 7
description: "Visa PDS accessibility guidance shared across the bar, line, heatmap and dumbbell chart components."
---

<!-- Vendored from the Visa Product Design System.
     Sources: https://design.visa.com/data-visualization/charts/bar-chart/accessibility
              https://design.visa.com/data-visualization/charts/line-chart/accessibility
              https://design.visa.com/data-visualization/charts/heatmap/accessibility
              https://design.visa.com/data-visualization/charts/dumbbell-plot/accessibility
     Retrieved: 2026-07-30
     Reference only - AFI rules live in docs/rules/data-viz-skill.md.
     Reconstructed from the live pages: the four per-chart accessibility sub-pages
     were absent from the original markdown export. Prose is shared across all
     four pages; the keyboard tables are per-chart and reproduced separately. -->

These chart components have built-in accessibility features: descriptive tag properties, keyboard navigation controls, and tools to ensure sufficient colour contrast.

## Best practices

### Make thoughtful colour choices

Ensure users of all abilities can understand the meaning of colours in your data visualization. Choose colour combinations that provide sufficient contrast and add textures to support colour-blind and low-vision users.

### Use accessible colour palettes

The data visualization colour palettes are designed so data distinctions remain clear for users with various types of colour vision deficiency. Use this functionality to ensure sufficient contrast between colours and avoid relying only on colour to differentiate categories or values.

For example, the Visa red-to-green divergent palette ensures all shades read as different values even under colour-blindness simulators, while a default red-to-green palette doesn't make the shades distinct enough across the full range.

- **Do:** use colour pairings that distinguish between colours to support different forms of colour blindness.
- **Don't:** use colour combinations known to cause issues for users with colour blindness, like certain reds and greens.

### Add contrast with textures

Textures help differentiate categories when colour doesn't provide enough contrast. Use the texture fill option to improve accessibility for users with colour vision deficiencies and maintain clarity when charts are printed in greyscale.

- **Do:** use textures as well as colour to represent categories.
- **Don't:** use colour alone to distinguish between categories.

### Outline light objects

The chart components automatically add darker outlines to light-coloured chart elements to ensure contrast and visibility against backgrounds and adjacent marks. Overriding this default makes elements harder to distinguish from the chart background and reduces readability.

- **Do:** ensure light-coloured bars on a light background have an outline that meets contrast requirements.
- **Don't:** use light-coloured bars against a light background, or remove the default outline.

## Write clear alternative text

Use the chart components' descriptive tag properties to provide concise, informative alternative text for screen readers.

A table that provides guidance for writing chart accessibility properties.

| Accessibility property | Guidance | Example |
| --- | --- | --- |
| `longDescription` | Summarize what the chart shows and the type of data.<br/>Use simple language for straightforward charts. Describe the layout for uncommon chart types.<br/>Avoid repeating the chart title or subtitle. | "This bar chart shows monthly payment volume for this year compared to last year."<br/>"This strip chart displays transaction volume across major European cities, with each city represented by a circle placed according to spending volume." |
| `statisticalNotes` | Clearly state the takeaway and highlight key statistical insights and trends.<br/>Group data points to show patterns or outliers.<br/>Do not list numbers without explaining their meaning. | "Sales numbers increased every month except June and July."<br/>"Europe and Asia Pacific had over 5% growth, while Asia Pacific lagged the global average at 1%." |
| `contextExplanation` | Explain which controls or filters affect the chart.<br/>Communicate any selections that have been applied to exclude or change the displayed data. | "The values in this chart are based on the filter selections applied to the dashboard." |
| `structureNotes` | Note special visual features not covered elsewhere, such as sorting or colour grouping.<br/>Use only if previous fields do not fully describe the chart. | "Sorting is applied to show highest values first. Bars that are above average are highlighted in dark blue and all other bars are gray." |

## Add descriptive labels for data

Use the chart components' custom labelling options to provide clear, descriptive names for displayed data. Labels like `num_transactions` may work during analysis, but "Number of transactions" is easier for users to understand and interpret.

- **Data labels** — the textual representation of data values in charts or tables. Use descriptive labels when presenting data to end users; avoid technical jargon or shorthand that may confuse non-technical audiences.
- **Tooltips** — add contextual information about data points when users hover or focus on chart elements. Clear, descriptive labels in tooltips help users understand the meaning of the data without knowing internal naming conventions.

## Keyboard controls

The key bindings are consistent across chart types; the described behaviour is worded per chart type. Note that `Control+Shift` appears on every chart and is required for VoiceOver on macOS.

### Bar chart

| Key | Behavior |
| --- | --- |
| `Enter` | Enter the chart area / drill down a level on the chart area or a bar group. |
| `Shift+Enter` | Drill up a level on a bar group or a bar. |
| `←→` | Move among sibling bar groups or bars when focusing on a bar group or a bar. |
| `Control+Shift` | Press and hold when using the arrow keys for the best navigation experience on a Mac (VoiceOver). |
| `Esc` | Dismiss the tooltip at any time. |
| `Tab` | Exit the chart at any time. |

### Line chart

| Key | Behavior |
| --- | --- |
| `Enter` | Enter the chart area / drill down a level on the chart area or a line. |
| `Shift+Enter` | Drill up a level on a line or a point. |
| `←→` | Move among sibling lines or points when focusing on a line or a point. |
| `↑↓` | Move among points across lines when focusing on a line or a point. |
| `Control+Shift` | Press and hold when using the arrow keys for the best navigation experience on a Mac (VoiceOver). |
| `Esc` | Dismiss the tooltip at any time. |
| `Tab` | Exit the chart at any time. |

### Heatmap

| Key | Behavior |
| --- | --- |
| `Enter` | Enter the chart area / drill down a level on the chart area or a row. |
| `Shift+Enter` | Drill up a level on a row or a cell. |
| `←→` | Move among cells across rows when focusing on a row or a cell. |
| `↑↓` | Move among cells across rows when focusing on a row or a cell. |
| `Control+Shift` | Press and hold when using the arrow keys for the best navigation experience on a Mac (VoiceOver). |
| `Esc` | Dismiss the tooltip at any time. |
| `Tab` | Exit the chart at any time. |

**Note (Coherence):** Visa's heatmap page gives `←→` and `↑↓` identical descriptions. That reads as a documentation slip on their side. Coherence implements `←→` as horizontal movement within a row and `↑↓` as vertical movement across rows — see `docs/rules/data-viz-skill.md`.

### Dumbbell plot

| Key | Behavior |
| --- | --- |
| `Enter` | Enter the chart area / drill down a level on the chart area or a group. |
| `Shift+Enter` | Drill up a level on a node or a dumbbell. |
| `←→` | Move among sibling nodes or dumbbells when focusing on a node or a dumbbell. |
| `Control+Shift` | Press and hold when using the arrow keys for the best navigation experience on a Mac (VoiceOver). |
| `Esc` | Dismiss the tooltip at any time. |
| `Tab` | Exit the chart at any time. |
