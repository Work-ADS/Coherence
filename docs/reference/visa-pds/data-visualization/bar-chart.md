---
title: "Bar chart"
tab_title: "Usage"
side_nav_order: 1
description: "Chart that uses rectangular bars to represent and compare values across different categories or groups."
meta_description: "Learn how to implement bar charts to represent and compare values across different categories or groups."
page_size: "medium"
thumbnail: "https://design.visa.com/assets/data-visualization/chart-components/bar-chart-sm.svg"
tags: []
full_width: false
show_table_of_contents: true
keywords: ["Bar graph", "column graph"]
filter: {"category":["trend","ranking"]}
related: {"charts":[{"id":"design-visualization-guidelines/overview","collection":"data-visualization"},{"id":"charts/line-chart","collection":"data-visualization"}],"components":[],"content":[],"patterns":[]}
---

<!-- Vendored from the Visa Product Design System.
     Source: https://design.visa.com/data-visualization/charts/bar-chart
     Retrieved: 2026-07-30
     Reference only - AFI rules live in docs/rules/data-viz-skill.md.
     Tables flattened by the original export were re-pulled from the live
     page and restored; prose is otherwise untouched. Images are remote URLs. -->

Bar charts use rectangular bars to represent values across different categories or groups. The height or length of each bar represents the numeric value for its category.
<br/>
Also known as: Bar graph, column graph.

## Anatomy

<img src="https://design.visa.com/assets/data-visualization/usage/bar-chart/bar-anatomy.svg" 
  alt="A vertical bar chart displaying monthly data with values ranging from 1.8k to 4.5k. Callout A indicating the optional title, callout B indicating the optional data table button, callout C indicating the required keyboard instructions, callout D indicating the optional subtitle, callout E indicating the required plot canvas, callout F indicating the required data markers, callout G indicating the quantitative axis, and callout H indicating the categorical axis"
/>

**A. Title (optional):** Brief text summarizing the contents of the chart.<br/>
**B. Data table button (optional):** UI icon button enabling users to view the chart's data in table format.<br/>
**C. Keyboard instructions (required):** UI icon button enabling users to access the chart's keyboard navigation instructions.<br/>
**D. Subtitle (optional):** Additional text providing details, context, or instructions about the chart.<br/>
**E. Plot canvas (required):** Area containing the graphic part of the chart including axes, gridlines, and other elements.<br/>
**F. Data markers (required):** Bars representing data points where the length or height of the bar indicates its category's value.<br/>
**G. Quantitative axis (required):** Scale representing numeric values, either on the horizontal or vertical axis.<br/>
**H. Categorical axis (required):** Scale representing categories or dates, either on the horizontal or vertical axis.<br/>

## Usage

A table that displays when to use and when not to use different component variants.

- When to use: To show how trends change over longer time periods, like weeks, months, or quarters.
- When not to use: To compare trends over very short time periods, like days or hours. Consider using a [line chart](https://design.visa.com/data-visualization/charts/line-chart) instead.<br/><br/>When showing continuous changes over time. Consider using a [line chart](https://design.visa.com/data-visualization/charts/line-chart) instead.

- When to use: To show the precise value of each data point.
- When not to use: If your data includes extreme values that distort the scale. Consider using a distribution insight chart instead.

- When to use: To compare ranking across categories and quickly identify the highest and lowest values.
- When not to use: If summarizing your data into categories would hide meaningful patterns.<br/><br/>If you need to show composition within categories. Consider using a composition insight chart, such as stacked bar or clustered bar chart instead.

<br/>

## Best practices

- Ensure the chart clearly communicates important takeaways, like if the data values are in a desirable or undesirable range.
- Always start the quantitative axis at zero to avoid distorting data or exaggerating differences in bar sizes. 
- Avoid displaying too many data points as this makes bar charts difficult to read and interpret. 
- Consider using [Pagination](https://design.visa.com/components/pagination) or group data into broader categories to limit how many data points are shown at a time.
- Provide in-context cues and labels to help users interpret the chart correctly without requiring significant effort. 

### Layouts

Bar charts can be displayed vertically or horizontally based on the data included. Select whichever layout will provide better legibility and scannability.

  
    #### Vertical layout
    <Typography>
      In this layout, bars are displayed next to one another with taller bars representing higher values.
    </Typography>
      <img src="https://design.visa.com/assets/data-visualization/usage/bar-chart/listbox-mark-required.svg" 
        alt="A vertical bar chart schematic."
      />
      - Use this layout to visualize trends, where each bar represents a date period such as week or month.
      - Use this layout when data has a meaningful order, like age groups or a scale (low, medium, high). 
  
  
    #### Horizontal layout
    <Typography>
      In this layout, bars are displayed along the horizontal axis with longer bars representing higher values.
    </Typography>
      <img src="https://design.visa.com/assets/data-visualization/usage/bar-chart/input-asterisk.svg" alt="A horizontal bar chart schematic."/>
      - Use this layout for data with distinct categories, such as countries or market segments.
      - Use this layout to help make longer category names easier to read.
  

### Data order

Bars on the categorical axis should be arranged in a meaningful way to help users quickly grasp the point of the chart. When deciding on the data order, consider what would be the most useful reading order of the data, as well as the story being told.
- Use standard ordering for categories that are chronological, like days, months, or years, if the goal is to visualize changes over time. 
- Sort categories in order of their values to emphasize ranking or the differences in quantities between categories.

### Chart size
Chart size should be based on the data within each chart. Use the columns in the [Responsive grid system](https://design.visa.com/base-elements/responsive-grid-system) to set the width of the card, as shown below. Adjust the card's height so it is proportional and accurately represents the shape of the data. 

<img src="https://design.visa.com/assets/data-visualization/usage/bar-chart/bar-chart-size-with-grid-overlay.svg" 
  alt="A content card with a bar chart placed over a grid schematic layout."
/>

- Ensure charts are wide enough to be interpreted without scrolling or zooming. 
- Consider the type of analysis users need to do with the chart, and ensure it’s large enough to support that goal.

### Color

Color can be used to emphasize meaningful information and draw attention to the most important information in a chart. Use one color from the [Neutral data visualization color palette (internal only)](https://dataexperience.visa.com/design-guide/color#What_to_do_when_color_has_no_meaning), unless encoding additional data with color would add significant value.
- Color should never be used alone to communicate meaning. For more, visit [Accessibility](https://design.visa.com/data-visualization/charts/bar-chart/accessibility). 
- Learn more about using color for data visualization in the [Color guidelines (internal only)](https://dataexperience.visa.com/design-guide/color).

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

