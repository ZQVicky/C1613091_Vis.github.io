
d3.csv("Visits.csv",function (original_data){

    // console.log(original_data);

    var parseTime = d3.timeParse("%Y");

    var Visits_1 = original_data.columns.slice(1,3).map(function(id) {

      return {
        id: id,
        Values: original_data.map(function(d){
          return {
            year: parseTime(d.Year),
            value:parseFloat(d[id])
          };
        })
      };
    });
    console.log('Visits:', Visits_1);

    alldata = d3.nest()
            .key(function(d){return d["Year"]})
            .object(original_data);

    // console.log('Visits',alldata);

    graph_data_1 = [];
    for(var d in alldata){
      graph_data_1.push({'Year':d,'detail':alldata[d]});
    }

    console.log('graph_data',graph_data_1)

    LineChart(Visits_1)
    BarChart(graph_data_1)
    var v_button = document.getElementById("v_button");
        v_button.addEventListener("click", function() {
          d3.select("#main_chart").select("svg").remove();
          d3.select("#month_chart").select("svg").remove();
          d3.select("#dropdown").select("#change").remove();
          LineChart(Visits_1);
          BarChart(graph_data_1);
        })



});

d3.csv("Money.csv",function (original_data){

     // console.log(original_data);

     var parseTime = d3.timeParse("%Y");

     var Visits_1 = original_data.columns.slice(1,3).map(function(id) {

       return {
         id: id,
         Values: original_data.map(function(d){
           return {
             year: parseTime(d.Year),
             value:parseFloat(d[id])
           };
         })
       };
     });
     console.log('Money:', Visits_1);

     alldata = d3.nest()
             .key(function(d){return d["Year"]})
             .object(original_data);

     // console.log('Visits',alldata);
     graph_data = [];
     for(var d in alldata){
       graph_data.push({'Year':d,'detail':alldata[d]});
     }

     var m_button = document.getElementById("m_button");
         m_button.addEventListener("click", function() {
           d3.select("#main_chart").select("svg").remove();
           d3.select("#month_chart").select("svg").remove();
           d3.select("#dropdown").select("#change").remove();
           LineChart(Visits_1);
           BarChart(graph_data);
           d3.selectAll(".title").text("Spending on visits to and from the UK, 1996 to 2017");
           d3.selectAll(".billion").text("Billions");
         })

});

  let a = 1996; let b = 2017;
  var year = []
  for (let i = 0; i < b - a + 1; i++) {
   year.push(i + a)
  }
  // console.log(year)
  function unique(arr){
    return [...new Set(arr)];
  }

  var parseTime = d3.timeParse("%Y");
  // draw line chart.
function LineChart(Visits_1){

      var yyy = Visits_1.map(function(s){
        return s.Values.map(function(d){
          return d.value
        })
      })

      var yyy0 = unique(yyy[0])
      var yyy1 = unique(yyy[1])

      console.log("uk",unique(yyy[0]));
      console.log("os",unique(yyy[1]))

      var uu = []
      var oo = []
      var Visits = [{"id":"UK","Values":uu},{"id":"Overseas","Values":oo}];
      for (let e = 0; e < year.length; e++){
        uu.push({"year": parseTime(year[e]), "value":yyy0[e]});
        oo.push({"year": parseTime(year[e]), "value":yyy1[e]});
      }
      console.log(Visits)
      ///////draw the line graph/////////
        var width = 700;
        var height = 240;

        var main_chart = d3.select('#main_chart')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

        var margin = {
        top: 25,
        left: 60,
        right: 100,
        bottom: 30
      };

      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;
      ///////////  Year visits  ////////////////////

      var svg = main_chart.append('g')
          .attr('class','line_content')
          .attr('transform','translate(' + margin.left + ',' + margin.top + ')');
            //////////  Month visits ////////////////////
      svg.append("text")
          .attr("x", width / 2 )
          .attr("y", -25)
          .attr("class","title")
          .style("text-anchor", "middle")
          .style("font-weight","bold")
          .text("Visits to and from the UK, 1996 to 2017");

      var x_scale = d3.scaleTime()
            .range([0,width]);

      var y_scale = d3.scaleLinear()
            .range([height,0]);

      var z = d3.scaleOrdinal(d3.schemeCategory10);;

      var xAxis = d3.axisBottom(x_scale);

      var yAxis = d3.axisLeft(y_scale);

      var max_years = Visits.map(function(d){
          return d3.max(d.Values, function(e){
            return e.year;
          })
        })
        var min_years = Visits.map(function(d){
          return d3.min(d.Values, function(e){
            return e.year;
          })
        })

        var max_year = d3.max(max_years);
        var min_year = d3.min(min_years);

        x_scale.domain([min_year, max_year]);
        // console.log(x_scale.domain());
        //define y axis
        y_scale.domain([0,	d3.max(Visits, function(c) {
            return d3.max(c.Values, function(d) {
              return d.value;
            });
          })
        ]);
        //define z scale
        z.domain(Visits.map(function(c) {
          return c.id;
        }));

     /////////////////////////////
     //append x Axis
      svg.append("g")
         .attr("class", "axis axis-x")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis)
         .append("text")
         .attr("y", 25)
         .attr("x", width+30)
         .attr("fill", "#000")
         .attr("font","sans-serif")
         .text("Year");

       //append y axis
      svg.append("g")
         .attr("class", "axis axis-y")
         .call(yAxis)
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", -40)
         .attr("x", -50)
         .attr("dy", "0.38em")
         .attr("fill", "#000")
         .attr("font","sans-serif")
         .attr("class","billion")
         .text("millions");

         //setting line
     let line = d3.line()
        .x(function(d) {return x_scale(d.year);})
        .y(function(d) {return y_scale(d.value);})
        .curve(d3.curveCatmullRom);

      var path = svg.selectAll(".line")
          .data(Visits)
          .enter()
          .append("g");


      // append line path to svg
      path.append("path")
        .attr("class", "line")
        .attr("d", function(d){
          return line(d.Values);
        })
        .attr('id',function(d){
            return 'line-' + d.id;
        })
        .style("stroke", function(d) {return z(d.id);})
        .attr("opacity", 1);

    // append line labels to svg
        path.append("text")
          .datum(function(d) { return {id: d.id, value: d.Values[d.Values.length - 1]}; })
          .attr("transform", function(d) { return "translate(" + x_scale(d.value.year) + "," + y_scale(d.value.value) + ")"; })
          .attr("x", 20)
          .attr("dy", "0.38em")
          .style("font", "15px sans-serif")
          .style("fill", function(d) {return z(d.id);})
          .attr("opacity", 1)
          .text(function(d) { return d.id; })
          .attr("class", "label")
          .attr('id',function(d){
              return 'label-' + d.id;
          });

      // Draw the empty value for every point
      var points = svg.selectAll('.points')
              .data(Visits)
              .enter()
              .append('g')
              .attr('class', 'points')
              .append('text')
              .style("font", "15px sans-serif")
              .attr("opacity", 1)
              .attr('id',function(d){ return 'dot-' + d.id;});

      // Draw the circle
      path
        .selectAll("circle.line")
        .data(function(d){ return d.Values })
        .enter()
        .append("circle")
        .attr("r", 0)
        .style("stroke-width", 3)
        .attr("cx", function(d) { return x_scale(d.year); })
        .attr("cy", function(d) { return y_scale(d.value); });

       svg.select('.x.axis')
             .call(xAxis);

       svg.select('.y.axis')
             .call(yAxis);

      // d3.selectAll(".check").on("change",change);
      // change();

      //control the checkbox's opacity
    //////////////  mouseover line  //////////////////  reference: https://codepen.io/savemuse/pen/bgQQxp
    //creat the mouseover line data;
      var tip_data =[]
      for (let e = 0; e < year.length; e++){
        tip_data.push( {"year": parseTime(year[e]),"UK": yyy0[e],"Overseas":yyy1[e]})
      }
      MouseLine(tip_data)
      // console.log(tip_data)
  function MouseLine(tip_data){
    var focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus.append('line')
      .attr('class', 'x-hover-line hover-line')
      .attr('y1' , 0)
      .attr('y2', height);

    svg.append('rect')
      // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("mousemove", mousemove);

      var timeScales = tip_data.map(function(d) { return x_scale(d.year); });
      // console.log(timeScales)

      function mouseover() {
        focus.style("display", null);
        d3.selectAll('.points text').style("display", null);
      }
      function mouseout() {
        focus.style("display", "none");
        d3.selectAll('.points text').style("display", "none");
      }
      function mousemove() {
        var i = d3.bisect(timeScales, d3.mouse(this)[0], 1);
        // console.log(i)
        var di = tip_data[i-1];
        // console.log(di)
        focus.attr("transform", "translate(" + x_scale(di.year) + ",0)");
        d3.selectAll('.points text')
          .attr('x', function(d) { return x_scale(di.year) + 15; })
          .attr('y', function(d) { return y_scale(d.Values[i-1].value+5); })
          .text(function(d) { return d.Values[i-1].value; })
          .style('fill', function(d) { return z(d.id); });
      }
  }


}
// Load and munge data, then make the visualization.
function BarChart(graph_data){

  var MonthGroup = ["Jan", "Feb", "Mar", "Apr", "May",
                         "Jun", "Jul", "Aug", "Sep","Oct","Nov","Dec"];

        var uk_number = graph_data.map(function(t, i){
                   return t.detail.map(function(d,i){
                     return parseFloat(d.UK_Visits_M);
                   })})
        // console.log(uk_number)

        var os_number = graph_data.map(function(t, i){
                   return t.detail.map(function(d,i){
                     return parseFloat(d.OS_Visits_M);
                   })})
        // console.log(os_number)

        var YearMap_uk= {};
        var YearMap_os = {};
        for (let e = 0; e < year.length; e++){
          YearMap_uk[year[e]]=uk_number[e];
          YearMap_os[year[e]]=os_number[e];
        }

        console.log(YearMap_uk)
        // console.log(YearMap_os)

      // Define dimensions of vis
      var width = 680;
      var height = 275;

      var margin = {
      top: 40,
      left: 40,
      right: 60,
      bottom: 65
      };

      width  = width - margin.left - margin.right,
      height = height - margin.top  - margin.bottom;

      // Make x scale
      var xScale = d3.scaleBand()
          .domain(MonthGroup)
          .rangeRound([0, width])
          .padding(0.1);

      // Make y scale, the domain will be defined on bar upPeriod
      var yScale = d3.scaleLinear()
          .range([height, 0]);

      // Create svg
      var svg = d3.select("#month_chart")
        .append("svg")
          .attr("class","barbar")
          .attr("width",  width  + margin.left + margin.right)
          .attr("height", height + margin.top  + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("text")
          .attr("x", width / 2 )
          .attr("y", -40)
          .attr("class","title")
          .style("text-anchor", "middle")
          .style("font-weight","bold")
          .text("Visits to and from the UK, 1996 to 2017");

      // Make x-axis and add to svg
      var xAxis = d3.axisBottom(xScale);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("y", 30)
          .attr("x", width+ 30)
          .attr("fill", "#000")
          .attr("font","7px sans-serif")
          .text("Month");
      // Make y-axis and add to svg

      var yAxis = d3.axisLeft(yScale)
                    .ticks(5);  // 链接：https://www.jianshu.com/p/88f305000465

      var yAxisHandleForUpPeriod = svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);


      yAxisHandleForUpPeriod.append("text")
            .attr("transform", "rotate(-90)")
            .attr("class","billion")
            .attr("y", 6)
            .attr("dy", -30)
            .attr("fill", "#000")
            .attr("font","7px sans-serif")
            .style("text-anchor", "end")
            .text("Visits in Millions");


      var updateBars = function(data) {

          // First upPeriod the y-axis domain to match data
          yScale.domain([0,6.5]);
          // yScale.domain([2,d3.max(data)]);
          yAxisHandleForUpPeriod.call(yAxis);

          var bars = svg.selectAll(".bar").data(data);

          var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

          // Add bars for new data
          bars.enter()
            .append("rect")
              .attr("class", "bar")
              .attr("x", function(d,i) { return xScale( MonthGroup[i]); })
              .attr("width", 20)
              .attr("y", function(d,i) { return yScale(d); })
              .attr("height", function(d,i) { return height - yScale(d); })
              .style("fill","rgb(142, 185, 30)")
              .on("mouseover", function(d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 1);
                    tooltip.html("UK:   " + d +"m")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                    })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

          // UpPeriod old ones, already have x / width from before
          bars
              .transition().duration(250)
              .attr("y", function(d,i) { return yScale(d); })
              .attr("height", function(d,i) { return height - yScale(d); });

          // Remove old ones
          bars.exit().remove();

          var legend = svg.selectAll(".legend_u")
              .data(data)
              .enter().append("g")
              .attr("class", "legend_u")
              .attr("transform","translate(0, -25)");

          legend.append("rect")
              .attr("x", width -50)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", "rgb(142, 185, 30)");

          legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "start")
              .style("font","15px")
              .text("UK");


      };

      var updateBars_os = function(data) {

          // First upPeriod the y-axis domain to match data
          yScale.domain([0,6.5]);
          // yScale.domain([2,d3.max(data)]);
          yAxisHandleForUpPeriod.call(yAxis);

          var bar = svg.append("svg")
                        .selectAll(".bar")
                        .data(data);

          var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


          // Add bars for new data
          bar.enter()
            .append("rect")
              .attr("class", "bar")
              .attr("transform", "translate(20,0)")
              .attr("x", function(d,i) { return xScale( MonthGroup[i]); })
              .attr("width", 20)
              .attr("y", function(d,i) { return yScale(d); })
              .attr("height", function(d,i) { return height - yScale(d); })
              .style("fill","rgb(103, 115, 74)")
              // .attr("data-legend","Overseas")
              .on("mouseover", function(d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 1);
                    tooltip.html("Overseas:   " + d +"m")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                    })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

          // UpPeriod old ones, already have x / width from before
          bar
              .transition().duration(250)
              .attr("y", function(d,i) { return yScale(d); })
              .attr("height", function(d,i) { return height - yScale(d); });

          // Remove old ones
          bar.exit().remove();
          console.log(data[0])

          var legend = svg.selectAll(".legend")
              .data(data)
              .enter().append("g")
              .attr("class", "legend")
              .attr("transform","translate(0, -5)");

          legend.append("rect")
              .attr("x", width -50)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", "rgb(103, 115, 74)");

          legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "start")
              .style("font","15px")
              .text("Overseas");
      };

      // Handler for dropdown value change
      var dropdownChange = function() {
          var newyear = d3.select(this).property('value'),
              newData_uk = YearMap_uk[newyear],
              newData_os = YearMap_os[newyear];

              // console.log(newData_os)
              // console.log(newData_uk)
          updateBars(newData_uk);
          updateBars_os(newData_os);

      };

      // Get years, for dropdown
      var years = Object.keys(YearMap_uk).sort();

      var dropdown = d3.select("#dropdown")
          .insert("select", "svg")
          .attr("id","change")
          .on("change", dropdownChange);

      dropdown.selectAll("option")
          .data(years)
        .enter().append("option")
          .attr("value", function (d) { return d; })
          .text(function (d) {
              return d[0].toUpperCase() + d.slice(1,d.length); // capitalize 1st letter
          });

      var initialData_uk = YearMap_uk[ years[0] ];
      var initialData_os = YearMap_os[ years[0] ];

      updateBars(initialData_uk);
      updateBars_os(initialData_os);
};

d3.csv("Visits by purpose.csv", function(data){
  console.log(data);

  alldata = d3.nest()
          .key(function(d){return d["Id"]})
          .object(data);

  console.log(alldata);

  var uk = alldata.UK;
  var overseas = alldata.Overseas;
  for(var t=0;t<uk.length;t++){
        delete uk[t].Id;
        delete overseas[t].Id;

  }

  console.log('uk',uk)

  uk_purpose_line(uk)
  os_purpose_line(overseas)

})

function uk_purpose_line(data) {

      var width = 680;
      var height = 290;

      var purpose_chart = d3.select('#UK_purpose')
                .append('svg')
                .attr("id","p_l")
                .attr('width', width)
                .attr('height', height);

      var margin = {
      top: 50,
      left: 60,
      right: 100,
      bottom: 30
    };

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;
    ///////////  Year visits  ////////////////////

    var svg = purpose_chart.append('g')
        .attr('class','line_content')
        .attr('transform','translate(' + margin.left + ',' + margin.top + ')');

    svg.append("text")
        .attr("x", width / 2 )
        .attr("y", -25)
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .text("UK residents' visits abroad by purpose, 1996 to 2016");

    var x_scale = d3.scaleTime()
          .range([0,width]);

    var y_scale = d3.scaleLinear()
          .range([height,0]);

    var z = d3.scaleOrdinal(d3.schemeCategory10);;

    var xAxis = d3.axisBottom(x_scale);

    var yAxis = d3.axisLeft(y_scale);

    var parseTime = d3.timeParse("%Y");

    var line = d3.line()
        .x(function(d) { return x_scale(d.Period); })
        .y(function(d) { return y_scale(d.value); });

    console.log(data)
    z.domain(d3.keys(data[0]).filter(function(key) { return key !== "Period"; }));

    data.forEach(function(d) {
      d.Period = parseTime(d.Period);
    });
    console.log(data)

    var purpose_data = z.domain().map(function(id) {
      return {
        id: id,
        values: data.map(function(d) {
          return {Period: d.Period, value: +d[id]};
        })
      };
    });

    console.log(purpose_data)

    x_scale.domain(d3.extent(data, function(d) { return d.Period; }));

    y_scale.domain([
      d3.min(purpose_data, function(c) { return d3.min(c.values, function(v) { return parseFloat(v.value); }); }),
      d3.max(purpose_data, function(c) { return d3.max(c.values, function(v) { return parseFloat(v.value); }); })
    ]);

    svg.append("g")
       .attr("class", "axis axis-x")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis)
       .append("text")
       .attr("y", 25)
       .attr("x", width+30)
       .attr("fill", "#000")
       .attr("font","sans-serif")
       .text("Year");

     //append y axis
    svg.append("g")
       .attr("class", "axis axis-y")
       .call(yAxis)
       .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", -40)
       .attr("x", -50)
       .attr("dy", "0.38em")
       .attr("fill", "#000")
       .attr("font","sans-serif")
       .text("Visits in million");

    var path = svg.selectAll(".line")
        .data(purpose_data)
        .enter().append("g");
        // .attr("class", "path");

    path.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return z(d.id); });

    path.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x_scale(d.value.Period) + "," + y_scale(parseFloat(d.value.value)) + ")"; })
        .attr("x", 20)
        .attr("dy", ".35em")
        .style("font", "15px sans-serif")
        .style("fill", function(d) {return z(d.id);})
        .text(function(d) { return d.id; });

    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.selectAll(".dot")
          .data(purpose_data)
          .enter().append("g")
          .attr("class", "dot")
          .attr('id',function(d){
            if(d.id == "Saudi Arabia"){
              return'dot-Saudi_Arabia';
            }else{
              return 'dot-' + d.id;
            }
          })
          .style("fill", function(d) {return z(d.id);})
          .attr("opacity", 1)
          .selectAll("circle")
          .data(function(d) { return d.values; })
          .enter().append("circle")
          .attr("r", 3)
          .attr("cx", function(d,i) { return x_scale(d.Period); })
          .attr("cy", function(d,i) { return y_scale(d.value); })
          .on("mouseover", function(d) {
              tooltip.transition()
                  .duration(200)
                  .style("opacity", 1);
              tooltip.html(d.value + " Millions")
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
              })
          .on("mouseout", function(d) {
              tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
          });

  };

function os_purpose_line(data) {

        var width = 680;
        var height = 300;

        var purpose_chart = d3.select('#Overseas_purpose')
                  .append('svg')
                  .attr("id","p_l")
                  .attr('width', width)
                  .attr('height', height);

        var margin = {
        top: 50,
        left: 60,
        right: 100,
        bottom: 30
      };

      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;
      ///////////  Year visits  ////////////////////

      var svg = purpose_chart.append('g')
          .attr('class','line_content')
          .attr('transform','translate(' + margin.left + ',' + margin.top + ')');

      svg.append("text")
          .attr("x", width / 2 )
          .attr("y", -25)
          .style("text-anchor", "middle")
          .style("font-weight","bold")
          .text("Overseas residents visits by purpose, 1996 to 2016");

      var x_scale = d3.scaleTime()
            .range([0,width]);

      var y_scale = d3.scaleLinear()
            .range([height,0]);

      var z = d3.scaleOrdinal(d3.schemeCategory10);;

      var xAxis = d3.axisBottom(x_scale);

      var yAxis = d3.axisLeft(y_scale);

      var parseTime = d3.timeParse("%Y");

      var line = d3.line()
          .x(function(d) { return x_scale(d.Period); })
          .y(function(d) { return y_scale(d.value); });

      console.log(data)
      z.domain(d3.keys(data[0]).filter(function(key) { return key !== "Period"; }));

      data.forEach(function(d) {
        d.Period = parseTime(d.Period);
      });
      console.log(data)

      var purpose_data = z.domain().map(function(id) {
        return {
          id: id,
          values: data.map(function(d) {
            return {Period: d.Period, value: +d[id]};
          })
        };
      });

      console.log(purpose_data)

      x_scale.domain(d3.extent(data, function(d) { return d.Period; }));

      y_scale.domain([
        d3.min(purpose_data, function(c) { return d3.min(c.values, function(v) { return parseFloat(v.value); }); }),
        d3.max(purpose_data, function(c) { return d3.max(c.values, function(v) { return parseFloat(v.value); }); })
      ]);

      svg.append("g")
         .attr("class", "axis axis-x")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis)
         .append("text")
         .attr("y", 25)
         .attr("x", width+30)
         .attr("fill", "#000")
         .attr("font","sans-serif")
         .text("Year");

       //append y axis
      svg.append("g")
         .attr("class", "axis axis-y")
         .call(yAxis)
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", -40)
         .attr("x", -50)
         .attr("dy", "0.38em")
         .attr("fill", "#000")
         .attr("font","sans-serif")
         .text("Visits in million");

      var path = svg.selectAll(".line")
          .data(purpose_data)
          .enter().append("g");
          // .attr("class", "path");

      path.append("path")
          .attr("class", "line")
          .attr("d", function(d) { return line(d.values); })
          .style("stroke", function(d) { return z(d.id); });

      path.append("text")
          .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
          .attr("transform", function(d) { return "translate(" + x_scale(d.value.Period) + "," + y_scale(parseFloat(d.value.value)) + ")"; })
          .attr("x", 20)
          .attr("dy", ".35em")
          .style("font", "15px sans-serif")
          .style("fill", function(d) {return z(d.id);})
          .text(function(d) { return d.id; });

      var tooltip = d3.select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

      svg.selectAll(".dot")
            .data(purpose_data)
            .enter().append("g")
            .attr("class", "dot")
            .attr('id',function(d){
              if(d.id == "Saudi Arabia"){
                return'dot-Saudi_Arabia';
              }else{
                return 'dot-' + d.id;
              }
            })
            .style("fill", function(d) {return z(d.id);})
            .attr("opacity", 1)
            .selectAll("circle")
            .data(function(d) { return d.values; })
            .enter().append("circle")
            .attr("r", 3)
            .attr("cx", function(d,i) { return x_scale(d.Period); })
            .attr("cy", function(d,i) { return y_scale(d.value); })
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                tooltip.html(d.value + " Millions")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    };

d3.csv("Top 10 countries.csv",function(data){
    // console.log(data)
    alldata = d3.nest()
            .key(function(d){return d["Id"]})
            .object(data);

    // console.log(alldata);

    var os = alldata.Overseas
    var uk = alldata.UK
    var os_country = [];
    var uk_country = [];
    for (var i =0; i<os.length;i++){
      os_country.push({"Country": os[i].Country,"Visits":os[i].Visits});
      uk_country.push({"Country": uk[i].Country,"Visits":uk[i].Visits})
    }
    console.log("overseas",os_country)
    // console.log("uk",uk_country)

    uk_bar_country(uk_country)
    os_bar_country(os_country)

  })

function uk_bar_country(data){

    var div = d3.select("#sub2").append("div").attr("class", "toolTip");

    ///////draw the bars graph///////// reference: http://bl.ocks.org/juan-cb/faf62e91e3c70a99a306
    var axisMargin = 0,
            margin = 40,
            valueMargin = 4,
            width = 700,
            height = 300,
            barHeight = (height-axisMargin-margin*4)/data.length,
            barPadding = (height-axisMargin-margin*2)*0.5/data.length,
            svg, scale, xAxis, labelWidth = 0;

    var country = d3.select('#UK_country')
              .append("svg")
              .attr("id","c_b")
              .attr("width", width)
              .attr("height", height)
              .append("g")
                .attr("transform", "translate(0," + 0 + ")");

    country.append("text")
        .attr("x", width / 2 )
        .attr("y", -5)
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .text("Top 10 countries visited by UK residents, 2016");

    var max = d3.max(data,function(d) { return parseFloat(d.Visits); });
    console.log(max)
    var scale = d3.scaleLinear()
            .domain([0, max])
            .range([0, width-margin*6]);

    var xAxis = d3.axisBottom(scale)
                  .tickSize(-height/1.2);

    var bar = country.selectAll("g")
            .data(data)
            .enter()
            .append("g");

    bar.attr("class", "c_bar")
            .attr("cx",0)
            .attr("transform", function(d, i) {
                return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
            });

    bar.append("text")
            .attr("class", "label")
            .attr("y", barHeight/3)
            .attr("dy", ".35em") //vertical align middle
            .text(function(d){
                return d.Country;
            }).each(function() {
        labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
    });

    bar.append("rect")
            .attr("transform", "translate("+labelWidth+","+ 0+")")
            .attr("height", barHeight/1.2)
            .attr("width", function(d){
                return scale(d.Visits);
            });

    bar.append("text")
            .attr("class", "barvalue")
            .attr("y", barHeight/2)
            .attr("dx", -valueMargin + labelWidth) //margin right
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "end")
            .text(function(d){
                return (d.Visits);
            })
            .attr("x", function(d){
                var width = this.getBBox().width;
                return Math.max(width + valueMargin, scale(d.Visits));
            });

    bar
            .on("mousemove", function(d){
                div.style("left", d3.event.pageX+10+"px");
                div.style("top", d3.event.pageY+25+"px");
                div.style("display", "inline-block");
                div.html((d.Country)+":  "+(d.Visits));
            });
    bar
            .on("mouseout", function(d){
                div.style("display", "none");
            });

    country.insert("g",":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (margin + labelWidth) + ","+ 260+")")
            .call(xAxis);
  }

function os_bar_country(data){

    var div = d3.select("#sub2").append("div").attr("class", "toolTip");

    ///////draw the bars graph/////////
    var axisMargin = 0,
            margin = 40,
            valueMargin = 4,
            width = 700,
            height = 300,
            barHeight = (height-axisMargin-margin*4)/data.length,
            barPadding = (height-axisMargin-margin*2)*0.5/data.length,
             svg, scale, xAxis, labelWidth = 0;

    var country = d3.select('#Overseas_country')
              .append("svg")
              .attr("id","c_b")
              .attr("width", width)
              .attr("height", height)
              .append("g")
                .attr("transform", "translate(0," + 0 + ")");

    country.append("text")
        .attr("x", width / 2 )
        .attr("y", -5)
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .text("Top 10 visiting countries: number of visits, 2016");

    var max = d3.max(data,function(d) { return parseFloat(d.Visits); });
    console.log(max)
    var scale = d3.scaleLinear()
            .domain([0, max])
            .range([0, width-margin*6]);

    var xAxis = d3.axisBottom(scale)
                  .tickSize(-height/1.2);

    var bar = country.selectAll("g")
            .data(data)
            .enter()
            .append("g");

    bar.attr("class", "c_bar")
            .attr("cx",0)
            .attr("transform", function(d, i) {
                return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
            });

    bar.append("text")
            .attr("class", "label")
            .attr("y", barHeight/3)
            .attr("dy", ".35em") //vertical align middle
            .text(function(d){
                return d.Country;
            }).each(function() {
        labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
    });

    bar.append("rect")
            .attr("transform", "translate("+labelWidth+","+ 0+")")
            .attr("height", barHeight/1.2)
            .attr("width", function(d){
                return scale(d.Visits);
            });

    bar.append("text")
            .attr("class", "barvalue")
            .attr("y", barHeight/2)
            .attr("dx", -valueMargin + labelWidth) //margin right
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "end")
            .text(function(d){
                return (d.Visits);
            })
            .attr("x", function(d){
                var width = this.getBBox().width;
                return Math.max(width + valueMargin, scale(d.Visits));
            });

    bar
            .on("mousemove", function(d){
                div.style("left", d3.event.pageX+10+"px");
                div.style("top", d3.event.pageY+25+"px");
                div.style("display", "inline-block");
                div.html((d.Country)+":  "+(d.Visits));
            });
    bar
            .on("mouseout", function(d){
                div.style("display", "none");
            });

    country.insert("g",":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (margin + labelWidth) + ","+ 260+")")
            .call(xAxis);
  }
  // function change(){
  //
  //     d3.selectAll(".check").each(function(d){
  //       cb = d3.select(this);
  //       var lineSelected = this.value;
  //       console.log(lineSelected)
  //       var svgline = d3.select('#line-' + lineSelected)
  //       //label's click
  //       var labelSelected = this.value;
  //
  //       var labelline = d3.select('#label-' + labelSelected);
  //       var DotSelected = this.value;
  //       var Dotline = d3.select('#dot-' + DotSelected);
  //
  //       if(cb.property("checked")){
  //
  //          if(svgline.attr('opacity') === '0') {
  //            // console.log('making it visible');
  //            svgline.attr('opacity', 1);
  //          } ;
  //
  //          if(labelline.attr('opacity') === '0') {
  //            // console.log('making it visible');
  //            labelline.attr('opacity', 1);
  //          }
  //
  //           if(Dotline.attr('opacity') === '0') {
  //             // console.log('making it visible');
  //               Dotline.attr('opacity', 1);
  //           }
  //        }else {
  //            svgline.attr('opacity', 0);
  //            labelline.attr('opacity', 0);
  //            Dotline.attr('opacity', 0);
  //        };
  //      })
  //
  //   }
