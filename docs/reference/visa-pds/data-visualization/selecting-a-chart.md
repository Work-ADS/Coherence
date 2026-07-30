---
title: "Selecting a chart"
side_nav_title: "Selecting a chart"
side_nav_order: 2
description: "Learn how to find the right chart for your audience's analysis needs."
meta_description: "Learn how to find the right chart for your audience's analysis needs."
page_size: "medium"
tags: []
full_width: false
show_table_of_contents: true
---

<!-- Vendored from the Visa Product Design System.
     Source: https://design.visa.com/data-visualization/design-visualization-guidelines/selecting-a-chart
     Retrieved: 2026-07-30
     Reference only - AFI rules live in docs/rules/data-viz-skill.md.
     Tables flattened by the original export were re-pulled from the live
     page and restored; prose is otherwise untouched. Images are remote URLs. -->

Selecting the right chart requires determining the key purpose of the chart and tailoring it to your audience's needs.<br/><br/>
Start by understanding the chart types available in our system. Once you're familiar, you can select a chart design from our collection of examples by defining the key insight your chart should provide, and determining the focus elements. Finally, optimize your chart's design to direct attention to the most important information.

## Understand the chart types

Chart types refer to the broad categories of visual representations used to display data.  Each chart type is best-suited for particular kinds of data analysis or insights. Charts help users understand and interpret data by leveraging simplified visual representations that highlight patterns and relationships.<br/><br/>

  
    <FixedImage width="auto" height="128px" img src={`https://design.visa.com/assets/data-visualization/design-guidelines/selecting-a-chart/bar-chart.svg`} alt="Bar chart type"/>
  
  
    <FixedImage width="auto" height="128px" img src={`https://design.visa.com/assets/data-visualization/design-guidelines/selecting-a-chart/line-chart.svg`} alt="Line chart chart type"/>
  
  
    <FixedImage width="auto" height="128px" img src={`https://design.visa.com/assets/data-visualization/design-guidelines/selecting-a-chart/heatmap.svg`} alt="Heatmap chart type"/>
  
  
    <FixedImage width="auto" height="128px" img src={`https://design.visa.com/assets/data-visualization/design-guidelines/selecting-a-chart/scatterplot.svg`} alt="Scatterplot chart type"/>
  

<br/>

To learn more about each chart type visit the [Charts](https://design.visa.com/data-visualization/charts/overview)<!-- aria-label="Charts component library" --> guidelines.<br/><br/>
**Note:** Our guidelines currently only include these charts: Bar chart, dumbbell plot, line chart, and heatmap. You can explore our full library of chart components in the latest release of [Visa Chart Components (VCC)](https://github.com/visa/visa-chart-components)<!-- aria-label="Visa Chart Components (internal only) library" -->.

## Selecting a chart
Each chart type in our library includes specific examples which are adaptations created to solve real-world business problems. These work like templates or starter chart designs that include modifications that tailor the chart for specific data analysis tasks, or to emphasize particular aspects of the data.<br/><br/>
Use the insight and focus categories on our [Examples index](https://design.visa.com/data-visualization/charts/overview/examples)<!-- aria-label="Chart component library examples index" --> page to select a chart variation that is best suited for your user’s analysis needs.

<FeatureWithIcon icon={VisaIdeaHigh} style={{marginBlockEnd: '0'}}>
  <Typography variant="headline-4">Insights</Typography>
  <Typography variant="body-2">What do you want your audience to learn from this chart?</Typography>
</FeatureWithIcon>

<FeatureWithIcon icon={VisaSearchHigh} style={{marginBlockEnd: '0'}}>
  <Typography variant="headline-4">Focus</Typography>
  <Typography variant="body-2">What is the most important and meaningful information for users to focus on in this chart?</Typography>
</FeatureWithIcon>

### Step 1: Choose a key insight category
Insights refer to the high-level purpose of a chart, and the type of analysis it enables. Start by identifying the primary insight category of the chart, based on the type of question that it should enable users to answer. 

Table for understanding key insights and business questions

| Insight | Key business question |
| --- | --- |
| Association | How are items related? |
| Current status | What is the current value of a metric, and is it good or bad? |
| Composition | Which categories have a higher share of the whole? |
| Correlation | Is there a meaningful pattern between two numbers? |
| Deviation | How much difference is there between two numbers? |
| Distribution | What is the range of values, and how does it compare to the average? |
| Flow | How do items move through a sequence? |
| Trend | How has a number changed over time? |
| Ranking | Which items have the highest and lowest values? |
| Spatial | How does location impact a pattern? |

### Step 2: Determine the focus

After you’ve selected an insight category, narrow down the examples by determining the key focus element of the chart. Focus elements refer to the specific data points, trends, patterns, or areas in a chart that are emphasized to make it easier for users to understand the key insights from the data.<br/><br/>
Three key focus areas that can be highlighted or emphasized: A specific category, within a dataset, and values relative to a threshold. The sections below illustrate how our chart examples have been customized to emphasize different focus elements.

### Highlight a category

Direct the user's focus to a primary category, as illustrated in the [Category share of total](https://design.visa.com/data-visualization/charts/heatmap/examples#heatmap-category-share-of-total)<!-- aria-label="Category share of total heatmap chart example" --> heatmap example.

<img src="https://design.visa.com/assets/data-visualization/design-guidelines/selecting-a-chart/category-share-of-total.svg" 
  alt="A heatmap comparing a percentage of resolved requests against a target percentage"
  class="chart-usage-img-margin-block-end-0"
/>

### Highlight values above a threshold

Direct the user's focus to values above a specific threshold, as illustrated in the [Compare trend to benchmark](https://design.visa.com/data-visualization/charts/bar-chart/examples#bar-chart-compare-trend-to-benchmark)<!-- aria-label="Compare trend to benchmark bar chart example" --> bar chart example.

<img src="https://design.visa.com/assets/data-visualization/design-guidelines/selecting-a-chart/compare-trend-to-benchmark.svg" 
  alt="A bar chart comparing monthly transactions across a 6 month span against a benchmark"
  class="chart-usage-img-margin-block-end-0"
/>

### Highlight high and low values

Direct the user's focus to the highest and lowest values, as illustrated in the [Trend with categories](https://design.visa.com/data-visualization/charts/dumbbell-plot/examples#dumbbell-plot-trend-with-categories)<!-- aria-label="Trend with categories dumbbell plot example" --> dumbbell plot example.

<img src="https://design.visa.com/assets/data-visualization/design-guidelines/selecting-a-chart/trend-with-categories.svg"  alt="A dumbbell plot comparing trends between two competitors across 12 months" class="chart-usage-img-margin-block-end-0" />

### Step 3: Refine the chart

Once you’ve chosen a chart example that works well for your use case, you can refine it to ensure it’s tailored to your audience’s needs. Use the following guidelines to help reduce distracting information and draw attention to the key elements of the chart.

### Reduce distracting information
To establish a clear visual focus, determine what elements only provide details or supporting information. This includes chart elements like gridlines, axes or axis elements, and data labels.  
- Create a clear visual focus by limiting distracting information and only adding visual details as need.
- Avoid using chart elements that convey similar or repeated information to help limit visual noise.
- Start by using one neutral color for all data points. This gives you a more flexible starting point for directing attention where it’s needed. 
- Use color encoding to provide additional information and context, where necessary. Follow guidelines for [Color palettes (internal only)](https://bookmarks.visa.com/vpds-neutral-data-visualization-color-palette)<!-- aria-label="Visa color palettes guidelines (internal only)" --> to make full use of our data visualization color palettes. 

### Direct attention
Once you have a simplified chart by reducing distracting elements, you can reintroduce visual emphasis to help users focus on the most important information in your chart.<br/><br/>
To direct attention to the right part of the chart, consider the user’s key task: What mental steps do they need to take to answer the key question? Determining the task type can help you choose what information to emphasize. 

Table for understanding task types and ways to direct attention

| Task type | Description | Ways to direct attention |
| --- | --- | --- |
| Lookup | Understand the precise value of a selected data point | Use direct labeling of data points.<br/>Provide option to view the chart's data in table format. |
| Locate | Find a specific item or category within a chart | Use color to represent individual categories, or to highlight the most important category.<br/>Provide interactive functionality to enable searching and highlighting specific data points. |
| Identify | Find a pattern or an outlier | Use reference lines to identify values above or below a threshold.<br/>Highlight outliers with different color or shape.<br/>Use annotations to identify and describe significant patterns. |
| Compare | Compare the differences and similarities between two items, categories, or metrics | Add reference lines to enable comparisons to the typical value.<br/>Use side-by-side positioning of multiple charts.<br/>Use statistical techniques for normalizing the data to enable more accurate comparisons. |
- Description: - Use direct labeling of data points.
- Provide option to view the chart’s data in table format.

- Task type: Find a specific item or category within a chart
- Description: - Use color to represent individual categories, or to highlight the most important category.
- Provide interactive functionality to enable searching and highlighting specific data points.

- Task type: Find a pattern or an outlier
- Description: - Use reference lines to identify values above or below a threshold.
- Highlight outliers with different color or shape.
- Use annotations to identify and describe significant patterns.

- Task type: Compare the differences and similarities between two items, categories, or metrics
- Description: - Add reference lines to enable comparisons to the typical value.
- Use side-by-side positioning of multiple charts.
- Use statistical techniques for normalizing the data to enable more accurate comparisons.

<br/>
For more information about visual analysis tasks, reference the Data Representation Pillar of our [Data Experience Critique Framework](https://developer.visa.com/images2/visa-chart-components/Data%20Experience%20Critique%20Framework.pdf)<!-- aria-label="Data Experience Critique Framework" -->