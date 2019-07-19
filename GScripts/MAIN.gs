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


/*
Happy-path
*/
function Test() {
  // collect orders' ids
  renewUnprocessedOrders()
  // fetch details of order
  parseOrder()
  // collect unprocessed emails
  renewUnprocessedEmails()
  // send email
  mail();
}


/*
Send several emails.
If new emails were collected (by renewUnprocessedEmails function)
the trigger on this function creates automatically.
Created trigger will run once per 5 minutes.
The trigger will be deleted in one of this cases:
 - there are no new email-addresses;
 - there was exceeded email-sending limit (Google global limit);
 - fromEmailAddress parameter (in CONFIG.gs) is not a current script user
   or current script user has not alias on fromEmailAddress.
 */
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