# agregatoreatRuGoogleScriptsParser
Google scripts .gs-files for parsing information about order owners from the agregatoreat.ru and mailing them your offer.

1. Copy [GoogleSheet]( "TODO: add link") example to your Google Drive

2. Create new script project

3. Create script files and paste code from the [GScript](https://github.com/galavasteg/agregatoreatGoogleScriptsParser/tree/master/GScripts "GScript directory of this repo")-directory into them 

4. Set parameters in [CONFIG.gs](https://github.com/galavasteg/agregatoreatGoogleScriptsParser/blob/master/GScripts/CONFIG.gs "Script configuration"):
    * __authToken__ - token from your *agregatoreat* company account
    * __extSystem__ - nine digits from your *agregatoreat* company account
    * __fromEmailAddress__ - e-mail from which e-mails with your offer will be sent
    * __htmlTemplFileName__ - the name of the html-body file for your emails
    * __pdfFileName__ - pdf-attachment file name
>NOTE: The last two files must be added to your Google Drive!