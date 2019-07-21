# agregatoreatRuGoogleScriptsParser
Google scripts .gs-files for parsing information about order owners from the agregatoreat.ru and mailing them your offer.

1. Copy GoogleSheet example:
TODO: add link

2. Create new script project

3. Create script-files and put code into them from [GScript](https://github.com/galavasteg/agregatoreatGoogleScriptsParser/tree/master/GScripts "GScript directory of this repo")

4. Set parameters in [CONFIG.gs](https://github.com/galavasteg/agregatoreatGoogleScriptsParser/blob/master/GScripts/CONFIG.gs "Script configuration"):
    * *authToken* - token from your agregatoreat company account
    * *extSystem* - nine digits from your agregatoreat company account
    * *fromEmailAddress* - email from which will be sended emails with your offer
    * *htmlTemplFileName* - filename of the html-body for yor email-letters
    * *pdfFileName* - filename of pdf-attachment
>Last two files should be added to your Google Drive!