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
        .attr('class','tooltip')
        .text(function(d) { return d.AnimalName; })
        .append("span")
        .attr('class','tooltiptext')
        .text(function(d) {return (d.n + " dogs");});
        
        var keywords = document.querySelector('#namelist');

    keywords.addEventListener('click', function(event){
        var target = event.target.textContent;
        var regex = new RegExp("[A-Z]+");
        var string = keywords.textContent
        target = regex.exec(target)[0];
        var uniquenames = ["BELLA", "MAX", "ROCKY", "PRINCESS", "COCO", 'LUCKY', 'LOLA', 'OREO', 'BUDDY', 'PRINCE', "CHARLIE", "LUCY", "DAISY", "OLIVER", "BAILEY", "TEDDY", "MOLLY"]
        
        if (uniquenames.includes(target)){
            var bronx = '<ul id="boroughlist">The Bronx<li class="tooltip">BELLA<span class="tooltiptext">128 dogs</span></li><li class="tooltip">MAX<span class="tooltiptext">122 dogs</span></li><li class="tooltip">ROCKY<span class="tooltiptext">117 dogs</span></li><li class="tooltip">PRINCESS<span class="tooltiptext">113 dogs</span></li><li class="tooltip">COCO<span class="tooltiptext">94 dogs</span></li><li class="tooltip">LUCKY<span class="tooltiptext">85 dogs</span></li><li class="tooltip">LOLA<span class="tooltiptext">81 dogs</span></li><li class="tooltip">OREO<span class="tooltiptext">65 dogs</span></li><li class="tooltip">BUDDY<span class="tooltiptext">58 dogs</span></li><li class="tooltip">PRINCE<span class="tooltiptext">57 dogs</span></li>';
            var brooklyn = '<ul id="boroughlist">Brooklyn<li class="tooltip">BELLA<span class="tooltiptext">232 dogs</span></li><li class="tooltip">MAX<span class="tooltiptext">219 dogs</span></li><li class="tooltip">CHARLIE<span class="tooltiptext">168 dogs</span></li><li class="tooltip">ROCKY<span class="tooltiptext">167 dogs</span></li><li class="tooltip">LUCKY<span class="tooltiptext">161 dogs</span></li><li class="tooltip">LOLA<span class="tooltiptext">143 dogs</span></li><li class="tooltip">COCO<span class="tooltiptext">140 dogs</span></li><li class="tooltip">PRINCESS<span class="tooltiptext">131 dogs</span></li><li class="tooltip">LUCY<span class="tooltiptext">129 dogs</span></li><li class="tooltip">DAISY<span class="tooltiptext">125 dogs</span></li></ul>';
            var manhattan = '<ul id="boroughlist">Manhattan<li class="tooltip">CHARLIE<span class="tooltiptext">285 dogs</span></li><li class="tooltip">LUCY<span class="tooltiptext">285 dogs</span></li><li class="tooltip">LOLA<span class="tooltiptext">261 dogs</span></li><li class="tooltip">MAX<span class="tooltiptext">248 dogs</span></li><li class="tooltip">BELLA<span class="tooltiptext">239 dogs</span></li><li class="tooltip">COCO<span class="tooltiptext">217 dogs</span></li><li class="tooltip">OLIVER<span class="tooltiptext">171 dogs</span></li><li class="tooltip">DAISY<span class="tooltiptext">164 dogs</span></li><li class="tooltip">BAILEY<span class="tooltiptext">153 dogs</span></li><li class="tooltip">TEDDY<span class="tooltiptext">152 dogs</span></li></ul>';
            var queens = '<ul id="boroughlist">Queens<li class="tooltip">MAX<span class="tooltiptext">239 dogs</span></li><li class="tooltip">BELLA<span class="tooltiptext">230 dogs</span></li><li class="tooltip">ROCKY<span class="tooltiptext">205 dogs</span></li><li class="tooltip">COCO<span class="tooltiptext">190 dogs</span></li><li class="tooltip">LUCKY<span class="tooltiptext">162 dogs</span></li><li class="tooltip">CHARLIE<span class="tooltiptext">139 dogs</span></li><li class="tooltip">BUDDY<span class="tooltiptext">125 dogs</span></li><li class="tooltip">PRINCESS<span class="tooltiptext">122 dogs</span></li><li class="tooltip">DAISY<span class="tooltiptext">117 dogs</span></li><li class="tooltip">LOLA<span class="tooltiptext">109 dogs</span></li></ul>';
            var statenisland = '<ul id="boroughlist">Staten Island<li class="tooltip">BELLA<span class="tooltiptext">142 dogs</span></li><li class="tooltip">ROCKY<span class="tooltiptext">106 dogs</span></li><li class="tooltip">MAX<span class="tooltiptext">105 dogs</span></li><li class="tooltip">BUDDY<span class="tooltiptext">102 dogs</span></li><li class="tooltip">COCO<span class="tooltiptext">76 dogs</span></li><li class="tooltip">BAILEY<span class="tooltiptext">72 dogs</span></li><li class="tooltip">LOLA<span class="tooltiptext">72 dogs</span></li><li class="tooltip">MOLLY<span class="tooltiptext">71 dogs</span></li><li class="tooltip">CHARLIE<span class="tooltiptext">65 dogs</span></li><li class="tooltip">LUCKY<span class="tooltiptext">60 dogs</span></li></ul>';
            var the_broughs = [bronx, brooklyn, manhattan, queens, statenisland];
            var highlight = '<span class="highlight">' + target + '</span>';
            
            if(target != "PRINCE"){
                for (var i = 0; i < the_broughs.length; i++){
                    var current = the_broughs[i];
                    the_broughs[i] = current.replace(new RegExp(target, "g"), highlight);
                }
            }
            
            else{
                the_broughs[0] = '<ul id="boroughlist">The Bronx<li class="tooltip">BELLA<span class="tooltiptext">128 dogs</span></li><li class="tooltip">MAX<span class="tooltiptext">122 dogs</span></li><li class="tooltip">ROCKY<span class="tooltiptext">117 dogs</span></li><li class="tooltip">PRINCESS<span class="tooltiptext">113 dogs</span></li><li class="tooltip">COCO<span class="tooltiptext">94 dogs</span></li><li class="tooltip">LUCKY<span class="tooltiptext">85 dogs</span></li><li class="tooltip">LOLA<span class="tooltiptext">81 dogs</span></li><li class="tooltip">OREO<span class="tooltiptext">65 dogs</span></li><li class="tooltip">BUDDY<span class="tooltiptext">58 dogs</span></li><li class="tooltip"><span class="highlight">PRINCE</span><span class="tooltiptext">57 dogs</span></li>';
            }

            var final_html = the_broughs.join("");
            keywords.innerHTML = final_html;
        }
    }, false);
});

