// widgetScrollToggler.js
(function () {
  // Adds a button to toggle scrollbars on widget content areas.
  GanttWidget.addScrollToggleButton = function () {
    // Create container for the toggle button.
    var scrollToggleDiv = document.createElement("div");
    scrollToggleDiv.id = "widgetScrollToggle";
    scrollToggleDiv.style.position = "fixed";
    scrollToggleDiv.style.top = "50%";
    scrollToggleDiv.style.right = "10px";
    scrollToggleDiv.style.zIndex = "3000";
    
    // Create the toggle button.
    var button = document.createElement("button");
    button.id = "toggleScrollBarButton";
    button.textContent = "Hide Scroll Bars";
    button.style.backgroundColor = "#4caf50";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "8px 12px";
    button.style.borderRadius = "4px";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    
    scrollToggleDiv.appendChild(button);
    document.body.appendChild(scrollToggleDiv);
    
    // Track the current state of scrollbars (visible by default).
    var scrollBarsVisible = true;
    
    // Toggle the scrollbar visibility on click.
    button.addEventListener("click", function () {
      var widgetContents = document.querySelectorAll(".widget-content");
      if (scrollBarsVisible) {
        widgetContents.forEach(function (content) {
          content.style.overflowX = "hidden";
          content.style.overflowY = "hidden";
        });
        button.textContent = "Show Scroll Bars";
      } else {
        widgetContents.forEach(function (content) {
          content.style.overflowX = "auto";
          // If a height was set to enable vertical scrolling, reset it to auto.
          content.style.overflowY = "auto";
        });
        button.textContent = "Hide Scroll Bars";
      }
      scrollBarsVisible = !scrollBarsVisible;
    });
  };
})();
