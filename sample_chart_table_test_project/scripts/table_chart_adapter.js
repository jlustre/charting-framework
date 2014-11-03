if (typeof jQuery === 'undefined') throw "jQuery Required"; //This checks if jQuery library is available

/** 
 * This function is used to automatically include a file example: the charting library
 * @param  {string} script This is the path and name of the file to be included
 */
function require(script) {
    $.ajax({
        url: script,
        dataType: "script",
        async: false,           
        success: function () {
            //console.log('SUCCESS: The file ' + script + ' was found!');
        },
        error: function () {
            throw new Error("ERROR: Could not load script " + script);
            console.log("ERROR: Could not load script '" + script + "'");
        }
    });
}

/** 
 * This function extract and return the main object of the standard file
 * @param  {object} data The standard file that was return by the function getStandardData 
 * @return {object}      Returns the main attributes of the root object from standard table
 */
function processTableData(data) {
    if (data.hasOwnProperty('tableMetaData')) {  
        var tableType = (data.tableMetaData.hasOwnProperty('tableType')) ? data.tableMetaData.tableType : '';
        var tableHeader = (data.tableMetaData.hasOwnProperty('tableHeader')) ? data.tableMetaData.tableHeader : '';
        var bgcolor = (data.tableMetaData.hasOwnProperty('bgcolor')) ? data.tableMetaData.bgcolor : '#FFF';
        var columnHeaders = (data.tableMetaData.hasOwnProperty('columnHeaders')) ? data.tableMetaData.columnHeaders : '';
        var chartType = (data.tableMetaData.hasOwnProperty('chartType')) ? data.tableMetaData.chartType : '';
        var barChartColor = (data.tableMetaData.hasOwnProperty('barChartColor')) ? data.tableMetaData.barChartColor : '';
    }
    if (data.hasOwnProperty('childRows')) {  
        var childRows = (data.childRows.length) ? data.childRows : [];
    }    
    return {
      tableType: tableType,
      tableHeader: tableHeader,
      bgcolor: bgcolor,
      columnHeaders: columnHeaders,
      chartType: chartType,
      barChartColor: barChartColor,
      childRows: childRows
    };
}

/** 
 * The main class of the chart object
 * @param {string} adapter_type the name of the Charting library you are using ex: 'canvasjs', 'kendoui'
 * @param {string} dataPath Path of the Standard file input
 * @return {object} Returns the main attributes of the root object from standard table
 */
function Chart(adapter_type, standard_data) {
  
  var chartData = processTableData(standard_data.tables[0]); //Get the standard input data

  /** 
   * This will generate the chart based on the charting library chosen
   * @param  {string} chartlocation The div id on the html page to place the chart
   */
  var renderChart = function (chartlocation) {

     var script_url = 'scripts/'+ adapter_type + '.js';
     require(script_url );  //this will make sure the right adapter is loaded

     window[adapter_type](chartData, chartlocation); //call the function whose name is based on adapter_type 
  };

  return {
    renderChart: renderChart
  }
}

/** 
 * The main class of the table object
 * @param {string} adapter_type the name of the table adapter
 * @param {object} standard_data json object of the Standard file input
 */
function Table(adapter_type, standard_data) {
  
  var tableData = processTableData(standard_data.tables[0]); //Get the standard input data

  /** 
   * This will generate the chart based on the charting library chosen
   * @param  {string} chartlocation The div id on the html page to place the chart
   */
  var renderTable = function (tablelocation) {

     var script_url = 'scripts/'+ adapter_type + '.js';
     require(script_url );  //this will make sure the right adapter is loaded

     window[adapter_type](tableData, tablelocation); //call the function whose name is based on adapter_type 
  };

  return {
    renderTable: renderTable
  }
}

