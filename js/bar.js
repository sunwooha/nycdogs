var margin = {top: 45, right: 100, bottom: 20, left: 20},
    width = 500 - margin.left - margin.right,
    height = 115 - margin.top - margin.bottom;

var color = d3.scale.threshold()
    .range(['#fffafa','#f1eae9','#e5dad8','#d7cbc8','#cabab7','#bdaba7','#b09d98','#a38d88','#978079','#8a716a'])
    //.range(['#fffafa','#f5e7e8','#ead5d6','#e0c4c5','#d5b1b4','#caa0a3','#bf8f92','#b47e82','#a96d72','#9d5c63'])
    .domain([0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 4000]);

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

// Scales. Note the inverted domain fo y-scale: bigger is up!
var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>" + "</strong><span style='color:#fffafa'>" + d.n + " dogs are " + d.AgeAsOf2015 + "! </span>";
  })

d3.csv("data/age_distribution.csv", type, function(data) {
  // Data is nested by country
  var boroughs = d3.nest()
      .key(function(d) { return d.Borough; })
      .entries(data);
  // Compute the minimum and maximum age and n across symbols.
  x.domain(data.map(function(d) { return d.AgeAsOf2015; }));
  y.domain([0, d3.max(boroughs, function(s) { return s.values[0].n; })]);

  // Add an SVG element for each borough, with the desired dimensions and margin.
  var svg = d3.select("#barvis").selectAll("svg")
    .data(boroughs)
    .enter()
    .append("svg:svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 60)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
    .append("text")
    .attr("x", width/3 + 20)
    .attr("y", height+40)
    .attr("dy", ".71em")
    .attr("text-anchor", "start")
    .attr("font-size", "1.1em")
    .attr("font-weight", "bold")
    .text(function(d) {
        if(d.key == "Bronx"){
            return "The Bronx";
        }
        else{
            return d.key;
        }
    });

  svg.selectAll(".bar")
      .data(function(d) {return d.values;})
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.AgeAsOf2015); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.n); })
      .attr("height", function(d) { return height - y(d.n); })
      .attr("fill", function(d) {return color(d.n)})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

  svg.call(tip);

});

function type(d) {
  d.n = +d.n;
  return d;
}