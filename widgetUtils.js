(function () {
    // Text wrapping function for SVG text elements.
    GanttWidget.wrap = function (text, width) {
      text.each(function () {
        var textEl = d3.select(this),
          words = textEl.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.4,
          y = textEl.attr("y"),
          dy = parseFloat(textEl.attr("dy")) || 0,
          tspan = textEl.text(null)
            .append("tspan")
            .attr("x", -10)
            .attr("y", y)
            .attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = textEl.append("tspan")
              .attr("x", -10)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      });
    };
  
    // Simple color mapping (caches colors per name).
    GanttWidget.getColorFor = (function () {
      var colorMapping = {};
      return function (name) {
        if (!colorMapping[name]) {
          var keys = Object.keys(colorMapping);
          colorMapping[name] = d3.schemeCategory10[keys.length % 10];
        }
        return colorMapping[name];
      };
    })();
  
    // Fallback function to generate random tasks.
    GanttWidget.generateRandomTasks = function (numTasks) {
      var names = ["Alice", "Bob", "Charlie", "David", "Eve"];
      var projects = ["Project A", "Project B", "Project C"];
      var colors = d3.schemeCategory10;
      var tasks = [];
      for (var i = 0; i < numTasks; i++) {
        var personIndex = Math.floor(Math.random() * names.length);
        var projectIndex = Math.floor(Math.random() * projects.length);
        var baseDate = new Date();
        var randomOffset = Math.floor(Math.random() * 11) - 5;
        var start = new Date(baseDate.getTime() + randomOffset * 24 * 60 * 60 * 1000);
        var duration = Math.floor(Math.random() * 5) + 1;
        var end = new Date(start.getTime());
        end.setDate(start.getDate() + duration);
        tasks.push({
          name: "Task " + (i + 1),
          description: "This is the description for Task " + (i + 1),
          persons: names[personIndex],
          project: projects[projectIndex],
          color: colors[personIndex],
          start: start,
          end: end
        });
      }
      return tasks;
    };
  })();
  
