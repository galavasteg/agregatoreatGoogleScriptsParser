# agregatoreatRuGoogleScriptsParser
Google scripts .gs-files for parsing information about order owners from the agregatoreat.ru and mailing them your offer.

1. Copy [GoogleSheet](https://docs.google.com/spreadsheets/d/14uAUNbD9NJSS1S-GHGMkDeqsznfqYeWE6ieeG3g8iaw/edit?usp=sharing "Sheet example") example to your Google Drive

2. Open scripts. Set parameters in [CONFIG.gs](https://github.com/galavasteg/agregatoreatGoogleScriptsParser/blob/master/GScripts/CONFIG.gs "Script configuration"):
    * __authToken__ - token from your *agregatoreat* company account
    * __extSystem__ - nine digits from your *agregatoreat* company account
    * __fromEmailAddress__ - e-mail from which e-mails with your offer will be sent
    * __htmlTemplFileName__ - the name of the html-body file for your emails
    * __pdfFileName__ - pdf-attachment file name
>NOTE: The last two files must be added to your Google Drive!

3. Set triggers on functions *renewUnprocessedOrders* and *renewUnprocessedEmails*. You can read about the mechanism of the parser and mailer in the [MAIN.gs](https://github.com/galavasteg/agregatoreatGoogleScriptsParser/blob/master/GScripts/MAIN.gs "Main script")