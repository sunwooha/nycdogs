// Define your dimensions
const width = 1000;
const height = 800;
const padding = 1.5; // separation between same-color nodes
const maxRadius = 8;

const colorScale = d3.scaleOrdinal()
  .range(["#584B53", "#9D5C63", "#D6E3F8", "#94958B", "#E4BB97"]);

d3.text("data/breeds_borough_count.csv").then(function (text) {
  const colNames = "group,text,size\n" + text;
  const data = d3.csvParse(colNames);

  data.forEach(function (d) {
    d.size = +d.size;
  });

  const m = new Map();
  data.forEach(function (d) {
    if (!m.has(d.group)) {
      m.set(d.group, { cluster: m.size });
    }
  });

  // Calculate the total width and height needed to center the visualization
  const totalWidth = maxRadius * 2 + padding;
  const totalHeight = maxRadius * 2 + padding;

  const nodes = data.map(function (d) {
    return {
      borough: d.group,
      text: d.text,
      size: d.size,
      radius: Math.log2(d.size) * (maxRadius / 5),
      cluster: m.get(d.group).cluster,
      x: (width - totalWidth) / 2 + Math.random() * totalWidth, // Center X
      y: (height - totalHeight) / 2 + Math.random() * totalHeight // Center Y
    };
  });

  const simulation = d3.forceSimulation(nodes)
    .force("center", centerForce(width, height))
    .force("collide", d3.forceCollide().radius(function (d) {
      return d.radius + padding;
    }).iterations(1))
    .on("tick", tick);

  const svg = d3.select("#bubblevis").append("svg")
    .attr("width", width)
    .attr("height", height);

  const node = svg.selectAll("circle")
    .data(nodes)
    .enter().append("g")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  node.append("a")
    .attr("xlink:href", function (d) {
      return getDogBreed(d);
    })
    .attr("target", "_blank")
    .append("circle")
    .style("fill", function (d) {
      return colorScale(d.cluster);
    })
    .attr("r", function (d) {
      return d.radius;
    })
    .on("click", function (e, d) {
      getDogBreed(d);
    })
    .on("mouseover", function (e, d) {
      d3.select(this).style("opacity", 0.75);
      updateDogInfo(d);
    })
    .on("mouseout", function (e, d) {
      d3.select(this).style("opacity", 1);
      updateDogInfo(d);
    });

    var ordinalLegend = d3.scaleOrdinal()
        .domain(["The Bronx", "Brooklyn", "Manhattan","Queens","Staten Island"])
        .range(["#584B53", "#9D5C63", "#D6E3F8", "#94958B", "#E4BB97"]);

    var legendOrdinal = d3.legendColor()
        .labelFormat(d3.format(".0f"))
        .scale(ordinalLegend)
        .shapePadding(5)
        .shapeWidth(20)
        .shapeHeight(20)
        .labelOffset(12);

    svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(5,10)")
        .call(legendOrdinal);

  function getDogBreed(cir) {
    const breed = cir.text.replace(/,/g, '').replace(/\s/g, "+");
    const link = 'http://www.google.com/images?q=' + breed + '+dog';
    return link;
  }

  function updateDogInfo(cir) {
    let info = cir ? `${cir.text}: ${cir.size}` : "";
    d3.select("#dog-info").html(info);
  }

  function tick() {
    node.attr("transform", function (d) {
      return `translate(${d.x},${d.y})`;
    });
  }

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    dfy = null;
  }

  function centerForce(width, height) {
    return function (alpha) {
      for (const cluster of Array.from(m.values())) {
        const nodesInCluster = nodes.filter((d) => d.cluster === cluster.cluster);
        const centerX = d3.mean(nodesInCluster, (d) => d.x);
        const centerY = d3.mean(nodesInCluster, (d) => d.y);
        for (const node of nodesInCluster) {
          node.x += (centerX - node.x) * alpha;
          node.y += (centerY - node.y) * alpha;
        }
      }
    };
  }
});
