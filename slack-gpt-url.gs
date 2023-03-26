function test(){
    slackNotify('test');

}
function doPost(e){
  slackNotify('test');
  const params = JSON.parse(e.postData.getDataAsString());

  if(params.type == "url_verification"){
    return ContentService.createTextOutput(params.challenge);
  }
  return ContentService.createTextOutput("xyz");
}

function doGet(e){
  doPost(e);
}


function extractMainContent(html) {
    const $ = Cheerio.load(html);

    const classPrefix = ['main', 'article', 'body'];
    const classSuffix = ['', '-content', '-main', '-article', '-body', '-content', '-text'];
    let main = '';
    for(let i = 0;i < classPrefix.length; i++){
      for(let j = 0; j < classSuffix.length; j ++){
        const className = classPrefix[i] + classSuffix[j];
        main = $('div[class=' + className + ']');
        if(main != ''){
          Logger.log(className + ' was found.');
          break;
        }
      }
      if(main != '')break;
    }
    if(main == ''){
      main = $('body');
      if(main != ''){
        Logger.log('body was found.');
      }
    }
    if(main == '') {
      main = $;
      Logger.log('Any main content found, use entire HTML.')
    }
    return main.text().replace(/\s\s+/g, ' ').replace(/\n\s*\n/g, '\n').trim();
}

function getSummary(content) {
  const payload = {
    "model": model,
    "messages": [
      {'role': 'system', "content": system},
      {'role': 'user',"content": content}
    ]
  };
  const options = {
    "method": "POST",
    "headers": {
      "Authorization": "Bearer " + openaiApiKey,
      "Content-Type": "application/json"
    },
    "payload": JSON.stringify(payload)
  };
  const response = UrlFetchApp.fetch(openaiUrl, options);
  const result = JSON.parse(response.getContentText());

  return result.choices[0]['message']['content'];
}

function splitString(str, each, overlap) {
  const result = [];
  const length = str.length;
  let i = 0;
  while (i < length - overlap) {
    result.push(str.slice(i, i+each));
    i += each - overlap;
  }
  return result;
}

function generateSummary(url) {
  const html = UrlFetchApp.fetch(url).getContentText();
  const content = splitString(extractMainContent(html), chunkLength, overlap);
  const summary = []
  content.forEach(function(x){
    summary.push(getSummary(x));
  });
  if(summary.length == 1){
    return summary[0];
  }else{
    return getSummary(summary.join(' '));
  }
}

function doPostx(e) {
  slackNotify('test');
  const params = JSON.parse(e.postData.getDataAsString());

  if(params.type == "url_verification"){
    return ContentService.createTextOutput(params.challenge);
  }
      return ContentService.createTextOutput("test");

  if(params.token != slackToken){
    return ContentService.createTextOutput("invalid token");
  }
  if(params.event.subtype && params.event.subtype === 'bot_message') {
    return null;
  }
  const url = params.event.text;

  if(! url.startswith("http")){
    return ContentService.createTextOutput("not a URL");
  }

  slackNotify('test');
  
  //makeTrigger(url);
  //return ContentService.createTextOutput(preReplyWords(url));
}

function makeTrigger(url) {
  const cache = CacheService.getScriptCache();
  cache.put('url', url);
  ScriptApp.newTrigger('execute')
         .timeBased()
         .after(1)
         .create();
}

function slackNotify(message){  
  const payload =
  {
     "username" : slack_username,
     "icon_emoji": slack_icon,
     "text" : message
  };

  var options =
  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : JSON.stringify(payload)
  };
  UrlFetchApp.fetch(slackWebhook, options);
}

function execute(){
  const cache = CacheService.getScriptCache();
  url = cache.get('url');
  const summary = generateSummary(url);
  slackNotify(replyPrefix(url) + summary)
}

