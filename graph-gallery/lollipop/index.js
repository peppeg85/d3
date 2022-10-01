// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 40, left: 150 },
  width = 800 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const colors = {
  Oncology: "#d48320",
  "Anti-infective": "#b0bd42",
  "Covid-19": "#308ea6",
  "Infiammation & immunity": "#64156b",
};

const xLabels = [
  "",
  "EarlyDiscovery",
  "Late Discovery",
  "IND-enabling",
  "Phase 1",
  "Phase 2",
  "Exscentia",
  "Partner",
];

const colorNameAccessor = (d) => d.name.split("_")[0];

// append the svg object to the body of the page
const svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json("data.json").then(function (data) {
  // X axis

  const dataClone = JSON.parse(JSON.stringify(data));

  const newLabels = dataClone.map((d) => d.value); //array di label duplicate

  const x = d3.scalePoint().domain(xLabels).range([0, width]);

  const xAxis = d3.axisBottom(x).tickFormat(function (d, i) {
    console.log(d);
    return d;
  });
  svg.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);

  // Y axis
  const yLabels = data.map(function (d, i) {
    return d.name + "_" + i;
  });
  for (let i = 0; i < data.length; i++) {
    data[i].name = data[i].name + "_" + i;
  }
  console.log(yLabels);
  console.log(data);

  data.sort(function (a, b) {
    if (a.value < b.value) {
      return 1;
    }
    if (a.value > b.value) {
      return -1;
    }
    return 0;
  });

  console.log(data);
  const y = d3.scaleBand().range([0, height]).domain(yLabels).padding(1);
  svg
    .append("g")
    .call(
      d3
        .axisLeft(y)
        .tickFormat(function (d, i) {
          return d.split("_")[0];
        })
        .tickSizeOuter(0)
        .tickSizeInner(0)
    )
    .select(".domain")
    .remove();
  // Lines
  svg
    .selectAll("myline")
    .data(data)
    .enter()
    .append("line")
    .attr("x1", function (d) {
      return x(d.value);
    })
    .attr("x2", x(0))
    .attr("y1", function (d) {
      return y(d.name);
    })
    .attr("y2", function (d) {
      return y(d.name);
    })
    .attr("stroke", "grey");

  svg
    .selectAll("mytext")
    .data(data)
    .enter()
    .append("text")
    .attr("x", function (d) {
      return x("Exscentia");
    })
    .attr("y", function (d) {
      return y(d.name);
    })
    .text(function (d) {
      return d.exscentia;
    })
    .attr("text-anchor", "middle");

  // Circles
  svg
    .selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.value);
    })
    .attr("cy", function (d) {
      return y(d.name);
    })
    .attr("r", "4")
    .style("fill", function (d) {
      return colors[colorNameAccessor(d)];
    })
    .attr("stroke", "black");
});
