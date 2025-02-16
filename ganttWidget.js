(function () {
    // Create a global namespace for our widget.
    window.GanttWidget = window.GanttWidget || {};
  
    // Helper to load a script dynamically.
    function loadScript(url, callback) {
      var script = document.createElement("script");
      script.src = url;
      script.onload = callback;
      document.head.appendChild(script);
    }
  
    // List of module files to load.
    var modules = [
      "dependencyLoader.js",
      "widgetUtils.js",
      "widgetStylesUI.js",
      "widgetRenderer.js",
      "widgetExcel.js"
    ];
  
    // Load the modules sequentially.
    function loadModules(index, finalCallback) {
      if (index < modules.length) {
        loadScript(modules[index], function () {
          loadModules(index + 1, finalCallback);
        });
      } else {
        finalCallback();
      }
    }
  
    loadModules(0, function () {
      // Once our modules are loaded, load D3 and XLSX via our dependency loader.
      GanttWidget.loadDependencies(function () {
        // Now initialize the widget.
        GanttWidget.init();
      });
    });
  })();
  
