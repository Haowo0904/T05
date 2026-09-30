/* One point per CSV row; count is metadata, not repeated points. */
d3.csv('data/Ex5_TV_energy.csv', d => ({
  brand: d.brand, tech: d.screen_tech === 'LCD (LED)' ? 'LED' : d.screen_tech,
  size: +d.screensize, energy: +d.energy_consumpt, stars: +d.star2, count: +d.count
})).then(data => {
  const valid = data.filter(d => Number.isFinite(d.energy) && Number.isFinite(d.stars));
  const render = TV.responsive('#scatter', valid, (container, records, width) => {
    const selected = document.querySelector('#technology').value;
    const visible = records.filter(d => selected === 'All' || d.tech === selected);
    const height = width < 500 ? 330 : 365, m = {top:35,right:18,bottom:48,left:54};
    const root = TV.svg(container,width,height,'TV energy consumption versus star rating. Data available in the table below.');
    // Fixed domains across filters make comparisons honest and predictable.
    const x = d3.scaleLinear().domain(d3.extent(records,d=>d.stars)).nice().range([m.left,width-m.right]);
    const y = d3.scaleLinear().domain([0,d3.max(records,d=>d.energy)]).nice().range([height-m.bottom,m.top]);
    TV.axes(root,x,y,width,height,m,'Star rating (higher = more efficient)','Annual energy (kWh/year)');
    const dots = root.append('g').selectAll('circle').data(visible).join('circle').attr('cx',d=>x(d.stars)).attr('cy',d=>y(d.energy)).attr('r',4).attr('fill',d=>TV.colors[d.tech] || '#66736a').attr('fill-opacity',.58).attr('stroke','white').attr('stroke-width',.5);
    TV.tooltip(dots,d=>`${d.brand} · ${d.tech} · ${d.size} inches | ${d.stars} stars | ${TV.number(d.energy)} kWh/year | count: ${d.count}`);
    d3.select('#scatter-note').text(`${visible.length} of ${records.length} records shown. Translucent points reveal overlap. LED represents “LCD (LED)” in the source.`);
    TV.table('#scatter-table',['Brand','Technology','Size (inches)','Stars','kWh/year','Count'],visible.map(d=>[d.brand,d.tech,d.size,d.stars,TV.number(d.energy),d.count]));
  });
  document.querySelector('#technology').addEventListener('change',render);
}).catch(err=>TV.error('#scatter',err));
