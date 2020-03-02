// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)

import * as d3 from 'd3';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ZOOM_THRESHOLD = [0.3, 7];
const OVERLAY_MULTIPLIER = 10;
const OVERLAY_OFFSET = OVERLAY_MULTIPLIER / 2 - 0.5;
const ZOOM_DURATION = 500;
const ZOOM_IN_STEP = 2;
const ZOOM_OUT_STEP = 1 / ZOOM_IN_STEP;
const HOVER_COLOR = "#d36f80"

//https://bl.ocks.org/EveTheAnalyst/f2964f0dd889a55638d2d82e5c2fe18f
d3.json(
  './data/neighborhood_loans.geojson').then(
  function(json) {
    console.log("Am I getting here")
    const width = 900;
    const height = 450;
    const margin = {
      top: 1,
      left: 1,
      right: 1,
      bottom: 1
    };

   var svg = d3.select('#map').append('svg')
      .attr('width', margin.left + width + margin.right)
      .attr('height', margin.top + height + margin.bottom);

  //var scale = 150;
  //var projection = d3.geoIdentity().reflectY(true).fitSize([width,height], json)
  var projection = d3.geoIdentity().reflectY(true).fitSize([width/3,height/8], json)
  //var center = d3.geoCentroid(json)
  //console.log(center)
  //var scale = 150;
  //var projection = d3.geoMercator().scale(scale).center(center);

  var path = d3.geoPath().projection(projection);

    //var geoGenerator = d3.geoPath().projection();
    
    svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path)

      //.attr('d', d => geoGenerator(d))
     /////////////////////////////////////////////
     //////// Here we will put a lot of code concerned
     //////// with drawing the map. This will be defined
     //////// in the next sections.
     /////////////////////////////////////////////

  });
