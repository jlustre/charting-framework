/** 
 * This file is used for charting specifically using the CanvasJS Library
 * @param  {object} stdData  This is the standard data input
 * @param  {string} chartlocation The div id where on the html page where to placed the chart
 */
function canvasjs_adapter(stdData, chartlocation) {
		
		//If the path below is different please change it to the right path appropriately
    require('lib/canvasjs/canvasjs.min.js');
    
    var title = {
      text: stdData.tableHeader,
    };

    var origChildRow = stdData.childRows;
    childRow = getChildRow(origChildRow, stdData.columnHeaders, stdData.chartType, 0);

    var chart = new CanvasJS.Chart(chartlocation, {
        theme:  'theme1',
        containerId: chartlocation,
        title: title,
        colhdrs: stdData.columnHeaders,
        charttype: stdData.chartType,
        backgroundColor: stdData.bgcolor,
        data: childRow.inputdata,
    });

    chart.render();
} 

/** 
 * This function generates the table rows
 * @param  {[type]} crdata    This is the childrow data
 * @param  {[type]} colhdrs   These are the column headers
 * @param  {[type]} charttype Type of chart
 * @param  {[type]} level     [description]
 * @return {[type]}           [description]
 */
function getChildRow (crdata, colhdrs, charttype, level) {
  var inputdata = [];
  var newChildRows = [];

  var z = 0;
  if (crdata instanceof Array) {
    if(!crdata.length) {
       console.log('CRData is empty!');
       return;
    }
  } else {
    console.log('CRData not an Array!');
    return;
  }
  
  for (var i= 0; i < crdata.length; i++) {
      var dPoints = [];
      
      if (crdata[i].hasOwnProperty('childRows')) { 
        newChildRows.push(crdata[i].childRows);
      }

      var chldRow = crdata[i].childRows;
      for (var j = 0; j < crdata[i].rowValues.length; j++) {
          var dtaPts = {
              label: colhdrs[j],
              name: crdata[i].rowHeader,
              toolTip: crdata[i].tooltips[j],
              chldRow: chldRow,
              chldIndex: i,
              click: onClick,
              y: crdata[i].rowValues[j]
          }
          dPoints.push(dtaPts);
      }

      inputdata[z++] = {
        type: charttype,
        legendText: crdata[i].rowHeader,
        toolTipContent: "<b>{name}</b><br>{label}: {y}<br>{toolTip}", 
        showInLegend: true,
        dataPoints: dPoints
      };

      //process subrows
      if (crdata[i].hasOwnProperty('subRows')) {  
        for(var sr=0; sr < crdata[i].subRows.length; sr++) {
          var sRowPts = [];
          for (var srr = 0; srr < crdata[i].subRows[sr].rowValues.length; srr++) {
            var sRPts = {  
              label: colhdrs[srr],
              name: crdata[i].subRows[sr].rowHeader,
              toolTip: crdata[i].subRows[sr].tooltips[srr],
              chldRow: 'subRow',
              chldIndex: i,
              click: onClick,
              y: crdata[i].subRows[sr].rowValues[srr]
            }
            sRowPts.push(sRPts);
          }

          inputdata[z++] = {
            type: charttype,
            legendText: crdata[i].subRows[sr].rowHeader,
            toolTipContent: "Subrow: <b>{name}</b><br>{label}: {y}<br>{toolTip}", 
            showInLegend: true,
            dataPoints: sRowPts
          };
        } 
      }
  }

  return {
    level: level,
    inputdata: inputdata
  }

}

/** 
 * This function is executed whenever a user clicks on a bar of the chart
 * @param  {object} e The event object
 */
function onClick(e) {

    //*********************** This is still under construction **********************
    if (!e.dataPoint.chldRow) {
      console.log('Returning no childrow');
      return;
    } else {
        childRow = e.dataPoint.chldrow;

        var cr = getChildRow(childRow , e.chart.colhdrs, e.chart.charttype);
        
        if (!cr) {
           console.log('Returning no input data available!');
           return
        }
        
        var chart = new CanvasJS.Chart(containerId, {
            theme:  e.chart.options.theme,
            title: e.chart.options.title,
            colhdrs: e.chart.options.colhdrs,
            charttype: e.chart.options.charttype,
            backgroundColor: e.chart.options.backgroundColor,
            data: cr.inputdata,
        });
        chart.render();
    }
    
}
