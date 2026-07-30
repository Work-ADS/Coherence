---
title: "Heatmap"
tab_title: "Usage"
side_nav_order: 2
description: "Chart where each cell shows the value of a category pairing, highlighting the most and least common combinations."
meta_description: "Learn how to use heatmaps to show the size of values within a matrix."
page_size: "medium"
thumbnail: "https://design.visa.com/assets/data-visualization/chart-components/heatmap-sm.svg"
tags: []
full_width: false
show_table_of_contents: true
keywords: ["Highlight table", "matrix chart", "mosaic plot", "density plot"]
filter: {"category":["correlation"]}
related: {"charts":[{"id":"design-visualization-guidelines/overview","collection":"data-visualization"},{"id":"charts/bar-chart","collection":"data-visualization"}],"components":[],"content":[],"patterns":[]}
---

<!-- Vendored from the Visa Product Design System.
     Source: https://design.visa.com/data-visualization/charts/heatmap
     Retrieved: 2026-07-30
     Reference only - AFI rules live in docs/rules/data-viz-skill.md.
     Tables flattened by the original export were re-pulled from the live
     page and restored; prose is otherwise untouched. Images are remote URLs. -->

Heatmaps use a grid of colored cells to represent numeric values at the intersection of two categories. Rows and columns represent values of the categorical variables, using colors to represent the numeric value for each category pairing and reveal the most and least common combinations.
<br/>
Also known as: Highlight table, matrix chart, mosaic plot, density plot.

## Anatomy

<img src="https://design.visa.com/assets/data-visualization/usage/heatmap/heatmap-anatomy.svg" alt="A heatmap displaying weekly data with values ranging from 66 to 130. Callout A indicating the optional title, callout B indicating the optional data table button, callout C indicating the required keyboard instructions, callout D indicating the optional subtitle, callout E indicating the required plot canvas, callout F indicating the required data markers, callout G indicating the required vertical axis, callout H indicating the required horizontal axis, and callout I indicating the optional legend"/>

**A. Title (optional):** Brief text summarizing the contents of the chart.<br/>
**B. Data table button (optional):** UI icon button enabling users to view the chart's data in table format.<br/>
**C. Keyboard instructions (required):** UI icon button enabling users to access the chart's keyboard navigation instructions.<br/>
**D. Subtitle (optional):** Additional text providing more details.<br/>
**E. Plot canvas (required):** Area containing the graphic part of the chart including heatmap cells, axes, and other elements.<br/>
**F. Data markers (required):** Colored cells representing the numeric value for a category pairing.<br/> 
**G. Vertical axis (required):** Scale representing a category, group, or date period.<br/>
**H. Horizontal axis (required):** Scale representing a category, group, or date period.<br/>
**I. Legend (optional):** Explains how to interpret the color scale used in the heatmap cells.<br/>

## Usage

A table that displays when to use and when not to use different component variants.

- When to use: To show patterns or clusters in data visually, making it easy to spot high and low values.
- When not to use: When precise comparisons between individual data points are required. Consider using a [bar chart](https://design.visa.com/data-visualization/charts/bar-chart) or dot plot instead.

- When to use: To summarize large numeric datasets across two dimensions (e.g., categories or time intervals).
- When not to use: When the dataset has extreme outliers that distort the color scale. Consider using a [dumbbell plot](https://design.visa.com/data-visualization/charts/dumbbell-plot) instead.

- When to use: When the goal is to highlight variation and distribution rather than precise individual values.
- When not to use: When the numeric variable shows little variation, as color differences will be hard to interpret. Consider using a [bar chart](https://design.visa.com/data-visualization/charts/bar-chart) instead.

- When to use: To quickly identify correlations or relationships between variables.
- When not to use: When comparing too many categories, which can make the heatmap cluttered. Consider grouping or filtering categories.

<br/>

## Best practices
- Include a legend unless data labels are included in every cell.

## Content

- Always use sentence case except for proper nouns or acronyms.
- Use plain language and avoid abbreviations or jargon.
- Provide more detailed explanations and definitions for any complex metrics if needed.
- Reference [Content](https://design.visa.com/content) for additional guidance on crafting content within apps and experiences. 

### Titles and subtitles

- Use clear, informative titles to help users understand the chart’s topic and key takeaways.
- Frame titles as a headline that summarizes the trend or insight.
- Use subtitles to add more detail about the data being shown and help users understand how to interpret the chart.
- Consider phrasing titles or subtitles as questions to guide the user’s analysis, especially on exploratory dashboards where users are likely to spend significant time analyzing data. 
- Avoid titles and subtitles that are too general or vague.

### Labels

- Ensure numbers, dates, and other data or axis labels are formatted consistently.
- Follow plain language principles, such as using shorter and simpler words and phrases.

#### Number format

Simplify number formats to remove unnecessary details and reduce the mental effort needed to compare numbers. If needed, provide higher-precision numbers in a tooltip for users who want more information.

A table that displays recommended number formats for different data types.

| Data type | Recommended format |
| --- | --- |
| Large numbers | Use abbreviated format, such as 1.2k instead of 1,200. |
| Percentage | Use whole percentage points, except for special cases where basis points are needed. |
| Basis points | Use basis points (bps) when change percentage is very small. 1 bps equals 0.01% (0.0001 in decimal format). |
| Currency | Round to the appropriate level of detail that is required for the analysis. For example, for U.S. currency round to the nearest dollar amount. |

