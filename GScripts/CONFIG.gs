var authToken = 'token from your agregatoreat company account';
var extSystem = 'nine digits from your agregatoreat company account';
var fromEmailAddress = 'email@to.reply';

var apiUrl = 'https://agregatoreat.ru/integration/ecom/rest/api';
var apiHeaders = {'Authorization': 'Bearer '+ authToken, 'Content-Type': 'text/xml'};
function getApiHeaders(data) {
  return {'method': 'post', 'headers': apiHeaders, 'payload': data};
}

// getting email-content
var htmlTemplFileName = 'mailHTMLBody.html'
var htmlTemplFileId = getFileId(htmlTemplFileName);
var htmlTemplFile = DriveApp.getFileById(htmlTemplFileId);
var pdfFileName = 'IDEACRAFT.pdf'
// MAIL content
var htmlTempl = htmlTemplFile.getBlob().getDataAsString();
var pdfFileId = getFileId(pdfFileName);

// TODO: feature, download order's spec file
var extDocsUrl = 'https://agregatoreat.ru/api/ext/documents-api';

var orderInfoUrl = 'https://agregatoreat.ru/api/print/order-info?orderId=';
var orderInfoOnSite = 'https://agregatoreat.ru/purchase/{orderInfoId}/order-info'
var orderCustomerOnSite = 'https://agregatoreat.ru/organization/{customerId}'

var deleteDimenation = SpreadsheetApp.Dimension.ROWS;

var sheetNames = ['Рассылка', 'очереди'];
var headers = getSheetData(sheetNames[0])[0];
// Column headers exept thе last one (Комментарий)
headers = headers.slice(0, headers.length-1);

// See functions from *parseOrderInfoLogic.gs*
var fieldsTemplMap = {
  'Номер закупки': {'templ': '<b>Номер: </b>',
                    'preprocessFunc': numbersFilter,
                    'sheetNames': sheetNames,
                    'getFormulaFunc': getOrderNumLink, 'forFormulaField': 'orderInfoId'},
  'Заказчик': {'templ': 'Наименование организации, ФИО уполномоченного лица заказчика: </b>',
               'sheetNames': sheetNames,
               'preprocessFunc': getCompany,
               'getFormulaFunc': getCustomerLink, 'forFormulaField':'orderCustomerId'},
  'Фамилия': {'templ': 'Наименование организации, ФИО уполномоченного лица заказчика: </b>',
              'sheetNames': sheetNames,
              'preprocessFunc': getAuthPersonSurname},
  'Имя': {'templ': 'Наименование организации, ФИО уполномоченного лица заказчика: </b>',
          'sheetNames': sheetNames,
          'preprocessFunc': getAuthPersonFirstname},
  'Отчество': {'templ': 'Наименование организации, ФИО уполномоченного лица заказчика: </b>',
               'sheetNames': sheetNames,
               'preprocessFunc': getAuthPersonPatronymic},
  'Предмет договора': {'templ': '<b>Наименование товара: </b>',
                       'sheetNames': sheetNames},
  'E-mail': {'templ': '<b>Адрес электронной почты заказчика: </b>',
             'sheetNames': sheetNames,
             'preprocessFunc': emailFilter},
  'Телефон': {'templ': '<b>Номер контактного телефона заказчика: </b>',
              'sheetNames': sheetNames,
              'preprocessFunc': numbersFilter},
  'СТАТУС': {'templ': 'nothing',
             'sheetNames': sheetNames,
             'preprocessFunc': getInitStatus},
  'orderInfoId': {'templ': 'nothing'},  // Collects on getOrderInfo
  'orderCustomerId': {'templ': '<b>Номер: </b>',
                      'preprocessFunc': getCustomerId}
}
