var inputData = '';
var dataTableUrl = 'lib/jquery/jquery.dataTables.min.js';
var imagesPath = window.location.pathname + 'images/';
var imgOpen = imagesPath + 'details_open.png';
var imgClose = imagesPath + 'details_close.png';
var level = 0;
var plevel = 0;
var lvldepth = 0;
var item = 0;
var parent = '';
var gparent = '';

var rwhdr = '';

var ctr = 0;
var temp = 1;
var cid = '';

/** 
 * This file is used for charting specifically using the CanvasJS Library
 * @param  {object} stdData  This is the standard data input
 * @param  {string} chartlocation The div id where on the html page where to placed the chart
 */
function table_adapter(stdData, tableLocationId) {
  //chart rendering
  require(dataTableUrl);
  
  inputData += '<tbody>';

  generateHtml(stdData, level, item, parent);

  inputData += '</tbody>';

  $('#'+tableLocationId).append('<table class="display" id="outtbl"></table>');
  
  $('#outtbl').append(generateColHeaders(stdData));
  $('#outtbl').append(inputData);

  $('#outtbl').dataTable( {
      "paging":   false,  //disable the pagination
      "ordering": false,  //disable sorting
      "info":     false,  //disable info
      "bFilter":  false,  //disable searching
  } );

}
function makeid(level) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < 3; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return level + text;
}

function generateHtml(sdata, level, item, parent) {

  if (!sdata.hasOwnProperty('childRows')) {
      return;
  }
  var childRows = sdata.childRows;
  var childCount = childRows.length;

  for (var i = 0; i < childCount; i++) {
    var dta = childRows[i];
    
    level_id = makeid(level);
    //level_id = item;
    generateChildRows(dta, level, level_id, parent)
    item++;
 
    if (dta.hasOwnProperty('childRows')) {
        plevel = level;
        lvldepth++;
        gparent = parent;
        parent = 'p_' + level_id;
        level++ ; 
        item++;
        generateHtml(dta, level, item, parent);
        if (lvldepth > 0) {
          level--;
          lvldepth--;
          item++;
        } 
        parent = (level > 0) ? gparent : '';
    } 
    item++;
  }

}

function generateChildRows(dta, level, lvl_id, prnt)  {
  
  var hasSubRow = (dta.hasOwnProperty('subRows')) ? true : false;
  var hasChildRow = (dta.hasOwnProperty('childRows')) ? true : false;
  var imgHdr = (hasChildRow) ? '<img src="'+imgClose+'"/>': '';
  var indentSr = (hasChildRow) ? ' indentSr': '';

  inputData += '<tr class="lvl_'+ level + ' '+ prnt + '" id="'+lvl_id+'">';
  inputData += '<td>';
  rwhdr= dta.rowHeader;
 // inputData += imgHdr + dta.rowHeader +' lvl=' + level + ' id=' + lvl_id + ' p=' + prnt;
  inputData += imgHdr + dta.rowHeader;
  if (hasSubRow) {
    for(var sr = 0; sr < dta.subRows.length; sr++) {
      inputData += '<br><span class="subrow_head'+indentSr+'">'+dta.subRows[sr].rowHeader + '</span>';
    }
  } 
  inputData += '</td>';
  
  for (var j = 0; j < dta.rowValues.length; j++) {
    inputData += '<td>';
    inputData += dta.rowValues[j]; 
    if (hasSubRow) {
      for(var sr = 0; sr < dta.subRows.length; sr++) {
        var srVal = dta.subRows[sr];
        inputData += '<br><span class="subrow_val">'+srVal.rowValues[j]+'</span>';
      }
    } 
    inputData +='</td>';
  }

  inputData += '</tr>';
}  

function generateColHeaders(stdData) {
     var colheaders =  '<thead>';
      colheaders += '<tr><th>Name</th>';
      for (var c = 0; c < stdData.columnHeaders.length; c++) {
          colheaders += '<th>'+stdData.columnHeaders[c]+'</th>'; 
      }
      colheaders += '</tr></thead>';

      return colheaders;
}

/*
function generateHtml(dta, level, item, prnt) {
  
  if (prnt) {
      inputData += generateChildRows(dta, newLevel, item, prnt); 
  }
  

  if (!dta.hasOwnProperty('childRows')) {
    console.log('childrow has no property at level ' + level + ', item =' + item);
    return; 
  }
  if (!dta.childRows.length) {
    console.log('childrow is empty at level ' + level + ', item = ' + item);
    return;
  }
  
  level = (parseInt(item) === 0) ? level++ : level;

  for (var i = 0; i < dta.childRows.length; i++) {
     level = (i != 0) ? level-- : level;
     var lvl_id = level + '' + item;
     inputData += generateChildRows(dta.childRows[i], level, i, lvl_id, prnt); 
     
     if (dta.childRows[i].hasOwnProperty('childRows')) {
        if (dta.childRows[i].childRows.length) {
           
           var newParent = 'p_' + lvl_id;
           var newLevel = level + 1;
           var newData = dta.childRows[i].childRows;

           for(var j = 0; j < newData.length; j++) {
              inputData += generateHtml(newData[j], newLevel, j, newParent); 
           }
        }
     }


  }
}

*/

/** 
 * This function is used to process and generate the table
 * @param  {object} $ The jQuery object
 */
jQuery(function ($) {
  var treeTable = {
      parentClassPrefix : '',
      collapsedClass : 'collapsed',
      openClass : 'open',
      
      init : function(parentClassPrefix) {
          this.parentClassPrefix = parentClassPrefix;
          $('table').on('click', 'tr', function () { 
              treeTable.toggleRowChildren($(this));
              treeTable.toggleParent($(this));
              treeTable.switchImage($(this));
          });
      },

      switchImage : function (ele) {
          var fimg = ele.find('img');
          var curr = fimg.attr('src');
          if (ele.hasClass(treeTable.openClass)) {
            fimg.attr('src', imagesPath + 'details_close.png');
          } else {
            fimg.attr('src', imagesPath + 'details_open.png');
          }
      },

      toggleRowChildren : function(parentRow) {
          var childClass = this.parentClassPrefix+parentRow.attr('id');
          var childrenRows = $('tr', parentRow.parent()).filter('.'+childClass);

          childrenRows.toggle();
          var idArray = [];
          childrenRows.each(function(){
              if (!$(this).hasClass(treeTable.collapsedClass)) {
                  treeTable.toggleRowChildren($(this));
              }
              console.log($(this).attr('id'));
              idArray.push($(this).attr('id'));
          });

          parentRow.toggleClass(this.collapsedClass);
         //console.log(idArray);
      },

      toggleParent : function(parentRow) {
          var fimg = parentRow.find('img');
          var curr = fimg.attr('src');

          if ( curr == imagesPath + 'details_open.png' ) {
             parentRow.addClass(this.openClass);
             console.log('ID = ' + parentRow.attr('id') + ' is OPEN');
          } else {
             parentRow.removeClass(this.openClass);
             console.log('ID = ' + parentRow.attr('id') + ' is CLOSED');
          }

      }
  };
  
  treeTable.init('p_');
});

