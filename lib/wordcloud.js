#!/usr/bin/env node
var d3 = require('d3');
var cloud = require('d3.layout.cloud');
var commander = require('commander');
var btoa = require('btoa');
var xmldom = require('xmldom');
var svg2png = require('svg2png');
var fs = require('fs-extra');
var PNG = require('png-js').PNG;
var fill = d3.scale.category20();

cloud().size([300, 300])
      .words([
        "Hello", "world", "normally", "you", "want", "more", "words",
        "than", "this", "more", "thisiscool", "newtest", "what", "what", "what"].map(function(d) {
        return {text: d, size: 10 + Math.random() * 90};
      }))
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();


var fileName = generateAvailableFile();
var input = fileName + ".svg";
var output = fileName + ".png";

writeOutSVG(input);
svgToPng(input, output);

function svgToPng(input, output){
	svg2png(input, output, function (err) {
	    var data = fs.readFileSync(output);
	    process.stdout.write(data);
	    fs.deleteSync(input);
	    fs.deleteSync(output)
	});
}

function generateAvailableFile(){
	var rand =  Math.random() * (1000000 - 1) + 1;
	var file = "graph" + rand;
	var fileSVG = file + ".svg";
	while(fs.existsSync(fileSVG)){
		 rand =  Math.random() * (1000000 - 1) + 1;
		 file = "graph" + rand;
		 fileSVG = file + ".svg";
	}
	return file;
}

function writeOutSVG(input){
	// get a reference to our SVG object and add the SVG NS  
	var svgGraph = d3.select('svg')
	  .attr('xmlns', 'http://www.w3.org/2000/svg');
	var svgXML = (new xmldom.XMLSerializer()).serializeToString(svgGraph[0][0]);
	svgXML = svgXML.toLowerCase()
	fs.writeFile(input, svgXML);
}

function draw(words) {
	d3.select("body").append("svg")
	    .attr("width", 300)
	    .attr("height", 300)
	  .append("g")
	    .attr("transform", "translate(150,150)")
	  .selectAll("text")
	    .data(words)
	  .enter().append("text")
	    .style("font-size", function(d) { return d.size + "px"; })
	    .style("font-family", "Impact")
	    .style("fill", function(d, i) { return fill(i); })
	    .attr("text-anchor", "middle")
	    .attr("transform", function(d) {
	      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
	    })
	    .text(function(d) { return d.text; });
}


