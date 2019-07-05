function parserTest() {
  renewUnprocessedOrders();
//  for (i=0; i<1; i++) {
//    parseOrder();
//  }
//  info = getOrderInfo();
//  console.log(info);
//  addOrderOwnerInfo(info);
}

function parseOrder() {
  if (checkIsOrdersExist()) {
    var orderInfo = getOrderInfo();
    if (!!orderInfo) {
      addOrderOwnerInfo(orderInfo);
      console.info('%s: %s ДОБАВЛЕН в БД!', orderInfo['Номер закупки'], orderInfo['E-mail']);
    }
  } else {
    console.info('Отсутствуют заказы в очереди парсера!');
    deleteTrigger('collectOrderOwners');
  }
}

function addOrderOwnerInfo(orderInfo) {
  var sheet = ss.getSheetByName(sheetNames[0]);
  sheet.insertRowBefore(2);
  // наполнение таблицы
  for each (var field in headers)
  {
    var val = orderInfo[field];
    var col = getColumnNum(sheet.getName(), field);
    var cell = sheet.getRange(2, col);
    if (!!fieldsTemplMap[field]['forFormulaField']) {
      var formulaFunc = fieldsTemplMap[field]['getFormulaFunc'];
      var toFormula = orderInfo[fieldsTemplMap[field]['forFormulaField']];
      var formula = formulaFunc(toFormula, val);
      cell.setFormula(formula);
    } else {
      cell.setValue(val);
    }
  }
}

function getOrderInfo() {
  var orderNum = popFirstColValue('очереди', 2);
  storeProcessedOrder(orderNum);
  var operId = Utilities.getUuid();
  requestOrderNotification(operId, orderNum);
  var orderData = requestProcessingResult(operId);
  var orderInfoId = getXmlTagValue(orderData, orderInfoUrl)['subText'];
  if (! !!orderInfoId) {
    console.error('Не найдена ссылка на объявление о закупочной сессии №' +
                 orderNum + ' Детали смотри в следующей записи');
    console.info(orderData);
    return;
  }
  response = UrlFetchApp.fetch(orderInfoUrl + orderInfoId);
  var orderInfo = parseOrderInfo(response.getContentText("UTF-8"));
  orderInfo['orderInfoId'] = orderInfoId;
  if (checkIsEmailExist(orderInfo['E-mail'])) {
    console.info('%s: %s УЖЕ ЕСТЬ в БД!', orderInfo['Номер закупки'], orderInfo['E-mail']);
    orderInfo = null;
  }
  return orderInfo;
}

function checkIsOrdersExist() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('очереди');
  var lastColRow = getLastColumnRow(sheet, 2);
  return (lastColRow == 1)? false : true;
}

function checkIsEmailExist(text) {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Рассылка');
  return checkIsTextInColumn(ss, 'E-mail', text);
}

function renewUnprocessedOrders() {
  var fetchedOrderNums = getOrders();
  var newFetchedOrderNums = filterNewOrderNums(fetchedOrderNums);
  var unprocessedOrderNums = getColumnVals('очереди', 2);
  var concatOrderNums = unprocessedOrderNums.concat(newFetchedOrderNums);
  var uniqueOrderNums = getUnique(concatOrderNums);
  console.info("Закупок в очереди парсера: %s", uniqueOrderNums.length);
  if (!!uniqueOrderNums.length) {
    rewriteColumn('очереди', 2, uniqueOrderNums);
    createMinutesTrigger("collectOrderOwners", 5);
  }
}

function filterNewOrderNums(orderNums) {
  var parsedOrderNums = getColumnVals('очереди', 4);
  var newOrderNums = [];
  for each (var orderNum in orderNums) {
    if (parsedOrderNums.indexOf(orderNum) == -1) {
      newOrderNums.push(orderNum);
    }
  }
  return newOrderNums;
}

function getOrders() {
  operId = Utilities.getUuid();
  requestOrderList(operId);
  var ordersList = requestProcessingResult(operId);
  var orderNums = [];
  var orderTextDescr = {'end': 0};
  while (orderTextDescr['end'] != ordersList.length) {
    orderTextDescr = getXmlTagValue(ordersList, '<eat:regNumber>', orderTextDescr['end']);
    if (!!orderTextDescr['subText']) {
      orderNums.push(orderTextDescr['subText']);
    }
  }
  console.info('Собрано %s номеров закупок', orderNums.length);
  return orderNums;
}

function storeProcessedOrder(orderNum) {
  var sheet = ss.getSheetByName('очереди');
  var lastParsedOrdersRow = getLastColumnRow(sheet, 4);
  setCell('очереди', lastParsedOrdersRow+1, 4, orderNum);
}