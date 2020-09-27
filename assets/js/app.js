// We'll first define our image dimensions. Nice and large.
var svg_width = 1200;
var svg_height = 700;

// I want enough space at the bottom margin for the axis label.
var chart_margin = {
    top: 40,
    right: 40,
    bottom: 100,
    left: 70
};

// The chart itself is defined as such.`
var chartWidth = svg_width - chart_margin.left - chart_margin.right;
var chartHeight = svg_height - chart_margin.top - chart_margin.bottom;

// We need to move the location of the chart based on the margins.
var svg = d3.select("body")
    .append("svg")
    .attr("height", svg_height)
    .attr("width", svg_width)
    .append("g")
    .attr("transform",
    "translate(" + chart_margin.left + "," + chart_margin.top + ")");

// We'll define empty arrays to hold the values.
var poverty_array = [];
var smokes_array = [];

// We will now read the data and fill out the chart.
d3.csv("assets/data/data.csv").then(function(data) {
    // The array values need to be numericized first.
    data.forEach(function(state) {
        state.poverty = +state.poverty;
        // The arrays will be useful later when we
        // determine the domains for the x and y axes.
        poverty_array.push(state.poverty);

        state.smokes = +state.smokes;
        smokes_array.push(state.smokes);
    });
    console.log(poverty_array);
    console.log(smokes_array);
    
    // We'll now use D3's scaleLinear function to build our axes.
    var x_axis = d3.scaleLinear()
        // The domain is between the mininum and maximum values
        // in the poverty array. I have subtracted 2 from the
        // min and added 2 to the max so there's more space.
        .domain([d3.min(poverty_array) - 2, d3.max(poverty_array) + 2])
        .range([0, chartWidth]);
    svg.append("g")
        // We need to move the axis so it aligns with the bottom
        // of the chart.
        .attr("transform", "translate(0," + chartHeight + ")")
        // We now need to define the axis.
        .call(d3.axisBottom(x_axis));
    
    // Now for the y axis.
    var y_axis = d3.scaleLinear()
        .domain([d3.min(smokes_array) - 2, d3.max(smokes_array) + 2])
        // The range is set up this way because the line
        // stretches downwards (which is negative).
        .range([chartHeight, 0]);
    svg.append("g")
        .call(d3.axisLeft(y_axis));

    // We'll need our axis labels later.
    var x_axis_label = -40;
    var y_axis_label = chartHeight / 2;

    // We now need to populate the chart with the dots.
    svg.append("g")
        .selectAll("scatter")
        .data(data)
        .enter()
        .append("circle")
            // The center of the dot is based on the values.
            // The x axis focuses on poverty rate, while the
            // y axis focuses on smoking rate.
            .attr("cx", function (state) { return x_axis(state.poverty); })
            .attr("cy", function (state) { return y_axis(state.smokes); })
            // The radius should be large enough to fit
            // the state abbreviations.
            .attr("r", 12)
            // I like maroon!
            .style("fill", "#FF0049")
    // The state abbreviations will be similarly added.
    svg.append("g")
        .selectAll("scatter")
        .data(data)
        .enter()    
        .append("text")
        // The x and y coordinates are adjusted slightly so that
        // they won't wedge outside of the circle.
        .attr("x", function (state) { return x_axis(state.poverty) - 6; })
        .attr("y", function (state) { return y_axis(state.smokes) + 3; })
        .text(function (state) { return state.abbr })
        .attr("font-family", "verdana")
        .attr("fill", "white")
        .attr("font-size", "10px")
    // Finally, I am adding the axis labels.
    svg.append("g")
        .attr('transform', 'translate(' + x_axis_label + ', ' + y_axis_label + ')')
        .append("text")
        // Text anchoring helps center the text.
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("% Smokers");
    svg.append("g")
        // I found that translating 600 and 600 puts the
        // poverty axis label in an ideal place.
        .attr('transform', 'translate(' + "600" + ', ' + "600" + ')')
        .append("text")
        .attr("text-anchor", "middle")
        .text("% in Poverty");

})