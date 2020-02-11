$('#timeline1-div').hide();
$('#hT5').hide();

calBox("2017", "T1");


function calBox(year = "2017", model = "T1") {

    const clean = (d) => {

        var intenseList = {
            0: "cA", 0.1: "cB", 0.2: "cC", 0.3: "cD", 0.4: "cE",
            0.5: "cF", 0.6: "cG", 0.7: "cH", 0.8: "cI", 0.9: "cJ", 1: "cK"
        };

        var intensityFloor = (a) => {
            return Math.round(10 * a) / 10;
        };
        var timesFormat = (a, b) => {
            return [{"starting_time": +Date.parse(a), "ending_time": Date.parse(b)},]
        };
        return {
            class: intenseList[intensityFloor(+d.intensity)],
            label: d.name,
            times: timesFormat(d.start, d.end),
            intensity: intensityFloor(+d.intensity),
            ntimes: {"starting_time": d.start, "ending_time": d.end}
        }

    };

    const toolTipInit = (tag, className) => {
        // create a tooltip
        var tooltip = d3.select(tag)
            .append("div")
            .attr("class", className);

        tooltip.append('div')                        // NEW
            .attr('class', 'name');                   // NEW

        tooltip.append('div')                        // NEW
            .attr('class', 'start');                   // NEW

        tooltip.append('div')                        // NEW
            .attr('class', 'end');

        tooltip.append('div')                        // NEW
            .attr('class', 'intensity');
        return tooltip;
    };

    const circleToolTip = (svg, data, tooltip) => {
        svg.selectAll("circle")
            .data(data)
            .on("click", function (d, i) {
                tooltip.select(".name").html(d.label);
                tooltip.select(".start").html(d.ntimes.starting_time);
                tooltip.select(".end").html(d.ntimes.ending_time);
                tooltip.select(".intensity").html(d.intensity);
                tooltip.style('display', 'block')
                    .transition()
                    .delay(600)
                    .style('display', 'none');

            })
            .on("mouseover", function (d, i) {
                tooltip.select(".name").html(d.label);
                tooltip.select(".start").html(d.ntimes.starting_time);
                tooltip.select(".end").html(d.ntimes.ending_time);
                tooltip.select(".intensity").html(d.intensity);
                tooltip.style('display', 'block');
            })
            .on("mouseout", function () {
                tooltip.style("display", "none");
            });
    };

    const DelayCal = (data) => {
        switch (data) {
            case 0:
                return 1000;
            case 0.1:
                return 900;
            case 0.2:
                return 800;
            case 0.3:
                return 700;
            case 0.4:
                return 600;
            case 0.5:
                return 500;
            case 0.6:
                return 400;
            case 0.7:
                return 300;
            case 0.8:
                return 200;
            case 0.9:
                return 100;
            case 1:
                return 50;
        }

    };

    const fillIntensity = (color) => {
        // console.log(color)
        $(".intenseSeries_cA").css("fill", color[0]).css("stroke", color[0]);
        $(".intenseSeries_cB").css("fill", color[1]).css("stroke", color[1]);
        $(".intenseSeries_cC").css("fill", color[2]).css("stroke", color[2]);
        $(".intenseSeries_cD").css("fill", color[3]).css("stroke", color[3]);
        $(".intenseSeries_cE").css("fill", color[4]).css("stroke", color[4]);
        $(".intenseSeries_cF").css("fill", color[5]).css("stroke", color[5]);
        $(".intenseSeries_cG").css("fill", color[6]).css("stroke", color[6]);
        $(".intenseSeries_cH").css("fill", color[7]).css("stroke", color[7]);
        $(".intenseSeries_cI").css("fill", color[8]).css("stroke", color[8]);
        $(".intenseSeries_cJ").css("fill", color[9]).css("stroke", color[9]);
        $(".intenseSeries_cK").css("fill", color[10]).css("stroke", color[10]);
    };

    const varianceCircles = (svg, data) => {

        svg.selectAll("circle").data(data)
            .attr("r", function (d, i) {
                let r = 0.36, min = 4, max = 8;
                if (d.intensity !== 1) {
                    if (d.intensity === 0) {
                        return min;
                    }
                    return (d.intensity * 10 * r) + min;
                }
                return max;
            });
    };

    const makeArrayFromScale = (colorScale) => {
        let colors = [];
        for (i = 0; i <= 11; i++) {
            colors.push(colorScale(i));
        }

        return colors;


    };

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }


    let data = "", length = 0, colorScale1 = "", colorScale2;
    const width = 1000;

    console.log(year, model);

    const init = () => {
        d3.csv("./Datasets/calfire_split/calFire" + year + ".csv", clean, (data1) => {
            data = data1;
        });
        sleep(100).then(() => {
            // console.log(data);
            length = data.length;
            colorScale1 = d3.scale.linear().domain([1, length])
                .interpolate(d3.interpolateHcl)
                .range([d3.rgb("#828384"), d3.rgb('#7142cc')]);
            colorScale2 = d3.scale.linear().domain([1, 11])
                .interpolate(d3.interpolateHcl)
                .range([d3.rgb("#007AFF"), d3.rgb('#ff0f1d')]);

            console.log('Data is read, Beginning Ops');
        });

    };

    init();

    const graph1 = () => {

        console.log('Beginning Graph 1');

        // Plan
        // load the raw data with class: "cA" attributes
        // use("$.timelineSeries_cA").css("fill", "") to fill the circles
        // Replace the circles with icons

        let svg = d3.select("#timeline1").append("svg")
            .attr("width", width)
            // .attr("viewBox",'200,0,150,250')
            .datum(data).call(
                d3.timeline()
                    .colors(colorScale1)
                    .width(width * 4)
                    .itemHeight(20)
                    .itemMargin(2)
                    .lines()
                    .circles()
                // .stack()
                // .scroll(function (x, scale) {
                // $("#scrolled_date").text(scale.invert(x) + " to " + scale.invert(x+width));
                // })
            );

        varianceCircles(svg, data);


        let tooltip = toolTipInit("#timeline1", "tooltip2");

        circleToolTip(svg, data, tooltip);

        fillIntensity(makeArrayFromScale(colorScale2));
    };

    const graph2 = () => {

        console.log('Beginning Graph 2');

        let svg = d3.select("#timeline1").append("svg")
            .attr("width", width)
            // .attr("viewBox",'0,0,150,200')
            .datum(data).call(
                d3.timeline()
                    .colors(colorScale1)
                    .width(width * 4)
                    .itemHeight(20)
                    .itemMargin(2)
                    .lines()
                    .circles()
                //     .stack()
            );
        let tooltip = toolTipInit("#timeline1", "tooltip2");

        varianceCircles(svg, data);

        svg.selectAll("circle")
            .data(data)
            .transition()
            .each("start", function repeat() {
                d3.select(this)
                    .style("fill", "red")
                    .transition()
                    .style("fill", "yellow")
                    .transition()
                    .delay(function (d, i) {
                        return DelayCal(d.intensity);
                    })
                    .style("fill", "yellow")
                    .transition()
                    .each("start", repeat);
            });

        circleToolTip(svg, data, tooltip);


        fillIntensity(makeArrayFromScale(colorScale2));
    };

    const graph3 = (w) => {

        console.log('Beginning Graph 3');
        let width = w * 2;

        let svg = d3.select("#timeline1").append("svg")
            .attr("width", width)
            // .attr("viewBox",'0,0,150,200')
            .datum(data).call(
                d3.timeline()
                    .colors(colorScale1)
                    // .width(width*4)
                    .itemHeight(20)
                    .itemMargin(2)
                    .circles()
                    .stack()
                // .height(600)
            );

        let tooltip = toolTipInit("#timeline1", "tooltip2");

        circleToolTip(svg, data, tooltip);

        const colorScale2 = d3.scale.linear().domain([1, 11])
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb("#007AFF"), d3.rgb('#ff0f1d')]);

        let colors = [];
        for (i = 0; i <= 11; i++) {
            colors.push(colorScale2(i));
        }

        fillIntensity(colors);

    };

    const graph4 = () => {

        console.log('Beginning Graph 4');

        // Plan
        // load the raw data with class: "cA" attributes
        // use("$.timelineSeries_cA").css("fill", "") to fill the circles
        // Replace the circles with icons

        let svg = d3.select("#timeline1").append("svg")
            .attr("width", width)
            // .attr("viewBox",'200,0,150,250')
            .datum(data).call(
                d3.timeline()
                    .colors(colorScale1)
                    .width(width * 4)
                    .itemHeight(0.1)
                    .itemMargin(2)
                    .circles()
                // .stack()
                // .scroll(function (x, scale) {
                // $("#scrolled_date").text(scale.invert(x) + " to " + scale.invert(x+width));
                // })
            );

        varianceCircles(svg, data);

        let tooltip = toolTipInit("#timeline1", "tooltip2");

        svg.selectAll("circle")
            .data(data)
            .transition()
            .each("start", function repeat() {
                d3.select(this)
                    .style("fill", "red")
                    .transition()
                    .style("fill", "yellow")
                    .transition()
                    .delay(function (d, i) {
                        return DelayCal(d.intensity);
                    })
                    .style("fill", "yellow")
                    .transition()
                    .each("start", repeat);
            });

        circleToolTip(svg, data, tooltip);





        fillIntensity(makeArrayFromScale(colorScale2));
    };


    if (model === "T1")
    {
        $('#timeline1-div').show();

        $('#hT1').show();
        $('#hT2').hide();
        $('#hT3').hide();
        $('#hT4').hide();
        $('#hT5').hide();
        sleep(150).then(() => {
            graph1();
        });

    }
    else if (model === "T2")
    {
        $('#hT1').hide();
        $('#hT2').show();
        $('#hT3').hide();
        $('#hT4').hide();
        $('#hT5').hide();
        $('#timeline1-div').show();
        sleep(150).then(() => {
            graph2();
        });

    }
    else if (model === "T3")
    {
        $('#hT1').hide();
        $('#hT2').hide();
        $('#hT3').show();
        $('#hT4').hide();
        $('#hT5').hide();
        $('#timeline1-div').show();
        sleep(150).then(() => {
            graph4();
        });

    }

    else if (model === "TS1")
    {
        $('#hT1').hide();
        $('#hT2').hide();
        $('#hT3').hide();
        $('#hT4').show();
        $('#hT5').hide();
        $('#timeline1-div').show();
        sleep(150).then(() => {
            graph3(width);
        });

    }

}

$( ".target" ).change(function() {
    $('#timeline1').empty();
    $('#gantt1').empty();
    if($( ".target" ).val()[0] === "G1")
    {
        $('#hT5').show();
        $('#timeline1-div').hide();
        calfire($( ".target1" ).val()[0])
    }
    calBox($( ".target1" ).val()[0], $( ".target" ).val()[0] );
});

$( ".target1" ).change(function() {
    $('#timeline1').empty();
    $('#gantt1').empty();
    if($( ".target" ).val()[0] === "G1")
    {
        $('#hT5').show();
        $('#timeline1-div').hide();
        calfire($( ".target1" ).val()[0])
    }
    calBox($( ".target1" ).val()[0], $( ".target" ).val()[0], );
});





