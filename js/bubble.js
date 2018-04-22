var width1 = 900,
    height1 = 700,
    padding = 1.5, // separation between same-color nodes
    clusterPadding = 6, // separation between different-color nodes
    maxRadius = 8;

var colorScale = d3.scale.ordinal()
    .range(["#584B53", "#9D5C63", "#D6E3F8", "#94958B", "#E4BB97"]);

d3.text("data/breeds_borough_count.csv", function(error, text) {
    if (error) throw error;
    var colNames = "group,text,size\n" + text;
    var data = d3.csv.parse(colNames);

data.forEach(function(d) {
    d.size = +d.size;
});

//unique cluster/group id's
var cs = [];
data.forEach(function(d){
    if(!cs.includes(d.group)) {
        cs.push(d.group);
    }
});

var n = data.length, // total number of nodes
    m = cs.length; // number of distinct clusters

//create clusters and nodes
var clusters = new Array(m);
var nodes = [];
for (var i = 0; i<n; i++){
    nodes.push(create_nodes(data,i));
}

var force = d3.layout.force()
    .nodes(nodes)
    .size([width1, height1])
    .gravity(.02)
    .charge(0)
    .on("tick", tick)
    .start();

var svg = d3.select("#bubblevis").append("svg")
    .attr("width", width1)
    .attr("height", height1)

var node = svg.selectAll("circle")
    .data(nodes)
    .enter().append("g")
    .call(force.drag);

node.append("circle")
    .style("fill", function (d) {
        return colorScale(d.cluster);
    })
    .attr("r", function(d){return d.radius})
    .on("mouseover", function(d){
        d3.select(this).style("opacity", 0.75);
        updateDogInfo(d)})
    .on("mouseout", function(d){
        d3.select(this).style("opacity", 1);
        updateDogInfo(d)});

svg.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", "translate(5,10)");

var ordinalLegend = d3.scale.ordinal()
    .domain(["The Bronx", "Brooklyn", "Manhattan","Queens","Staten Island"])
    .range(["#584B53", "#9D5C63", "#D6E3F8", "#94958B", "#E4BB97"]);

var legendOrdinal = d3.legend.color()
    .labelFormat(d3.format(".0f"))
    .scale(ordinalLegend)
    .shapePadding(5)
    .shapeWidth(20)
    .shapeHeight(20)
    .labelOffset(12);

svg.select(".legendOrdinal")
    .call(legendOrdinal);

    function updateDogInfo(cir) {
        var info = "";
        if (cir) {
            info = [cir.text, cir.size].join(": ");
        }
        else{
            info = "";
        }
        d3.select("#dog-info").html(info);
    };

    function create_nodes(data,node_counter) {
    var i = cs.indexOf(data[node_counter].group),
        r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
        d = {
            borough: data[node_counter].group,
            text: data[node_counter].text,
            size: data[node_counter].size, 
            cluster: i,
            radius: Math.log2(data[node_counter].size)*(maxRadius/(5)),
            x: Math.cos(i / m * 2 * Math.PI) * 100 + width1 / 2 + Math.random(),
            y: Math.sin(i / m * 2 * Math.PI) * 100 + height1 / 2 + Math.random()
        };
    if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
    return d;
    };

    function tick(e) {
        node.each(cluster(10 * e.alpha * e.alpha))
            .each(collide(.5))
        .attr("transform", function (d) {
            var k = "translate(" + d.x + "," + d.y + ")";
            return k;
        })

    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
        return function (d) {
            var cluster = clusters[d.cluster];
            if (cluster === d) return;
            var x = d.x - cluster.x,
                y = d.y - cluster.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + cluster.radius;
            if (l != r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                cluster.x += x;
                cluster.y += y;
            }
        };
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
        var quadtree = d3.geom.quadtree(nodes);
        return function (d) {
            var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function (quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }
});         