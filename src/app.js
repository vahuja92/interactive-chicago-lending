// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)

import * as d3 from 'd3';

//var promises = d3.json('./data/neighborhood_loans.geojson')

//Promise.all(promises).then(ready)

//function ready()

const testFn = (json) => {

};

//https://bl.ocks.org/EveTheAnalyst/f2964f0dd889a55638d2d82e5c2fe18f
Promise.all([
    d3.json('./data/neighborhood_loans.geojson'),
    d3.json('./data/neighborhood_avg_bubble_chart.json'),
]).then(
  function(json) {
    console.log("Am I getting here 2")
    const width = 960;
    const height = 500;
    const margin = {
      top: 1,
      left: 1,
      right: 1,
      bottom: 1
    };

  var svg = d3.select("body").append('svg')
      .attr('width', margin.left + width + margin.right)
      .attr('height', margin.top + height + margin.bottom);


  var projection = d3.geoIdentity().reflectY(true).fitSize([width,height], json[0])

  var path = d3.geoPath().projection(projection);

  var color = d3.scaleThreshold()
    .domain([0, .25, .5, 1, 1.5, 2, 2.5])
    .range(d3.schemeBlues[7]);

  var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
//https://bl.ocks.org/adamjanes/6cf85a4fd79e122695ebde7d41fe327f
  svg.selectAll('path')
      .data(json[0].features)
      .enter()
      .append('path')
    .attr("fill", function(d) { return color(d.total = d.properties['loans_per_100_2017']); })
    .attr('d', path)
    .on("mouseover", function(d) {
      tooltip.transition()
      .duration(200)
      .style("opacity", .9)
      tooltip.html(d.properties.community)
    })
      .on("mouseout", function(d) {
          tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })

  ////////////////////////////////////////////////////
      // Scatter Bubble Plot
  ////////////////////////////////////////////////////
  // setup x
var xValue = function(d) { return d.black_hispanic_perc;}, // data -> value
    xScale = d3.scaleLinear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom(xScale);

// setup y
var yValue = function(d) { return d.median_income_2017;}, // data -> value
    yScale = d3.scaleLinear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft(yScale);

// add the graph canvas to the body of the webpage
var svg1 = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x-axis
  svg1.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Percent Population Black and Latinx");

  // y-axis
  svg1.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("2017 Median Income");

  // draw dots
  svg1.selectAll(".dot")
      .data(json[1])
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", 	"#000000")
  });
