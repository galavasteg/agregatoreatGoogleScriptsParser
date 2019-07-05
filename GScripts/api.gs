function apiTest() {
  operId = Utilities.getUuid();
  requestOrderList(operId);
  var ordersList = requestProcessingResult(operId);
  
  var orderNums = [];
  var orderTextDescr = {'end': 0};
  while (orderTextDescr['end'] != ordersList.length) {
    orderTextDescr = getXmlTagValue(ordersList, '<eat:regNumber>', orderTextDescr['end']);
    orderNums.push(orderTextDescr['subText']);
  }
  console.log(orderNums.length);
  for (i in orderNums.slice(0,10)) {
    operId = Utilities.getUuid();
    requestOrderNotification(operId, orderNums[i]);
    text = requestProcessingResult(operId);
    console.log(orderNums[i], text.substring(0, 50));
  }
}

var requestOrderListXml = '<?xml version="1.0" encoding="UTF-8"?><n1:requestOrderList xmlns:eat="http://agregatoreat.ru/eat/" xmlns:n1="http://agregatoreat.ru/eat/object-types/" xmlns:xsi="xmls/eatObjects.xsd" eat:Version="1.11.0" eat:RequestUID="%s"><extSystem>%s</extSystem></n1:requestOrderList>';
var requestOrderNotificationXml = '<?xml version="1.0" encoding="UTF-8"?><n1:requestOrderNotification xmlns:eat="http://agregatoreat.ru/eat/" xmlns:n1="http://agregatoreat.ru/eat/object-types/" xmlns:xsi="xmls/eatObjects.xsd" eat:Version="1.11.0" eat:RequestUID="%s"><eat:OrderNumber>%s</eat:OrderNumber><extSystem>%s</extSystem></n1:requestOrderNotification>';
var requestProcessingResultXml = '<?xml version="1.0" encoding="UTF-8"?><n1:requestProcessingResult xmlns:eat="http://agregatoreat.ru/eat/" xmlns:n1="http://agregatoreat.ru/eat/object-types/" xmlns:xsi="xmls/eatObjects.xsd" eat:Version="1.11.0" eat:RequestUID="%s"><extSystem>%s</extSystem></n1:requestProcessingResult>';

function getRequestOrderListXml(operId) {
  return Utilities.formatString(requestOrderListXml, operId, extSystem);
}

function getRequestOrderNotificationXml(operId, orderNumber) {
  return Utilities.formatString(requestOrderNotificationXml, operId, orderNumber, extSystem);
}

function getRequestProcessingResultXml(operId) {
  return Utilities.formatString(requestProcessingResultXml, operId, extSystem);
}

function requestOrderList(operId) {
  reqParams = getApiHeaders(getRequestOrderListXml(operId));
  response = UrlFetchApp.fetch(apiUrl + '/order/requestOrderList', reqParams);
  return response.getContentText("UTF-8");
}

function requestProcessingResult(operId) {
  reqParams = getApiHeaders(getRequestProcessingResultXml(operId));
  var processingState = 'processing';
  while (['complete', 'error'].indexOf(processingState) == -1) {
    response = UrlFetchApp.fetch(apiUrl + '/processingResult', reqParams);
    var result = response.getContentText("UTF-8");
    processingState = getXmlTagValue(result, '<eat:ProcessingState>')['subText'];
    if (processingState == 'processing') {
      Utilities.sleep(1000*5);
    }
  }
  return result;
}

function requestOrderNotification(operId, orderNumber) {
  reqParams = getApiHeaders(getRequestOrderNotificationXml(operId, orderNumber));
  response = UrlFetchApp.fetch(apiUrl + '/order/orderNotification', reqParams);
  return response.getContentText("UTF-8");
}