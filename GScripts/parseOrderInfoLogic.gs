function parseOrderInfoTest() {
  var t = '<div ref="printData"> <h1>Объявление о закупочной сессии №100142535119000022</h1> <br> <b>Номер: </b>100142535119000022 <br> <b>Дата и время начала закупочной сессии: </b>2019-05-28 04:21:54 <br> <h2>Информация о заказчике</h2> <b>Наименование организации, ФИО уполномоченного лица заказчика: </b>КГКУ ДЕТСКИЙ ДОМ 34 / Жихарева Антонина Николаевна <br> <b>Адрес заказчика: </b>г Комсомольск-на-Амуре, край Хабаровский, ул Советская дом 20<br> <b>Адрес электронной почты заказчика: </b>buh_internat7@mail.ru <br> <b>Номер контактного телефона заказчика: </b>+7 (421)-725-06-60 <br> <h2>Характеристики товара:</h2> <b>Наименование товара: </b>Услуги по междугородней перевозке пассажиров, 1 шт <br> <b>Код по ОКПД2: </b>49.39.11.000 <br> <b>Код продукции: </b>300832049.000000026_19 <br> <b>Единица измерения: </b>Штука <br> <b>Страна происхождения: </b>Российская Федерация <br> <b>Производитель: </b>Не указано <br> <b>Фирменное наименование: </b>Не указано <br> <h2>Условия закупки</h2> <b>Объем поставки: </b>1 <br> <b>Срок поставки (выполнения работ, оказания услуг): </b>29.05.2019 <br> <b>График поставки: </b> <br> <b>Место поставки: </b>г Комсомольск-на-Амуре, край Хабаровский, ул Советская дом 20 <br> <b>Стартовая цена, руб.: </b>1120 руб. <br> <b>Условия оплаты: </b>Не указано <br> <b>Информация о возможности и случаях одностороннего расторжения сделки в соответствии с действующим законодательством Российской Федерации: </b>Не указано <br> <b>Планируемая дата заключения договора: </b>29.05.2019 </div>';
  console.log(parseOrderInfo(t))
}

function parseOrderInfo(text) {
  var oneLineText = replaceAll(text, '\n', '');
  var orderInfo = {};
  var fields = Object.keys(fieldsTemplMap);
  for each (var field in fields)
  {
    var fieldTempl = fieldsTemplMap[field];
    var parsedText = getXmlTagValue(oneLineText, fieldTempl['templ'])['subText'];
//    console.log(field, fieldTempl['templ'], parsedText)
    if (!!fieldTempl['preprocessFunc']) {
      parsedText = fieldTempl['preprocessFunc'](parsedText);
    }
    orderInfo[field] = parsedText;
  }
  return orderInfo;
}

function getCompany(text) {
  var company = text.split(' / ')[0]
  return replaceAll(company, '"', '""');
}
function getAuthPersonSurname(text) {
  var FIOList = text.split(' / ')[1].split(' ');
  return toSentenseCase(FIOList[0]);
}
function getAuthPersonFirstname(text) {
  var FIOList = text.split(' / ')[1].split(' ');
  return toSentenseCase(FIOList[1]);
}
function getAuthPersonPatronymic(text) {
  var FIOList = text.split(' / ')[1].split(' ');
  return toSentenseCase(FIOList[2]);
}

function numbersFilter(text) {
  return text.replace(/\D/g, '');
}

function emailFilter(text) {
  return /\S+@\S+\.\S+/.exec(text)[0]; // stops on 1294 Хуако	Юра	Сафербиевич
}

function getInitStatus(text) {
  return 'В очереди';
}

function getCustomerId(orderNum) {
  return orderNum.slice(3,9)
}

function getOrderNumLink(id, val) {
  var link = replaceAll(orderInfoOnSite, '{orderInfoId}', id);
  return '=HYPERLINK("' + link + '";"' + val + '")'
}
function getCustomerLink(id, val) {
  var link = replaceAll(orderCustomerOnSite, '{customerId}', id);
  return '=HYPERLINK("' + link + '";"' + val + '")'
}
