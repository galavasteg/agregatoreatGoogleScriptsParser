function utilsTest() {
  console.log(getCurTime());
  
//  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetNames[0]);
//  console.log(getLastColumnRow(sheet, 1));

//  console.log(getValRow(sheetNames[0],
//                        getColumnNum(sheetNames[0], 'E-mail'),
//                        'tambov_rosgvfin@mail.ru'))
}

function getCurTime() {
  timezone = "GMT+" + new Date().getTimezoneOffset()/60;
  console.log(Utilities.formatDate(new Date(), timezone, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
  return Utilities.formatDate(new Date(), timezone, "yyyy-MM-dd HH:mm");
}

function createMinutesTrigger(triggerFuncName, Nmin) {
  var triggers = ScriptApp.getProjectTriggers();
  var isTriggerExist = triggers.some(function(trigger) {
    return trigger.getHandlerFunction() == triggerFuncName;
  });
  if (!isTriggerExist) {
    ScriptApp.newTrigger(triggerFuncName)
      .timeBased()
      .everyMinutes(Nmin)
      .create();
    console.info('Создан триггер на функцию "%s"!', triggerFuncName);
  } else console.info('Триггер на функцию "%s" уже был создан!', triggerFuncName);
}

function deleteTrigger(triggerFuncName) {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() == triggerFuncName) {
      ScriptApp.deleteTrigger(trigger);
      console.info('Триггер на функцию "%s" удален!', triggerFuncName);
    }
  });
}

function rewriteColumn(sheetName, colNum, vals) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var lastColRow = getLastColumnRow(sheet, colNum);
  if (lastColRow != 1) {
    sheet.getRange(2, colNum, sheet.getLastRow()-1, 1).deleteCells(deleteDimenation);
  }
  var newRange = sheet.getRange(2, colNum, vals.length);
  var valuesToPaste = [];
  for (i in vals) {
    valuesToPaste[i] = [vals[i]];
  }
  newRange.setValues(valuesToPaste);
}

function getValRowNum(sheetName, col, val) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var sheetData = sheet.getDataRange().getValues();
  var valIndex = col - 1;
  for (var i in sheetData) {
    var row = +i + 1;
    var tableVal = sheetData[i][valIndex];
    if (tableVal == val) {
      return row;
    }
  }
}

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  if (!re.test(email)) {
    return false;
  } else {
    var testSheet = SpreadsheetApp.openById(arbitrarySpreadsheetInYourDrive);
    try {
      testSheet.addViewer(email);
    } catch(e) {
      return false;
    }
    testSheet.removeViewer(email);
    return true;
  }
}

function setRowData(sheetName, row, vals) {
  // TODO: rm if unused
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  return sheet.getDataRange().getValues()[row-1]
}

function getRowData(sheetName, row) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  return sheet.getDataRange().getValues()[row-1]
}

function getSheetData(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  return sheet.getDataRange().getValues()
}

function setCell(sheetName, row, col, val) {
  var sheet = ss.getSheetByName(sheetName);
  var range = sheet.getRange(row, col);
  range.setValue(val)
}

function popFirstColValue(sheetName, colNum) {
  var sheet = ss.getSheetByName(sheetName);
  var range = sheet.getRange(2, colNum);
  var val = range.getValue();
  range.deleteCells(deleteDimenation);
  return val;
}

function getColumnVals(sheetName, colNum) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var lastColRow = getLastColumnRow(sheet, colNum);
  if (lastColRow == 1) {
    return [];
  }
  var vals = sheet.getRange(2, colNum, lastColRow - 1).getValues();
  for (i in vals) {
    vals[i] = vals[i][0];
  }
  return vals;
}

function getLastColumnRow(sheet, colNum) {
  var range = sheet.getRange(1, colNum, sheet.getLastRow())
  var colVals = range.getValues();
  return colVals.filter(String).length;
}

function getUnique(vals) {
  var unique = [];
  vals.forEach(function(val) {
    if (unique.indexOf(val) == -1) {
      unique.push(val);
    }
  });
  return unique;
}

function checkIsTextInColumn(sheet, colName, text) {
  var colNum = getColumnNum(sheet.getName(), colName);
  var colVals = getColumnVals(sheet.getName(), colNum);
  var check = colVals.indexOf(text);
  return (check == -1)? false : true;
}

function getColumnNum(sheetName, colName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var cols = sheet.getRange(sheetName+"!A1:N1").getValues();
  return cols[0].indexOf(colName) + 1;
}

function toSentenseCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function getXmlTagValue(text, templTag, from) {
  var start = text.indexOf(templTag, from);
  // console.log(templTag + from + start)
  if ( start == -1 ) {
    return {'end': text.length, 'start': text.length, 'subText': ''};
  }
  start = start + templTag.length
  var end = text.indexOf('<', start);
  return {'end': end, 'start': start, 'subText': text.substring(start, end)};
}

function getFileId(fName) {
  var files = DriveApp.getFilesByName(fName);
  var file = files.next();
  return file.getId();
}