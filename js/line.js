d3.csv('data/Ex5_ARE_Spot_Prices.csv',d=>({year:+d.Year,price:+d['Average Price (notTas-Snowy)']})).then(data=>{
  data.sort((a,b)=>a.year-b.year);
  TV.responsive('#line',data,(container,records,width)=>{
    const height=320,m={top:35,right:20,bottom:48,left:46};
    const root=TV.svg(container,width,height,'Average annual spot electricity prices from 1998 to 2024, excluding Tasmania and Snowy.');
    const x=d3.scaleLinear().domain(d3.extent(records,d=>d.year)).range([m.left,width-m.right]);
    const y=d3.scaleLinear().domain([0,d3.max(records,d=>d.price)*1.08]).nice().range([height-m.bottom,m.top]);
    const years=width<500?[1998,2005,2012,2019,2024]:[1998,2002,2006,2010,2014,2018,2022,2024];
    TV.axes(root,x,y,width,height,m,'Year','Spot price (AUD/MWh)',d3.axisBottom(x).tickValues(years).tickFormat(d3.format('d')));
    // Straight segments avoid suggesting measurements between annual observations.
    root.append('path').datum(records).attr('fill','none').attr('stroke',TV.colors.LCD).attr('stroke-width',2.5).attr('d',d3.line().x(d=>x(d.year)).y(d=>y(d.price)));
    const points=root.append('g').selectAll('circle').data(records).join('circle').attr('cx',d=>x(d.year)).attr('cy',d=>y(d.price)).attr('r',4).attr('fill',TV.colors.LCD).attr('stroke','white').attr('stroke-width',1.5);
    TV.tooltip(points,d=>`${d.year}: AUD ${d3.format(',.2f')(d.price)} per MWh`);
  });
  TV.table('#line-table',['Year','Average spot price (AUD/MWh)'],data.map(d=>[d.year,d3.format(',.2f')(d.price)]));
}).catch(err=>TV.error('#line',err));
