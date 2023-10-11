d3.csv("data/top_10_popular_names_borough.csv").then(function(data) {
    var boroughs2 = Array.from(d3.group(data, d => d.BoroughName), ([key, values]) => ({ key, values }));
      
    boroughs2.forEach(function(d) {
      d.values.sort(function(a, b) {
        return d3.descending(+a.n, +b.n)
      });
    });
  
    var list = d3.select('#namelist').selectAll('ul')
      .data(boroughs2)
      .enter().append('ul')
      .attr('id', 'boroughlist')
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
      .attr('class', 'tooltip')
      .append('span')
      .attr('class', function(d) { return d.AnimalName; })
      .text(function(d) { return d.AnimalName; })
      .on('click', function(e, d){
        d3.selectAll('.highlight').classed('highlight', false);
        d3.selectAll('.'+d.AnimalName).classed('highlight', true);
      })
      .append("span")
      .attr('class','tooltiptext')
      .text(function(d) {return (d.n + " dogs");});  
  });
  