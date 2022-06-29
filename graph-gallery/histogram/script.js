// https://d3-graph-gallery.com/graph/histogram_basic.html

const dataUrl = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv"
// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 40 }
const dimensions = {
    width: 1000,
    height: 500
}
const ctxWidth = dimensions.width - margin.left - margin.right

const ctxHeight = dimensions.height - margin.top - margin.bottom

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", ctxWidth + margin.left + margin.right)
    .attr("height", ctxHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        `translate(${margin.left},${margin.top})`);

// get the data
d3.csv(dataUrl).then(function (data) {

    /*  const xAccessor = d => parseInt(d.price)
     console.log(d3.extent(data, xAccessor)) */
    // X axis: scale and draw:
    const x = d3.scaleLinear()
        //.domain(d3.extent(data, xAccessor))     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price }) // è  troppo esteso
        .domain([0, 1000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, ctxWidth])
        .nice()
    svg.append("g")
        .attr("transform", `translate(0, ${ctxHeight})`)
        .call(d3.axisBottom(x));

    // set the parameters for the histogram
    const histogram = d3.histogram()
        .value(function (d) { return d.price; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(30); // then the numbers of bins

    // And apply this function to data to get the bins
    const bins = histogram(data);
    console.log(bins)
    // Y axis: scale and draw:
    const y = d3.scaleLinear()
        .range([ctxHeight, 0]);

    y.domain([0, d3.max(bins, function (d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    
    svg.append("g")
        .call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", 1)
        .attr("transform", function (d) { return `translate(${x(d.x0)} , ${y(d.length)})` })
        .attr("width", function (d) { return d.x1 != d.x0 ? x(d.x1) - x(d.x0) - 1 : 0 })
        .attr("height", function (d) { return ctxHeight - y(d.length); })
        .style("fill", "#69b3a2")

});