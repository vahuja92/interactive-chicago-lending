// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)

// Inspiration for code:
  // Alena Stern's project: https://github.com/alenastern/interactive_aid_map
// Sources (also listed in code):
  // https://bl.ocks.org/EveTheAnalyst/f2964f0dd889a55638d2d82e5c2fe18f
  // https://bl.ocks.org/adamjanes/6cf85a4fd79e122695ebde7d41fe327f
  // http://bl.ocks.org/kbroman/ded6a0784706a109c3a5
  // https://bl.ocks.org/d3noob/a22c42db65eb00d4e369


import * as d3 from 'd3';
import './stylesheets/main.css';


const testFn = (json) => {

};

//https://bl.ocks.org/EveTheAnalyst/f2964f0dd889a55638d2d82e5c2fe18f
Promise.all([
    d3.json('./data/neighborhood_loans_v1.geojson'),
    d3.json('./data/neighborhood_avg_bubble_chart.json'),
]).then(
  function(json) {
    console.log("Am I getting here 2")
    console.log(json[0])
    const width = 960;
    const height = 500;
    const margin = {
      top: 1,
      left: 1,
      right: 1,
      bottom: 1
    };

  var svg = d3.select("#chart2").append('svg')
      .attr('width', margin.left + width + margin.right)
      .attr('height', margin.top + height + margin.bottom);


  var projection = d3.geoIdentity().reflectY(true).fitSize([width,height], json[0])

  var path = d3.geoPath().projection(projection);

  var color = d3.scaleThreshold()
    .domain([0, .25, .5, 1, 1.5, 2, 2.5])
    .range(d3.schemeBlues[7]);

  var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)


//https://bl.ocks.org/adamjanes/6cf85a4fd79e122695ebde7d41fe327f
  svg.selectAll('path')
      .data(json[0].features)
      .enter()
      .append('path')
    .attr("fill", function(d) { return color(d.total = d.properties['loans_per_100_2017']); })
    .attr('d', path)
    .attr("class", function(d,i) { return "pt" + i; })
    .on("mouseover", function(d, i) {
      tooltip.transition()
          .duration(200)
          .style("opacity", .9);
      tooltip.html("<span style='margin-left: 2.5px;'><b>" + d.properties.community + "</b></span><br>" +
                    "Loans in 2017: " +  d.properties.loans_2017 + "</b></span><br>" +
                    "Loans in 2007: " + d.properties.loans_2007)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");

      // tooltip.transition()
      // .duration(200)
      // .style("opacity", .9)
      // tooltip.html(d.properties.community)
      d3.selectAll("circle.pt" + i)
          .attr("stroke-width", 4)
          .attr("stroke", "red");
      d3.selectAll("path.pt" + i)
          .attr("stroke-width", 2)
          .attr("stroke", "red");
      })
      .on("mouseout", function(d, i) {
        tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
        d3.selectAll("circle.pt" + i)
        .attr("stroke-width", 0)
        d3.selectAll("path.pt" + i)
            .attr("stroke-width", 0);
    })

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Loan Originations by Neighborhood");



  ////////////////////////////////////////////////////
      // Scatter Bubble Plot
  ////////////////////////////////////////////////////

  		var padding = 40;
  		var xScale = d3.scaleLinear()
  			.domain([0, 1])
  			.range([padding, width - padding * 2]);

      var y = d3.scaleLinear().range([height, 0]);
      y.domain([0, d3.max(json[0].features, function(d) {return d.properties.income;})])

  		var xAxis = d3.axisBottom().scale(xScale).ticks(5);

  		var yAxis = d3.axisLeft().scale(y).ticks(5);

      var r1popScale = d3.scaleLinear()
      .domain([0, 4])
      .range([2, 20])

  		//create svg element
  		var svg1 = d3.select("#chart1")
  					.append("svg")
            .attr("class", "bubble-chart")
  					.attr("width", width)
  					.attr("height", height);

      console.log('circle:', svg1.selectAll("circle"))
      console.log(json)
  		svg1.selectAll("circle")
  			.data(json[0].features)
  			.enter()
  			.append("circle")
        .attr("class", function(d,i) { return "pt" + i; })
  			.attr("cx", function(d) {
  				return xScale(d.properties.black_hispanic_perc);
  			})
        .attr("cy", function(d) {
          return y(d.properties.income);
        })
        .attr("r", d => r1popScale(d.properties.loans_per_100_2017))
        .attr("fill", function(d) { return color(d.total = d.properties['loans_per_100_2017']); })
        //http://bl.ocks.org/kbroman/ded6a0784706a109c3a5
        .on("mouseover", function(d, i) {
          console.log(i)
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html("<span style='margin-left: 2.5px;'><b>" + d.properties.community + "</b></span><br>" +
                        "Loans in 2017: " +  d.properties.loans_2017 + "</b></span><br>" +
                        "Loans in 2007: " + d.properties.loans_2007)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
          d3.selectAll("path.pt" + i)
              .attr("stroke-width", 5)
              .attr("stroke", "red");

          d3.selectAll("circle.pt" + i)
          .attr("stroke-width", 3)
          .attr("stroke", "red");
        })
      .on("mouseout", function(d, i) {
        tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
          d3.selectAll("path.pt" + i)
          .attr("stroke-width", 0)
          d3.selectAll("circle.pt" + i)
          .attr("stroke-width", 0)
    })



		//x axis
		svg1.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (height - padding) + ")")
			.call(xAxis)
      ;

    // text label for the y axis
    // text label for the y axis
    svg1.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 25)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Median Income of Neighborhood");

    // text label for the x axis
    svg1.append("text")
    .attr("transform",
          "translate(" + (width/2) + " ," +
                         (height+1) + ")")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Percent Black and Latino");

		//y axis
		svg1.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + padding + ", 0)")
      .style("font-size", "12px")
			.call(yAxis);

    // title
    svg1.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Loans by Neighborhood Median Income and Percent Residents of Color");


   });
