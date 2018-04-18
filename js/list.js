d3.csv("data/top_10_popular_names_borough.csv", type, function(data) {
    var boroughs2 = d3.nest()
      .key(function(d) { return d.BoroughName; })
      .entries(data);
    
    boroughs2.forEach(function(d) {
        d.values.sort(function(a, b) {
            return d3.descending(+a.n, +b.n)
        });
    });

    var list = d3.select('#namelist').selectAll('ul')
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
        .attr('class','tooltip')
        .text(function(d) { return d.AnimalName; })
        .append("span")
        .attr('class','tooltiptext')
        .text(function(d) {return (d.n + " dogs");})
});
/*var keywords = document.querySelector('#namelist');

keywords.addEventListener('click', function(event){
    var target = event.target;
    var text = keywords.textContent;
    console.log("This is target: " + target.textContent);
    console.log("This is text: " + text);
    //var regex = new RegExp('('+target.textContent+')', 'ig');
    //text = text.replace(regex, '<span class="highlight">$1</span>');
    //sentences.innerHTML = text;
}, false);*/