// https://d3-graph-gallery.com/graph/donut_basic.html

// set the dimensions and margins of the graph
const width = 450,
    height = 450,
    margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin

const opacity = 0.7
// append the svg object to the div called 'my_dataviz'
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

// Create dummy data
const newData = [
    {
        name: "a",
        value: 9
    },
    {
        name: "b",
        value: 20
    },
    {
        name: "c",
        value: 30
    },
    {
        name: "d",
        value: 8
    },
    {
        name: "e",
        value: 12
    },
]
const sortedData = newData.slice().sort((a, b) => d3.ascending(a.value, b.value))
// set the color scale

/* const color = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]) */

const colors = d3.quantize(d3.interpolateBrBG, sortedData.length)
const colorScale = d3.scaleOrdinal()
    .domain(sortedData.map(el => el.name))
    .range(colors)


//alternativa colori

/* const colors = d3.quantize(d3.interpolateGnBu, sortedData.length)
   const colorScale = d3.scaleOrdinal()
       .domain(sortedData.map(el => el.name))
       .range(d3.schemeCategory10)
 */

// Compute the position of each group on the pie:

const pie = d3.pie()
    .value(d => d.value)

//const data_ready = pie(Object.entries(data))
const data_ready = pie(sortedData)
const mouseoverHandler = function (ev, el) {
    d3.select(this).style("opacity", 1);
}
const mouseoutHandler = function (ev, el) {
    d3.select(this).style("opacity", opacity);
}

const arcLabels = d3.arc()
    .outerRadius(radius)
    .innerRadius(100)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg.selectAll('whatever')
    .data(data_ready)
    .join('path')
    .attr('d', d3.arc()
        .innerRadius(100)         // This is the size of the donut hole
        .outerRadius(radius)
    )
    .attr('fill', d => colorScale(d.data.name))
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", opacity)
    .on('mouseover', mouseoverHandler)
    .on('mouseout', mouseoutHandler)

const labelsGroup = svg.append('g')

labelsGroup.selectAll('text')
    .data(data_ready)
    .join('text')
    .attr('transform', d => `translate(${arcLabels.centroid(d)})`)
    .call(
        text => text.append('tspan')
            .style('font-weight', 'bold')
            .attr('y', -4)
            .text(d => d.data.name)
    )
    .call(
        text => text.filter(d => (d.endAngle - d.startAngle) > 0.25)
            .append('tspan')
            .attr('y', 10)
            .attr('x', 0)
            .text(d => parseInt(d.data.value).toLocaleString('it-IT'))
    )
