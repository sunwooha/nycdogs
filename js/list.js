d3.csv("data/top_10_popular_names_borough.csv", type, function(data) {
    var boroughs2 = d3.nest()
      .key(function(d) { return d.BoroughName; })
      .entries(data);
    
    boroughs2.forEach(function(d) {
        d.values.sort(function(a, b) {
            return d3.descending(+a.n, +b.n)
        });
    });

    console.log(boroughs2);

    var list = d3.select('#namevis').selectAll('ul')
        .data(boroughs2)
        .enter().append('ul')
        .text(function(d) {
            if(d.key == "Bronx"){
                return "The Bronx";
            }
            else{
                return d.key;
            }
        })
        .selectAll("li")
        .data(function(d) {return d.values;})
        .enter().append('li')
        .text(function(d) { return d.AnimalName; });
});