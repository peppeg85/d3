// The svg
window.addEventListener("DOMContentLoaded", (event) => {
  const svg = d3.select("svg");
  console.log(svg);

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  let pattern = null;
  let dataset = [];
  d3.csv(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv"
  ).then((response) => {
    console.log(response);
    for (let el of response) {
      dataset.push({ [el.code]: el.pop });
    }
    console.log("dataset", dataset);
  });

  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ).then((res) => {
    pattern = res;
    console.log("pattern ", pattern);
  });
  // Map and projection
  const path = d3.geoPath();
  const projection = d3
    .geoMercator()
    .scale(70)
    .center([0, 20])
    .translate([width / 2, height / 2]);

  // Data and color scale
  let data = new Map();
  const colorScale = d3
    .scaleThreshold()
    .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
    .range(d3.schemeBlues[7]);

  // Load external data and boot

  Promise.all([
    d3.json(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    ),
    d3.csv(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv",
      function (d) {
        console.log(d);
        data.set(d.code, +d.pop);
      }
    ),
  ]).then(function (loadData) {
    /* console.log(data);
    let topo = loadData[0]; */
    let topo = pattern;
    // Draw the map
    svg
      .append("g")
      .selectAll("path")
      .data(topo.features)
      .join("path")
      // draw each country
      .attr("d", d3.geoPath().projection(projection))
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      });
  });
});
