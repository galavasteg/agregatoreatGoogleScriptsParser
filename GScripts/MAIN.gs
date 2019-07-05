function Test() {
  // собираем номера заказов в очередь на парсинг
  renewUnprocessedOrders()
  // парсим заказы из этой очереди
  parseOrder()
  // собираем email в очередь на рассылку
  renewUnprocessedEmails()
  // рассылка писем
  mail();
}

/* TODOs:
getOrders: indexOf or XMLparse ?
indexOf or Utilities.formatString or replaceAll ?
doc/comments on English
link on GSheet

logger
refactoring names vars (const as CONST format)
ss and files to cash
timezone for GetCurTime
check email is delivered
*/

var ss = SpreadsheetApp.getActive();


/* Триггер создается автоматически при появлении новых email
 на частоту 1 запуск в 5 мин. Триггер удаляется, если
 - очередь на парсинг пустая
 - исчерпан лимит посыла сообщений
 - fromEmailAddress (см. CONFIG.gs) - не текущий пользователь и
 на него не настроен псевдоним. */
function mailing() {
  for (i=0; i<5; i++) {
    mail();
  }
}

/* Триггер выставляется автоматически при появлении новых заказов
 на частоту 1 запуск в 2 мин. Если очередь на парсинг пустая -
 триггер удаляется. */
function collectOrderOwners() {
  parseOrder();
  parseOrder();
  parseOrder();
  parseOrder();
  parseOrder();
  parseOrder();
  parseOrder();
  parseOrder();
//  for (var i=0; i<8; i++) {
//    // TODO: often work only one iteration without another 
//    parseOrder();
//  }
}