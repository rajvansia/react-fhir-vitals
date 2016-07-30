$(document).ready(function(){
var n = 20,
  random = d3.random.normal(96, 2),
  data = d3.range(n).map(random);

var margin = {top: 20, right: 20, bottom: 20, left: 40},
  width = 560 - margin.left - margin.right,
  height = 100 - margin.top - margin.bottom;

var x = d3.scale.linear()
  .domain([1, n - 2])
  .range([0, width]);

var y = d3.scale.linear()
  .domain([80, 100])
  .range([height, 0]);
//
var line = d3.svg.line()
  .interpolate("basis")
  .x(function(d, i) { return x(i); })
  .y(function(d, i) { return y(d); });


var highline = d3.svg.line()
  .x(function(d, i) { return x(i); })
  .y(y(100));

var lowline = d3.svg.line()
  .x(function(d, i) { return x(i); })
  .y(y(95));

//render the graph area on the body dom element on the html page
var svg = d3.select("spo").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("defs").append("clipPath")
  .attr("id", "clip")
.append("rect")
  .attr("width", width)
  .attr("height", height);


svg.append("g")
  .attr("class", "y axis")
  .call(d3.svg.axis().scale(y).orient("left"));

var path = svg.append("g")
  .attr("clip-path", "url(#clip)")
  .append("path")
  .datum(data)
  .attr("class", "line")
  .attr("d", line);

var highpath = svg.append("g")
  .attr("clip-path", "url(#clip)")
  .append("path")
  .style("stroke-dasharray", "4,4")
  .datum(data)
  .attr("class", "tolerance")
  .attr("d", highline);

var lowpath = svg.append("g")
  .attr("clip-path", "url(#clip)")
  .append("path")
  .style("stroke-dasharray", "4,4")
  .datum(data)
  .attr("class", "tolerance")
  .attr("d", lowline);

var dots =  svg.append("g");
  dots.attr("clip-path", "url(#clip)");
    dots.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("r", 0)
      .style("fill",function(d){if(d<95){return "red"}else if(d>=95){return "transparent"} })
      .attr("cx", function(d,i) { return x(i); })
      .attr("cy", function(d,i) { return y(d); })
tick();
var generate=false
$("#start").click(function(){
generate=true
tick()
});
$("#stop").click(function(){
generate=false
tick()
});
function tick() {
  if (generate){

    const   pubnub = PUBNUB({
      publish_key : 'pub-c-3f8a91d6-9bed-4650-baba-c08df033f657',
      subscribe_key : 'sub-c-b6b3acea-5147-11e6-8b3b-02ee2ddab7fe',
      ssl: true
  })
const channel = 'fhir';
const channelStop = 'stop';
var spo = 0;
spo = Math.floor(random());
 pubnub.publish({
  channel : channel,
  message :spo,
});


// push a new data point onto the back

data.push(spo);
console.log(spo);
if(spo<95){
    $("#spo2").css("color","red").text(Math.floor(spo)+"%");
}
else{
    $("#spo2").css("color","white").text(Math.floor(spo)+"%");
}
// redraw the line, and slide it to the left
dots
    .attr("d", dots)
    .attr("transform",  "translate(" + x(1) + ",1)")
  .transition()
    .duration(3000)
    .ease("linear")
    .attr("transform", "translate(" + x(0) + ",0)")
path
    .attr("d", line)
    .attr("transform", null)
  .transition()
    .duration(3000)
    .ease("linear")
    .attr("transform", "translate(" + x(0) + ",0)")
    .each("end", tick);

// pop the old data point off the front
data.shift();

}
}


  });
