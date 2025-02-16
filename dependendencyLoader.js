(function () {
    // Attach a function to our namespace.
    GanttWidget.loadDependencies = function (callback) {
      function loadD3(cb) {
        if (typeof d3 === "undefined") {
          var script = document.createElement("script");
          script.src = "https://d3js.org/d3.v7.min.js";
          script.onload = cb;
          document.head.appendChild(script);
        } else {
          cb();
        }
      }
      function loadXLSX(cb) {
        if (typeof XLSX === "undefined") {
          var script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
          script.onload = cb;
          document.head.appendChild(script);
        } else {
          cb();
        }
      }
      loadD3(function () {
        loadXLSX(callback);
      });
    };
  })();
  
