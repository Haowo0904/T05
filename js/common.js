/* Shared presentation only. Every chart owns its CSV, scales and marks. */
window.TV = (() => {
  const colors = { LCD: '#247a78', LED: '#456fb1', OLED: '#ad6830' };
  const meanColumn = 'Mean(Labelled energy consumption (kWh/year))';
  const number = d3.format(',.1f');
  function tooltip(selection, label) {
    const tip = d3.select('#tooltip');
    selection.on('pointerenter pointermove click', (event, d) => {
      tip.text(label(d)).attr('hidden', null);
      const box = tip.node().getBoundingClientRect();
      tip.style('left', `${Math.max(8, Math.min(event.clientX + 14, innerWidth - box.width - 8))}px`)
        .style('top', `${Math.max(8, Math.min(event.clientY + 14, innerHeight - box.height - 8))}px`);
    }).on('pointerleave', () => tip.attr('hidden', true));
  }
  // Observe the container, not just the window: CSS grid changes also resize charts.
  function responsive(id, data, draw) {
    const container = document.querySelector(id);
    let frame;
    const render = () => {
      d3.select('#tooltip').attr('hidden', true);
      draw(d3.select(container), data, container.clientWidth);
    };
    new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(render); }).observe(container);
    render();
    return render;
  }
  function svg(container, width, height, title) {
    container.selectAll('*').remove();
    const root = container.append('svg').attr('viewBox', `0 0 ${width} ${height}`).attr('role', 'img').attr('aria-label', title);
    root.append('title').text(title);
    return root;
  }
  function axes(root, x, y, width, height, margin, xLabel, yLabel, xAxis) {
    root.append('g').attr('class', 'grid').attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(-(width-margin.left-margin.right)).tickFormat('')).call(g => g.select('.domain').remove());
    root.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(5).tickSize(0).tickPadding(8)).call(g => g.select('.domain').remove());
    root.append('g').attr('transform', `translate(0,${height-margin.bottom})`).call(xAxis || d3.axisBottom(x).ticks(width < 500 ? 4 : 8)).call(g => g.selectAll('.tick line').remove());
    root.append('text').attr('class', 'axis-label').attr('x', margin.left).attr('y', 16).text(yLabel);
    root.append('text').attr('class', 'axis-label').attr('x', (margin.left+width-margin.right)/2).attr('y', height-5).attr('text-anchor','middle').text(xLabel);
  }
  function table(id, headers, rows) {
    const target = d3.select(id); target.selectAll('*').remove();
    const t = target.append('table');
    t.append('thead').append('tr').selectAll('th').data(headers).join('th').attr('scope','col').text(d=>d);
    t.append('tbody').selectAll('tr').data(rows).join('tr').selectAll('td').data(d=>d).join('td').text(d=>d);
  }
  function error(id, err) {
    console.error(err);
    d3.select(id).append('p').attr('class','error').text('Unable to load chart data. Serve this folder over HTTP and try again.');
  }
  return { colors, meanColumn, number, tooltip, responsive, svg, axes, table, error };
})();
