(function () {
    GanttWidget.init = function () {
      // Global state variables.
      var currentWidgetSize = "normal"; // "normal" or "large"
      var currentFontSize = "normal";     // "normal" or "large"
      var currentTasksData = null;
      var widgetOffset = 0; // For vertical stacking in large mode
      var widgetCounter = 0; // For grid layout in normal mode
  
      // Add styles and shared UI elements.
      GanttWidget.addStylesAndUI();
  
      // Excel uploader event listeners.
      document.getElementById("uploadExcelButton").addEventListener("click", function () {
        document.getElementById("excelFileInput").click();
      });
      document.getElementById("excelFileInput").addEventListener("change", GanttWidget.handleExcelUpload);
  
      // Widget size toggle.
      document.getElementById("toggleSizeButton").addEventListener("click", function () {
        if (currentWidgetSize === "normal") {
          currentWidgetSize = "large";
          this.textContent = "Switch to Normal Widgets";
        } else {
          currentWidgetSize = "normal";
          this.textContent = "Switch to Large Widgets";
        }
        widgetCounter = 0; // reset counter
        if (currentTasksData) {
          renderWidgets(currentTasksData);
        }
      });
  
      // Font size toggle.
      document.getElementById("toggleFontButton").addEventListener("click", function () {
        if (currentFontSize === "normal") {
          currentFontSize = "large";
          this.textContent = "Switch to Normal Font";
        } else {
          currentFontSize = "normal";
          this.textContent = "Switch to Large Font";
        }
        if (currentTasksData) {
          renderWidgets(currentTasksData);
        }
      });
  
      // Renders all widgets.
      function renderWidgets(tasks) {
        d3.selectAll('.widget').remove();
        widgetOffset = 0;
        widgetCounter = 0;
        var projects = Array.from(new Set(tasks.map(d => d.project)));
        projects.forEach(function (project) {
          var tasksForProject = tasks.filter(d => d.project === project)
            .filter(d => d.start && d.end && !isNaN(d.start) && !isNaN(d.end));
          if (tasksForProject.length > 0) {
            createGanttChart("body", project, tasksForProject);
          }
        });
      }
  
      // Creates a single Gantt chart widget for a project.
      function createGanttChart(containerSelector, project, tasks) {
        var container = d3.select(containerSelector)
          .append("div")
          .attr("class", "widget")
          .call(GanttWidget.makeDraggable);
  
        var baseLeftMargin = currentWidgetSize === "normal" ? 80 : 100;
        var textFontSize = currentFontSize === "normal" ? 10 : 14;
  
        // Use a canvas to compute the maximum label width.
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        ctx.font = textFontSize + "px Arial";
        var maxLabelWidth = 0;
        tasks.forEach(function (task) {
          var labelWidth = ctx.measureText(task.name).width;
          if (labelWidth > maxLabelWidth) {
            maxLabelWidth = labelWidth;
          }
        });
        var dynamicLeftMargin = Math.max(baseLeftMargin, maxLabelWidth + 20);
        var margin = { top: 20, right: 10, bottom: 50, left: dynamicLeftMargin };
  
        var minBarHeight = currentFontSize === "normal"
          ? (currentWidgetSize === "normal" ? 30 : 35)
          : (currentWidgetSize === "normal" ? 45 : 50);
  
        var defaultChartHeight = (currentWidgetSize === "normal" ? 200 : 400) - margin.top - margin.bottom;
        var naturalChartHeight = Math.max(defaultChartHeight, tasks.length * minBarHeight);
        var naturalContainerHeight = naturalChartHeight + margin.top + margin.bottom;
        var maxContainerHeight = currentWidgetSize === "normal" ? 400 : 1200;
        var actualContainerHeight = Math.min(naturalContainerHeight, maxContainerHeight);
        var headerHeight = 40;
        var baseWidgetWidth = currentWidgetSize === "normal" ? 360 : 800;
        var overallWidgetWidth = baseWidgetWidth + (dynamicLeftMargin - baseLeftMargin) + 20;
        overallWidgetWidth = Math.min(window.innerWidth - 40, overallWidgetWidth);
        container.style("width", overallWidgetWidth + "px");
  
        var width = overallWidgetWidth - margin.left - margin.right;
        var effectiveWidth = width * 0.95;
  
        if (currentWidgetSize === "normal") {
          var col = widgetCounter % 2;
          var row = Math.floor(widgetCounter / 2);
          var leftPos = 20 + col * (overallWidgetWidth + 30);
          var topPos = 20 + row * (actualContainerHeight + 30);
          container.style("left", leftPos + "px")
            .style("top", topPos + "px");
          widgetCounter++;
        } else {
          container.style("left", "20px")
            .style("top", (20 + widgetOffset) + "px");
          widgetOffset += actualContainerHeight + 30;
        }
  
        // Append header.
        container.append("div")
          .attr("class", "widget-header")
          .text("Project: " + project);
  
        // Append content area.
        var content = container.append("div")
          .attr("class", "widget-content");
        if (naturalContainerHeight > maxContainerHeight) {
          content.style("height", (actualContainerHeight - headerHeight) + "px")
            .style("overflow-y", "auto");
        }
        content.style("overflow-x", "auto");
  
        // Append SVG chart.
        var svg = content.append("svg")
          .attr("class", "chart")
          .attr("width", overallWidgetWidth)
          .attr("height", naturalContainerHeight)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
        var minDate = d3.min(tasks, d => d.start);
        var maxDate = d3.max(tasks, d => d.end);
        var xScale = d3.scaleTime()
          .domain([d3.timeDay.offset(minDate, -1), d3.timeDay.offset(maxDate, 1)])
          .range([0, effectiveWidth]);
  
        var diffDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);
        var tickInterval, tickFormat;
        if (currentFontSize === "large") {
          if (diffDays < 30) {
            tickInterval = d3.timeDay.every(2);
          } else if (diffDays < 180) {
            tickInterval = d3.timeWeek.every(2);
          } else {
            tickInterval = d3.timeMonth.every(2);
          }
        } else {
          if (diffDays < 30) {
            tickInterval = d3.timeDay.every(1);
          } else if (diffDays < 180) {
            tickInterval = d3.timeWeek.every(1);
          } else {
            tickInterval = d3.timeMonth.every(1);
          }
        }
        tickFormat = currentFontSize === "large" ? d3.timeFormat("%b %d") : d3.timeFormat("%b %d");
  
        var yScale = d3.scaleBand()
          .domain(tasks.map(d => d.name))
          .range([0, naturalChartHeight])
          .padding(0.2);
  
        svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", "translate(0," + naturalChartHeight + ")")
          .call(d3.axisBottom(xScale)
            .ticks(tickInterval)
            .tickFormat(tickFormat))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end")
          .attr("dx", "-0.5em")
          .attr("dy", "0.15em");
  
        var yAxis = d3.axisLeft(yScale);
        var yAxisG = svg.append("g")
          .attr("class", "y-axis")
          .call(yAxis);
        yAxisG.selectAll("text").call(GanttWidget.wrap, margin.left - 10);
  
        svg.selectAll(".x-axis text").style("font-size", textFontSize + "px");
        yAxisG.selectAll("text").style("font-size", textFontSize + "px");
  
        var tooltipSelection = d3.select("#tooltip");
  
        svg.selectAll(".bar")
          .data(tasks)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", d => xScale(d.start))
          .attr("y", d => yScale(d.name))
          .attr("width", d => xScale(d.end) - xScale(d.start))
          .attr("height", yScale.bandwidth())
          .attr("fill", d => d.color)
          .on("mouseover touchstart", function (event, d) {
            tooltipSelection
              .style("opacity", 1)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY + 10) + "px")
              .html("<strong>" + d.name + "</strong><br><em>" + d.description + "</em><br><strong>Assigned:</strong> " + d.persons);
          })
          .on("mousemove touchmove", function (event) {
            tooltipSelection
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY + 10) + "px");
          })
          .on("mouseout touchend", function () {
            tooltipSelection.style("opacity", 0);
          });
  
        svg.selectAll(".bar-text")
          .data(tasks)
          .enter()
          .append("text")
          .attr("class", "bar-text")
          .attr("x", d => xScale(d.start) + (xScale(d.end) - xScale(d.start)) / 2)
          .attr("y", d => yScale(d.name) + yScale.bandwidth() / 2)
          .text(d => d.name)
          .style("font-size", textFontSize + "px")
          .each(function (d) {
            var textWidth = this.getComputedTextLength();
            var barWidth = xScale(d.end) - xScale(d.start);
            if (textWidth > barWidth) {
              d3.select(this).remove();
            }
          });
      }
  
      // Expose renderWidgets so that the Excel module can re‑render when new data arrives.
      GanttWidget.renderWidgets = function (tasks) {
        currentTasksData = tasks;
        renderWidgets(tasks);
      };
  
      // Fallback: if no Excel data is loaded, generate random tasks.
      var allTasks = GanttWidget.generateRandomTasks(15);
      currentTasksData = allTasks;
      renderWidgets(allTasks);
    };
  })();
  
