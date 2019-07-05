function mailTest() {
//  console.log(Session.getEffectiveUser().getEmail());
//  d = getOrderInfo()
//  console.log(getMailBody(d))
  renewUnprocessedEmails();
//  mail();
}

function mail() {
  if (isPossibleSendEmail() & checkFromEmail()) {
    orderOwnerMail();
  } else {
    deleteTrigger('mailing');
  }
}

function orderOwnerMail() {
  var email = popFirstColValue('очереди', 1);
  var orderOwnerRow = getValRowNum(sheetNames[0],
                                   getColumnNum(sheetNames[0], 'E-mail'),
                                   email)
  var orderInfo = getOrderOwnerInfoFromSheet(orderOwnerRow);
  var htmlBody = getMailBody(orderInfo);
  try {
    sendGMail(email, htmlBody);
    console.info('КП отправлено! %s %s: %s', orderInfo['Имя'], orderInfo['Отчество'], email);
    updateOrderOwnerStatus(orderOwnerRow, 'КП отправлено');
  }
  catch(e) {
    updateOrderOwnerStatus(orderOwnerRow, 'Ошибка');
    console.error('Ошибка при отправке письма %s %s %s: %s',
                  orderInfo['Имя'], orderInfo['Отчество'], email, e);
  }
}

function getOrderOwnerInfoFromSheet(row) {
  var orderOwnerRow = getRowData(sheetNames[0], row);
  var orderOwnerInfo = {};
  headers.forEach(function(field, i) {
    orderOwnerInfo[field] = orderOwnerRow[i];
  })
  return orderOwnerInfo;
}

function updateOrderOwnerStatus(row, statusToSet) {
  var col = headers.indexOf('СТАТУС') + 1;
  setCell(sheetNames[0], row, col, statusToSet);
}

function getMailBody(orderOwnerInfo) {
  var fields = Object.keys(orderOwnerInfo);
  var body = htmlTempl;
  fields.forEach(function(field) {
    body = replaceAll(body, '{'+field+'}', orderOwnerInfo[field]);
  })
  return body;
}

function renewUnprocessedEmails() {
  unprocessedEmails = filterOrderOwnersEmails();
  console.info("Email'ов в очередь на рассылку: " + unprocessedEmails.length);
  if (!!unprocessedEmails.length) {
    rewriteColumn('очереди', 1, unprocessedEmails);
    if (isPossibleSendEmail() & checkFromEmail()) {
      createMinutesTrigger("mailing", 5);
    }
  }
}

function filterOrderOwnersEmails() {
  var sheetData = getSheetData('Рассылка');
  var headers = sheetData[0];
  var emailIndex = headers.indexOf('E-mail');
  var statusIndex = headers.indexOf('СТАТУС');
  var unprocessedEmails = [];
  for each (var orderOwnerRow in sheetData.slice(1)) {
    if (orderOwnerRow[statusIndex] == 'В очереди') {
      unprocessedEmails.push(orderOwnerRow[emailIndex]);
    }
  }
  return unprocessedEmails;
}

function isPossibleSendEmail() {
  var mailsLimit = MailApp.getRemainingDailyQuota();
  console.info('Ограничение по отправке писем: ' + mailsLimit);
  return checkIsEmailsExist() & !!mailsLimit
}

function checkIsEmailsExist() {
  var check = true;
  var lastColRow = getLastColumnRow(ss.getSheetByName('очереди'), 1);
  if (lastColRow == 1) {
    check = false;
    console.info('Нет новых e-mail для рассылки!');
  }
  return check;
}

function checkFromEmail() {
  // TODO: doc
  var check = true;
  var curUserEmail = Session.getEffectiveUser().getEmail();
  if (curUserEmail != fromEmailAddress & GmailApp.getAliases().indexOf(fromEmailAddress) == -1) {
    var check = false;
    console.error('Настройте псевдоним "%s", или запускайте скрипты под этой учетной записью', fromEmailAddress);
  }
  return check;
}

function sendGMail(email, htmlBody) {
  var pdfFile = DriveApp.getFileById(pdfFileId);
  GmailApp.sendEmail(email, 'RE: IDEACRAFT - запрос по закупке', '', {
    from: fromEmailAddress,
    replyTo: fromEmailAddress,
    htmlBody: htmlBody,
    name: 'IDEACRAFT',
    attachments: [pdfFile.getAs(MimeType.PDF)]
  });
}
