d3.csv('data/Ex5_TV_energy_Allsizes_byScreenType.csv',d=>({tech:d.Screen_Tech,energy:+d[TV.meanColumn]})).then(data=>{
  const total=d3.sum(data,d=>d.energy);
  TV.responsive('#donut',data,(container,records,width)=>{
    const height=285, radius=Math.min(width/2-12,125);
    const root=TV.svg(container,width,height,'Shares of the three all-size technology means, not total consumption.');
    const group=root.append('g').attr('transform',`translate(${width/2},${height/2})`);
    const arc=d3.arc().innerRadius(radius*.63).outerRadius(radius).padAngle(.025).cornerRadius(3);
    const slices=group.selectAll('path').data(d3.pie().sort(null).value(d=>d.energy)(records)).join('path').attr('d',arc).attr('fill',d=>TV.colors[d.data.tech]);
    TV.tooltip(slices,d=>`${d.data.tech}: ${TV.number(d.data.energy)} kWh/year mean · ${TV.number(d.data.energy/total*100)}% of summed means`);
    group.append('text').attr('class','center-title').attr('text-anchor','middle').attr('y',-3).text('All sizes');
    group.append('text').attr('text-anchor','middle').attr('y',20).text('technology means');
  });
  const rows=d3.select('#donut-legend').selectAll('div').data(data).join('div');
  rows.append('span').each(function(d){d3.select(this).append('i').attr('class','swatch').style('background',TV.colors[d.tech]);d3.select(this).append('span').text(d.tech);});
  rows.append('strong').text(d=>`${TV.number(d.energy)} kWh/yr · ${TV.number(d.energy/total*100)}%`);
  TV.table('#donut-table',['Technology','Mean kWh/year','Share of summed means'],data.map(d=>[d.tech,TV.number(d.energy),`${TV.number(d.energy/total*100)}%`]));
}).catch(err=>TV.error('#donut',err));
