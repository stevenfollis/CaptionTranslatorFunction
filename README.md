# Caption Translator Function
## This project translates the language used in a Timed Text Markup Language (TTML) file from English to Spanish utilizing the [Bing Translator API](https://www.microsoft.com/en-us/translator/translatorapi.aspx) and an [Azure Function](https://azure.microsoft.com/en-us/documentation/services/functions/).

Services such as the [Azure Media Indexer](https://azure.microsoft.com/en-us/documentation/articles/media-services-process-content-with-indexer2/) generate TTML files from audio tracks with timestamped phrases such as 

    <p begin="00:00:01.960" end="00:00:03.890">Good morning everyone and welcome</p>
    <p begin="00:00:03.890" end="00:00:08.970">to the data-driven event today. It's great to be in new york</p>
    <p begin="00:00:08.970" end="00:00:13.410">in fact the last time I was in new york</p>

This code is used to power the closed caption feature on video controls, making the content more accessible to all users.   

However, in order to translate these closed captions into a variety of languages we have traditionally had to rely on human typists.  This is time consuming and expensive.  Instead, we can utilize Bing Translate to programmatically translate our content at a fraction of the cost and time.

>   ### TODO:
>   ### Eventually this will be more automated, but for now relies on manual triggering. This is one piece in a larger solution to be developed.

## Configuration
*   Follow the Getting Started [steps over](https://www.microsoft.com/en-us/translator/getstarted.aspx) at the Bing Maps API 
*   Set environmental variables `BING_TRANSLATE_API_CLIENT_ID` and `BING_TRANSLATE_API_CLIENT_SECRET` according to your client_id and client_secret


