# T05 — TV Energy Explorer

A single-page D3 dashboard using the four supplied CSV datasets. No build step or package installation is needed; D3 7.9.0 is included locally with its license.

Run from this directory:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. Use an HTTP server rather than opening the HTML file directly, because browsers restrict fetching local CSV files from `file://` pages.

## Files and how they work

| File | Responsibility |
| --- | --- |
| `index.html` | Introduction, four chart containers, filter and expandable data tables |
| `styles.css` | Two-column desktop grid, single-column mobile layout and chart styling |
| `js/common.js` | Reusable SVG, axes, tooltips, tables and resize helpers |
| `js/scatter.js` | TV annual energy vs star rating; colour and filter by technology |
| `js/donut.js` | Relative shares of the all-sizes technology means |
| `js/bar.js` | Mean energy for 55-inch TVs by technology |
| `js/line.js` | Supplied annual average spot price, 1998–2024 |

Each chart follows the same D3 workflow:

1. `d3.csv` loads its dataset once. The row conversion function converts numeric strings to numbers using unary `+`.
2. Scales map values to pixel positions. Continuous measures use `scaleLinear`; technology categories use `scaleBand` in the bar chart.
3. Axis generators draw ticks and labels. SVG circles, rectangles, arcs or a path draw the observations. `selection.data(...).join(...)` binds records to SVG marks.
4. `ResizeObserver` watches the chart container. On a size change, the helper redraws with new ranges and fewer ticks on narrow screens. `requestAnimationFrame` coalesces resize notifications; CSVs are not fetched again.
5. Tooltips expose exact values. Expandable HTML tables offer the same information for keyboard and screen-reader users without requiring hundreds of focusable scatter points.

The donut uses `d3.pie` to convert values into angles and `d3.arc` to create ring segments. The line uses straight segments between annual observations; smoothing could imply unsupported peaks or intermediate measurements.

## Data interpretation

- Scatter: 587 supplied rows, not necessarily 587 individual models. A row can represent multiple entries through its `count` field. Each row is plotted once. `LCD (LED)` is labelled LED consistently. Screen sizes differ; the plot does not isolate the effect of efficiency rating. Filtering keeps the same axis domains.
- Donut: the all-sizes file contains **means**, not consumption totals. Percentages divide each mean by the sum of the three means. They are explicitly labelled as shares of summed means, not market shares or shares of total energy use. A bar or dot plot would be a stronger choice for comparing means; the donut is retained for the required chart-type exercise.
- Bar: the dedicated 55-inch file supplies mean annual labelled consumption in kWh/year. A zero baseline supports honest magnitude comparisons.
- Line: uses `Average Price (notTas-Snowy)` unchanged. It is the average for Queensland, NSW, Victoria and South Australia, excluding Tasmania and Snowy. Values are AUD/MWh, not household tariffs.
- Supplied CSVs are preserved without edits. Values in labels are rounded for readability; geometry uses the original precision.

## Design and implementation choices

Consistent technology colours, visible units, restrained grid lines and descriptive headings make the charts easier to compare. CSS Grid and container observation adapt both the page and chart geometry. Shared helpers avoid four copies of presentation code while leaving every chart in its own JavaScript file.

For this small dataset, clearing and redrawing SVG on resize is simple to explain and fast enough. For much larger datasets or animated transitions, retain SVG groups and update marks through keyed joins; for very dense scatterplots, consider Canvas. Simply shrinking an SVG with `viewBox` is less code, but also shrinks text; recomputing scales preserves readable labels.

## Things to understand for a demonstration

- Why does the y-scale range run from the bottom of the chart to the top?
- What is the difference between a scale's data domain and its pixel range?
- Why should a bar chart start at zero, and why keep scatter axes fixed during filtering?
- Why is a share of means different from a share of total consumption?
- How do `d3.pie`, `d3.arc` and `d3.line` translate data into SVG geometry?

AI-assisted implementation: review the comments and workflow above, then try changing tick counts or bar padding and explain what changes on screen.

