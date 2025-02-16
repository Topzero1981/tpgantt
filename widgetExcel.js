(function () {
    // Handle Excel file upload.
    GanttWidget.handleExcelUpload = function (event) {
      var file = event.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: 'array' });
        var firstSheetName = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[firstSheetName];
        var sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (sheetData.length < 1) {
          console.error("No data found in Excel file.");
          return;
        }
        var headers = sheetData[0];
        showMappingUI(headers, sheetData);
      };
      reader.readAsArrayBuffer(file);
    };
  
    // Displays the mapping UI so the user can select which Excel columns map to which data.
    function showMappingUI(headers, sheetData) {
      var mappingDiv = document.createElement("div");
      mappingDiv.id = "mappingUI";
      var mappingFields = [
        { key: "name", label: "Task" },
        { key: "description", label: "Description" },
        { key: "persons", label: "Assigned To" },
        { key: "project", label: "Plan/Project" },
        { key: "start", label: "Start Date" },
        { key: "end", label: "Due Date" }
      ];
      var form = document.createElement("form");
      form.id = "mappingForm";
      mappingFields.forEach(function (field) {
        var div = document.createElement("div");
        var label = document.createElement("label");
        label.textContent = field.label + ": ";
        label.htmlFor = field.key + "Select";
        div.appendChild(label);
        var select = document.createElement("select");
        select.id = field.key + "Select";
        var defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "-- Select Column --";
        select.appendChild(defaultOption);
        headers.forEach(function (header) {
          var option = document.createElement("option");
          option.value = header;
          option.textContent = header;
          select.appendChild(option);
        });
        div.appendChild(select);
        form.appendChild(div);
      });
      var submitButton = document.createElement("button");
      submitButton.textContent = "Process Excel Data";
      submitButton.type = "button";
      submitButton.addEventListener("click", function () {
        processMappingForm(sheetData);
      });
      form.appendChild(submitButton);
      mappingDiv.appendChild(form);
      document.body.appendChild(mappingDiv);
    }
  
    // Process the mapping selections and convert Excel rows into task objects.
    function processMappingForm(sheetData) {
      var mappingFields = [
        { key: "name", label: "Task" },
        { key: "description", label: "Description" },
        { key: "persons", label: "Assigned To" },
        { key: "project", label: "Plan/Project" },
        { key: "start", label: "Start Date" },
        { key: "end", label: "Due Date" }
      ];
      var mapping = {};
      mappingFields.forEach(function (field) {
        var select = document.getElementById(field.key + "Select");
        mapping[field.key] = select.value;
      });
      if (!mapping["name"] || !mapping["project"] || !mapping["start"] || !mapping["end"]) {
        alert("Please select mappings for Task, Plan/Project, Start Date, and Due Date.");
        return;
      }
      var headers = sheetData[0];
      var mappingIndices = {};
      for (var key in mapping) {
        mappingIndices[key] = headers.indexOf(mapping[key]);
      }
      var tasks = [];
      for (var i = 1; i < sheetData.length; i++) {
        var row = sheetData[i];
        if (row.length === 0) continue;
        var task = {};
        task.name = row[mappingIndices["name"]] || "Unnamed Task";
        task.description = row[mappingIndices["description"]] || "";
        task.persons = row[mappingIndices["persons"]] || "Unassigned";
        task.project = row[mappingIndices["project"]] || "Default Project";
        task.start = new Date(row[mappingIndices["start"]]);
        task.end = new Date(row[mappingIndices["end"]]);
        task.color = GanttWidget.getColorFor(task.persons);
        tasks.push(task);
      }
      var mappingDiv = document.getElementById("mappingUI");
      if (mappingDiv) {
        mappingDiv.remove();
      }
      GanttWidget.renderWidgets(tasks);
    }
  
    // (Optional: expose processMappingForm if needed)
    GanttWidget.processMappingForm = processMappingForm;
  })();
  
