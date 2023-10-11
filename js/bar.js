// Define your margin and dimensions
let margin = { top: 45, right: 100, bottom: 20, left: 20 };
const barwidth = 500 - margin.left - margin.right;
const barheight = 155 - margin.top - margin.bottom;

// Define your color scale
const color = d3.scaleThreshold()
  .domain([0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 4000])
  .range(['#fffafa', '#f1eae9', '#e5dad8', '#d7cbc8', '#cabab7', '#bdaba7', '#b09d98', '#a38d88', '#978079', '#8a716a']);

// Define x and y scales
const x = d3.scaleBand()
  .range([0, barwidth])
  .padding(0.1);

const y = d3.scaleLinear()
  .range([barheight, 0]);

// Define x and y axes
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);

// Read the CSV data
d3.csv("data/age_distribution.csv", type).then((data) => {
  // Data is nested by borough
  const boroughs = d3.group(data, (d) => d.Borough);

  // Define a tooltip
  let tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html((e, d) => {
      return `<strong></strong><span style='color:#fffafa'>${d.n} dogs are ${d.AgeAsOf2015}!</span>`;
    });

  // Compute the domain of x and y scales
  x.domain(data.map((d) => d.AgeAsOf2015));
  y.domain([0, d3.max(boroughs, (s) => d3.max(s[1], (d) => d.n))]);

  // Create SVG elements for each borough
  const svg = d3.select(".barvis")
    .selectAll("svg")
    .data(boroughs)
    .join("svg")
    .attr("width", barwidth + margin.left + margin.right)
    .attr("height", barheight + margin.top + margin.bottom + 60)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create x-axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${barheight})`)
    .call(xAxis);

  // Create text labels for each borough
  svg.append("g")
    .append("text")
    .attr("x", barwidth / 3 + 20)
    .attr("y", barheight + 40)
    .attr("dy", ".71em")
    .attr("text-anchor", "start")
    .attr("font-size", "1.1em")
    .attr("font-weight", "bold")
    .text((d) => (d[0] === "Bronx" ? "The Bronx" : d[0]));

  // Create bars
  svg.selectAll(".bar")
    .data((d) => d[1])
    .join("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.AgeAsOf2015))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d.n))
    .attr("height", (d) => barheight - y(d.n))
    .attr("fill", (d) => color(d.n))
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

  // Call the tooltip
  svg.call(tip);
});

// Define the type function
function type(d) {
  d.n = +d.n;
  return d;
}
