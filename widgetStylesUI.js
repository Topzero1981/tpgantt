(function () {
    GanttWidget.addStylesAndUI = function () {
      // Append CSS styles.
      var style = document.createElement("style");
      style.innerHTML = `
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          overflow-y: auto;
          background-color: #f5f5f5;
        }
        .widget {
          position: absolute;
          background-color: white;
          box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
          border-radius: 8px;
          overflow: hidden;
          z-index: 1000;
        }
        .widget-header {
          background-color: #4caf50;
          color: white;
          padding: 10px;
          text-align: center;
          font-weight: bold;
          cursor: grab;
          touch-action: none;
        }
        .widget-content {
          padding: 10px;
          overflow-x: auto;
        }
        .chart {
          background-color: #f9f9f9;
        }
        .bar {
          cursor: pointer;
          fill-opacity: 0.9;
        }
        .bar:hover {
          fill-opacity: 1;
        }
        .bar-text {
          text-anchor: middle;
          dominant-baseline: central;
        }
        .tooltip {
          position: absolute;
          background-color: rgba(0,0,0,0.8);
          color: white;
          padding: 8px;
          font-size: 12px;
          border-radius: 4px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 2000;
        }
        .axis text {
          font-size: 10px;
        }
        /* Excel uploader */
        #excelUploader {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 3000;
        }
        #excelUploader button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        #excelUploader button:hover {
          background-color: #45a049;
        }
        #excelFileInput {
          display: none;
        }
        /* Widget size toggle */
        #widgetSizeToggle {
          position: absolute;
          top: 60px;
          right: 10px;
          z-index: 3000;
        }
        #widgetSizeToggle button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        #widgetSizeToggle button:hover {
          background-color: #45a049;
        }
        /* Font size toggle */
        #fontSizeToggle {
          position: absolute;
          top: 100px;
          right: 10px;
          z-index: 3000;
        }
        #fontSizeToggle button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        #fontSizeToggle button:hover {
          background-color: #45a049;
        }
        /* Mapping UI */
        #mappingUI {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          border: 1px solid #ccc;
          padding: 20px;
          z-index: 4000;
          box-shadow: 0px 4px 6px rgba(0,0,0,0.2);
        }
        #mappingUI div {
          margin-bottom: 10px;
        }
        #mappingUI label {
          margin-right: 5px;
        }
      `;
      document.head.appendChild(style);
  
      // Create tooltip element if it doesn’t exist.
      if (!document.getElementById("tooltip")) {
        var tooltip = document.createElement("div");
        tooltip.id = "tooltip";
        tooltip.className = "tooltip";
        document.body.appendChild(tooltip);
      }
  
      // Create Excel uploader controls.
      var uploaderDiv = document.createElement("div");
      uploaderDiv.id = "excelUploader";
      uploaderDiv.innerHTML = `<button id="uploadExcelButton">Upload Excel</button>
                               <input type="file" id="excelFileInput" accept=".xlsx, .xls">`;
      document.body.appendChild(uploaderDiv);
  
      // Create widget size toggle button.
      var sizeToggleDiv = document.createElement("div");
      sizeToggleDiv.id = "widgetSizeToggle";
      sizeToggleDiv.innerHTML = `<button id="toggleSizeButton">Switch to Large Widgets</button>`;
      document.body.appendChild(sizeToggleDiv);
  
      // Create font size toggle button.
      var fontSizeToggleDiv = document.createElement("div");
      fontSizeToggleDiv.id = "fontSizeToggle";
      fontSizeToggleDiv.innerHTML = `<button id="toggleFontButton">Switch to Large Font</button>`;
      document.body.appendChild(fontSizeToggleDiv);
    };
  
    // A helper to make a widget draggable using d3.
    GanttWidget.makeDraggable = function (selection) {
      var isDragging = false;
      var startX, startY, offsetX = 0, offsetY = 0;
      selection
        .on("mousedown touchstart", function (event) {
          isDragging = true;
          var e = event.type === "touchstart" ? event.touches[0] : event;
          startX = e.clientX - offsetX;
          startY = e.clientY - offsetY;
          d3.select(this).select(".widget-header").style("cursor", "grabbing");
        })
        .on("mousemove touchmove", function (event) {
          if (isDragging) {
            var e = event.type === "touchmove" ? event.touches[0] : event;
            offsetX = e.clientX - startX;
            offsetY = e.clientY - startY;
            d3.select(this)
              .style("transform", "translate(" + offsetX + "px, " + offsetY + "px)");
          }
        })
        .on("mouseup touchend", function () {
          isDragging = false;
          d3.select(this).select(".widget-header").style("cursor", "grab");
        });
    };
  })();
  
