function calfire(year=2017) {
    // Get clean data
    clean = (d) => {
        var format = d3.time.format("%Y-%m-%d");
        var intensityFloor = (a) => {
            return Math.round(10 * a) / 10;
        };
        return {
            taskName: d.name,
            startDate: format.parse(d.start),
            endDate: format.parse(d.end),
            status: intensityFloor(+d.intensity)
        }
    };
    // To update custom legend
    updateLegend = (legends, vcolor) => {

          var svg = d3.select("svg");
          legends = legends.map(Number).sort();
          var width = parseInt(d3.select('body').select('svg').style('width'));
          var legend = svg.selectAll(".legend")
            .data(legends)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
              return "translate(0," + i * 20 + ")";
            });

            legend.append("rect")
              .attr("x", width - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", function(d, i){return vcolor[i]});

            legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d, i) {
                return d;
              });
    }
    // Generate the appropriate colors for the legend
    colorGenerator = () =>{
          var length = 11, colorScale = [],
              color = d3.scale.linear().domain([1,length])
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb("#133fff"), d3.rgb('#ff110e')]);

          for (var i = 0; i < length; i++) {
              colorScale.push(color(i));
          }
          return colorScale;

    };
    // Call the dataset and generate gantt
    d3.csv("./Datasets/calfire_split/calFire"+year+".csv", clean, (data) => {

        var colorScale = colorGenerator();

        // css edit with dynamic js placement
        // var svg = d3.select("body").append("svg")
        //     .attr("width", w)
        //     .attr("height", h);

        var taskNames = [];
        for (var i = 0; i < data.length; i++) {
            taskNames.push(data[i].taskName);
        }
        var tickFormat = "%d-%m-%Y";
        var taskStatus = {
            0: "bar0",
            0.1: "bar1",
            0.2: "bar2",
            0.3: "bar3",
            0.4: "bar4",
            0.5: "bar5",
            0.6: "bar6",
            0.7: "bar7",
            0.8: "bar8",
            0.9: "bar9",
            1: "bar10",
        };
        var gantt = d3.gantt().taskTypes(taskNames).taskStatus(taskStatus).tickFormat(tickFormat);
        gantt(data, year);

        updateLegend(Object.keys(taskStatus), colorScale);
        let colors = [];
        for(i=0; i<=10; i++){
            colors.push(colorScale[i])
        };
        updateIntensity(colors);

    });

    const updateIntensity = (color) =>{
        $(".bar0").css("fill", color[0]);
        $(".bar1").css("fill",color[1]);
        $(".bar2").css("fill",color[2]);
        $(".bar3").css("fill",color[3]);
        $(".bar4").css("fill",color[4]);
        $(".bar5").css("fill",color[5]);
        $(".bar6").css("fill",color[6]);
        $(".bar7").css("fill",color[7]);
        $(".bar8").css("fill",color[8]);
        $(".bar9").css("fill",color[9]);
        $(".bar10").css("fill",color[10]);

    };
}





