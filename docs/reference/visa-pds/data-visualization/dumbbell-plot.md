---
title: "Dumbbell plot"
tab_title: "Usage"
side_nav_order: 2
description: "Chart comparing the difference between two related variables across multiple categories or date periods."
meta_description: "Learn how to use dumbbell plots to compare two related variables across multiple categories."
page_size: "medium"
thumbnail: "https://design.visa.com/assets/data-visualization/chart-components/dumbbell-sm.svg"
tags: []
full_width: false
show_table_of_contents: true
keywords: ["Barbell chart", "connected dot plot"]
filter: {"category":["deviation","trend"]}
related: {"charts":[{"id":"design-visualization-guidelines/overview","collection":"data-visualization"},{"id":"charts/line-chart","collection":"data-visualization"}],"components":[],"content":[],"patterns":[]}
---

<!-- Vendored from the Visa Product Design System.
     Source: https://design.visa.com/data-visualization/charts/dumbbell-plot
     Retrieved: 2026-07-30
     Reference only - AFI rules live in docs/rules/data-viz-skill.md.
     Tables flattened by the original export were re-pulled from the live
     page and restored; prose is otherwise untouched. Images are remote URLs. -->

Dumbbell plots use dots connected by lines to compare the values of two series of data. The position of the dots represents the numeric values, with the length of the line showing the difference or gap between the data series.
<br/>
Also known as: Barbell chart, connected dot plot.

## Anatomy

<img src="https://design.visa.com/assets/data-visualization/usage/dumbbell-plot/dumbbell-anatomy.svg" alt="A dumbbell plot displaying monthly data with values. Callout A indicating the optional title, callout B indicating the optional data table button, callout C indicating the required keyboard instructions, callout D indicating the optional subtitle, callout E indicating the optional legend, callout F indicating the required plot canvas, callout G indicating the required data markers, callout H indicating the required vertical axis, and callout I indicating the required horizontal axis"/>

**A. Title (optional):** Brief text summarizing the contents of the chart.<br/>
**B. Data table button (optional):** UI icon button enabling users to view the chart's data in table format.<br/>
**C. Keyboard instructions (required):** UI icon button enabling users to access the chart's keyboard navigation instructions.<br/>
**D.  Subtitle (optional):** Additional text providing details, context, or instructions about the chart.<br/>
**E. Legend (optional):** Area explaining the meaning of each dot in the dumbbell plot to help users interpret the chart.<br/>
**F. Plot canvas (required):** Area containing the graphic part of the chart including axes, gridlines, and other elements.<br/>
**G. Data markers (required):** Dots connected by lines representing two data series and the difference between them.<br/>
**H. Vertical axis (required):** Scale representing numeric values.<br/>
**I. Horizontal axis (required):** Scale representing a date period or a category.<br/>

## Usage

A table that displays when to use and when not to use different component variants.

- When to use: To compare two related values for each category or time period (e.g., actual vs. target, current vs. previous).
- When not to use: When there are more than two values per category, as the chart becomes cluttered. Consider using clustered or stacked bar chart instead.

- When to use: To highlight the size of the gap or difference between two categories.
- When not to use: When precise trends for each category are more important than the difference. Consider using a [line chart](https://design.visa.com/data-visualization/charts/line-chart) instead.

- When to use: When the goal is to show how differences change across categories or over time.
- When not to use: When gaps between values are too small or not meaningful, making the visual comparison ineffective.

- When to use: To emphasize relative performance against a benchmark or paired value.
- When not to use: If there’s no benchmark or paired value to compare. Consider using a [bar chart](https://design.visa.com/data-visualization/charts/bar-chart) instead.

<br/>

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

