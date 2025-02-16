# tpgantt
Gantt widget that can be loaded in a single line.  The folder structure is as follows: 
  ├── ganttWidget.js         // Main file – include this in your HTML
  ├── dependencyLoader.js    // Loads external libraries (D3, XLSX)
  ├── widgetUtils.js         // Utility functions (text wrap, random data, color mapping)
  ├── widgetStylesUI.js      // Injects CSS and builds shared UI elements (tooltip, buttons)
  ├── widgetRenderer.js      // Contains the rendering functions and widget layout
  └── widgetExcel.js         // Handles Excel upload and column‐mapping UI
  
1. ganttWidget.js (Main File) This file is the only one you include in your HTML. It loads the other modules sequentially, loads external dependencies (via the module in dependencyLoader.js), and then starts the widget.
2. dependencyLoader.js This module checks for and loads D3 and XLSX if they aren’t already available.
3. widgetUtils.js This file contains utility functions such as wrapping long text, generating random task data, and a simple color mapper.
4. widgetStylesUI.js This module injects the widget’s CSS styles and creates shared UI elements (tooltip, Excel uploader, and toggle buttons). It also exposes a helper function for making widgets draggable.
5. widgetRenderer.js This module contains the core functions to render (or re‑render) the widget(s). It sets up the layout, axes, bars, and applies the proper scaling. It also attaches event listeners for the toggle buttons.
6. widgetExcel.js This module handles the Excel file upload, shows the column‐mapping UI, processes the mapping, and then passes the parsed tasks to the renderer.

7. How It Works
HTML Page:
Include only the main file:

<script src="ganttWidget.js"></script>
ganttWidget.js:
This file creates a global GanttWidget object, loads all module files in sequence, then calls
GanttWidget.loadDependencies() (which loads D3 and XLSX) and finally calls GanttWidget.init().

Modules:
Each module attaches functions to the global GanttWidget namespace. For example, widgetRenderer.js defines init() and renderWidgets(), and widgetExcel.js defines the Excel upload handling.

Usage:
Whether no Excel file is uploaded (in which case random tasks are generated) or the user uploads an Excel file and maps its columns, the widget will render accordingly.

This refactoring keeps your HTML file clean (only one script include) while breaking your code into several manageable files. Feel free to adjust or further modularize the code as needed!
