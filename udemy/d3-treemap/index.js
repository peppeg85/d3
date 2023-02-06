// set the dimensions and margins of the graph
const margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 445 - margin.left - margin.right,
  height = 445 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// read json data
d3.csv(
  //"https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram_full.json"
  "data2.csv"
).then(function (data) {
  console.log("json ", data);
  /*   // Give the data to this cluster layout:
  const root = d3.hierarchy(data).sum(function (d) {
    return d.value;
  }); // Here the size of each leave is given in the 'value' field in input data */

  var root = d3
    .stratify()
    .id(function (d) {
      return d.child;
    })
    .parentId(function (d) {
      return d.parent;
    })(data);
  root.sum(function (d) {
    return +d.value;
  });
  console.log("root ", root);
  // Then d3.treemap computes the position of each element of the hierarchy
  d3
    .treemap()
    .size([width, height])
    .paddingTop(28)
    .paddingRight(7)
    .paddingInner(3)(
    // Padding between each rectangle
    //.paddingOuter(6)
    //.padding(20)
    root
  );

  // per fare il dominio dinamico

  let dom = [];
  for (let el of root.children) {
    dom.push(el.id);
  }
  console.log("dom ", dom);
  // prepare a color scale
  const color = d3
    .scaleOrdinal()
    // .domain(["boss1", "boss2", "boss3"])
    .domain(dom)
    //.range(["#333", "#D18975", "#8FD175"]);
    .range(d3.schemeTableau10);

  // funzioni per calcolare max e min:
  const max = Math.max(...data.map((el) => el.value));
  const min = Math.min(...data.map((el) => el.value));
  console.log("max ", max);
  console.log("min ", min);
  // And a opacity scale
  const opacity = d3.scaleLinear().domain([min, max]).range([0.5, 1]);

  // use this information to add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .join("rect")
    .attr("x", function (d) {
      return d.x0;
    })
    .attr("y", function (d) {
      return d.y0;
    })
    .attr("width", function (d) {
      return d.x1 - d.x0;
    })
    .attr("height", function (d) {
      return d.y1 - d.y0;
    })
    .style("stroke", "black")
    .style("fill", function (d) {
      return color(d.parent.data.child);
    })
    .style("opacity", function (d) {
      return opacity(d.data.value);
    })
    .on("mouseenter", function (event, val) {
      d3.select(this).style("opacity", function (d) {
        return 1;
      });
    })
    .on("mouseleave", function (event, val) {
      d3.select(this).style("opacity", function (d) {
        return opacity(val.value);
      });
    });

  // and to add the text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", function (d) {
      return d.x0 + 5;
    }) // +10 to adjust position (more right)
    .attr("y", function (d) {
      return d.y0 + 20;
    }) // +20 to adjust position (lower)
    .text(function (d) {
      return d.data.child;
      //return d.data.name.replace("mister_", "");
    })
    .attr("font-size", "19px")
    .attr("fill", "white");

  // and to add the text labels
  svg
    .selectAll("vals")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", function (d) {
      return d.x0 + 5;
    }) // +10 to adjust position (more right)
    .attr("y", function (d) {
      return d.y0 + 35;
    }) // +20 to adjust position (lower)
    .text(function (d) {
      return d.data.value;
    })
    .attr("font-size", "11px")
    .attr("fill", "white");

  // Add title for the 3 groups
  svg
    .selectAll("titles")
    .data(
      root.descendants().filter(function (d) {
        return d.depth == 1;
      })
    )
    .enter()
    .append("text")
    .attr("x", function (d) {
      return d.x0;
    })
    .attr("y", function (d) {
      return d.y0 + 21;
    })
    .text(function (d) {
      return d.data.name;
    })
    .attr("font-size", "19px")
    .attr("fill", function (d) {
      return color(d.data.name);
    });

  // Add title for the 3 groups
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", 14) // +20 to adjust position (lower)
    .text("Three group leaders and 14 employees")
    .attr("font-size", "19px")
    .attr("fill", "grey");
});
