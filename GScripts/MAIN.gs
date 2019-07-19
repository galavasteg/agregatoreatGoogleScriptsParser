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

/*
Fetch details of several orders.
If new orders were collected (by renewUnprocessedOrders function)
the trigger on this function creates automatically.
Created trigger will run once per 2 minutes.
If there is no new order, the trigger will be deleted.
*/
function collectOrderOwners() {
  parseOrder();
  parseOrder();
  parseOrder();
  parseOrder();
  parseOrder();
  parseOrder();
  parseOrder();
  parseOrder();
  // for (var i=0; i<8; i++) {
  //   // TODO: often work only one iteration, others are not called
  //   parseOrder();
  // }
}