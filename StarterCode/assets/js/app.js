// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// // Step 3:
// // Import data from the data.csv file
// // ================================= 
d3.csv("assets/data/data.csv").then(function(hdata) {
    
    
//    // Parse Data/Cast as numbers
//      // ==============================
    hdata.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
    console.log(hdata);
     });
   
//     // Create scale functions
// //     // ==============================
    var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(hdata, d => d.poverty)])
    .range([0, width]);
    

    var yLinearScale = d3.scaleLinear()
    .domain([4, d3.max(hdata, d => d.healthcare)])
    .range([height, 0]);
    
// //     // Create axis functions
// //     // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


// //     //Create Circles
// //     // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(hdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("class", "stateCircle")
   

     var circlesText =  chartGroup.selectAll("text")
       .data(hdata)
       .enter()
       .append("text")
     .attr("x", d => xLinearScale(d.poverty))
     .attr("y", d => yLinearScale(d.healthcare))
     .attr("dy", ".35em")
     .text(function(d){
            return d.abbr;
        })
    .attr("class", "stateText");
    
// //     // Initialize tool tip
// //     // ==============================
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    });

// //     // Create tooltip in the chart
// //     // ==============================
    chartGroup.call(toolTip); 


// //     // Create event listeners to display and hide the tooltip
// //     // ==============================
// //     // onmouseover event
    circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
    
//       //Append Axes to the chart
//     // ==============================
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

  // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 2)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Lack of Healthcare(%)");

    chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 25})`)
    .attr("class", "aText")
    .text("Poverty (%)");
 }); 