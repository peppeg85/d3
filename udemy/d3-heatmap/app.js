async function draw(el, scale) {
  // Data
  const dataset = await d3.json('data.json')
  dataset.sort((a, b) => a - b)
  // Dimensions
  let dimensions = {
    width: 600,
    height: 150,
  };

  const box = 30
  const div = d3.select('.external').append('div').classed('ctr', true)
  div.append('h3').text(el)
  // Draw Image
  const svg = div
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)


  //scales
  let colorScale;
  if (scale === 'linear') {
    colorScale = d3.scaleLinear()
      .domain(d3.extent(dataset))
      .range(['#f2f2f2', 'red'])
  } else if (scale === 'quantize') {
    colorScale = d3.scaleQuantize()
      .domain(d3.extent(dataset))
      .range(['white', 'pink', 'red'])
  } else if (scale === 'quantile') {
    colorScale = d3.scaleQuantile()
      .domain(dataset)
      .range(['white', 'pink', 'red'])
  } else {
    colorScale = d3.scaleThreshold()
      .domain([45200, 135600])
      .range(d3.schemeReds[3])
  }
  //rectangles
  svg.append('g')
    .attr('transform', 'translate(2,2)')
    .attr('stroke', 'black')
    .attr('fill', '#ddd')
    .selectAll('rect')
    .data(dataset)
    .join('rect')
    .attr('width', box - 3)
    .attr('height', box - 3)
    .attr('x', (d, i) => box * (i % 20))
    .attr('y', (d, i) => box * ((i / 20) | 0))
    .attr('fill', d => colorScale(d))

}

let arrType = [
  {
    title: 'Linear scale',
    type: 'linear'
  },
  {
    title: 'Quantize scale',
    type: 'quantize'
  },
  {
    title: 'Quantile scale',
    type: 'quantile'
  },
  {
    title: 'Threshold scale',
    type: 'threshold'
  }
]

arrType.forEach(el => draw(el.title, el.type))

/* draw('Linear scale', 'linear')
draw('Quantize scale', 'quantize')
draw('Quantile scale', 'quantile')
draw('Threshold scale', 'threshold') */

/* draw('#heatmap1', 'linear')
draw('#heatmap2', 'quantize')
draw('#heatmap3', 'quantile')
draw('#heatmap4', 'threshold') */