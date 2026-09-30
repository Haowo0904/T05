d3.csv('data/Ex5_TV_energy_55inchtv_byScreenType.csv',d=>({tech:d.Screen_Tech,energy:+d[TV.meanColumn]})).then(data=>{
  TV.responsive('#bar',data,(container,records,width)=>{
    const height=385,m={top:40,right:12,bottom:48,left:46};
    const root=TV.svg(container,width,height,'Mean annual energy consumption of 55-inch TVs by screen technology.');
    const x=d3.scaleBand().domain(records.map(d=>d.tech)).range([m.left,width-m.right]).padding(.4);
    const y=d3.scaleLinear().domain([0,d3.max(records,d=>d.energy)*1.12]).nice().range([height-m.bottom,m.top]);
    TV.axes(root,x,y,width,height,m,'Screen technology','Mean energy (kWh/year)',d3.axisBottom(x));
    const bars=root.append('g').selectAll('rect').data(records).join('rect').attr('x',d=>x(d.tech)).attr('y',d=>y(d.energy)).attr('width',x.bandwidth()).attr('height',d=>y(0)-y(d.energy)).attr('fill',d=>TV.colors[d.tech]).attr('rx',2);
    TV.tooltip(bars,d=>`${d.tech}: ${TV.number(d.energy)} kWh/year mean (55-inch TVs)`);
    root.append('g').selectAll('text').data(records).join('text').attr('class','bar-value').attr('x',d=>x(d.tech)+x.bandwidth()/2).attr('y',d=>y(d.energy)-10).attr('text-anchor','middle').text(d=>TV.number(d.energy));
  });
  TV.table('#bar-table',['Technology','Mean kWh/year (55-inch)'],data.map(d=>[d.tech,TV.number(d.energy)]));
}).catch(err=>TV.error('#bar',err));
