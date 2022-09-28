// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 40, left: 100 },
  width = 460 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Parse the Data
d3.csv(
  "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv"
).then(function (data) {
  // Add X axis
  console.log(data);
  for (let el of data) {
    el.Value = el.Country;
  }
  let labels = data.map((el) => el.Country);
  console.log(labels);
  const x = d3.scalePoint().domain(labels).range([0, width]);
  const xAxis = d3.axisBottom(x).tickFormat(function (d, i) {
    return d;
  });
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y axis
  const y = d3
    .scaleBand()
    .range([0, height])
    .domain(
      data.map(function (d) {
        return d.Country;
      })
    )
    .padding(1);
  svg.append("g").call(d3.axisLeft(y));

  // Lines
  svg
    .selectAll("myline")
    .data(data)
    .enter()
    .append("line")
    .attr("x1", function (d) {
      return x(d.Value);
    })
    .attr("x2", x(0))
    .attr("y1", function (d) {
      return y(d.Country);
    })
    .attr("y2", function (d) {
      return y(d.Country);
    })
    .attr("stroke", "grey");

  // Circles
  svg
    .selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.Value);
    })
    .attr("cy", function (d) {
      return y(d.Country);
    })
    .attr("r", "4")
    .style("fill", "#69b3a2")
    .attr("stroke", "black");
});
