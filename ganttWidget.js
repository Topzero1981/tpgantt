// ganttWidget.js
(function () {
  window.GanttWidget = window.GanttWidget || {};

  function loadScript(url, callback) {
    var script = document.createElement("script");
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
  }

  // Updated list of modules including widgetScrollToggler.js
  var modules = [
    "dependencyLoader.js",
    "widgetUtils.js",
    "widgetStylesUI.js",
    "widgetRenderer.js",
    "widgetExcel.js",
    "widgetScrollToggler.js"  // New module for toggling scrollbars
  ];

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
    GanttWidget.loadDependencies(function () {
      // Initialize the widget.
      GanttWidget.init();
      // Add the Scroll Toggle Button.
      GanttWidget.addScrollToggleButton();
    });
  });
})();
