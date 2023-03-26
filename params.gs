const lang = 'jp'; // 'en';

const chunkLength = 3000;
const overlap = 100;
const openaiUrl = "https://api.openai.com/v1/chat/completions";
const model = "gpt-3.5-turbo";
const slack_username = "gpt";
const slack_icon = ":memo:";

let system = "You are the sophisticated editor. Read user's sentences and summarize them. Provide a summary in English in three sentences using bullet points.";
if(lang == 'jp') {
  system = "あなたは優れた日本人編集者です。userの文章を読んで日本語で要約してください。要約は3文で箇条書きで答えてください。";
}

function preReplyWords(url){
  if(lang == 'jp'){
    return url + " を要約しています。しばらくお待ち下さい。";
  }else{
    return "Summarizing " + url + ". Please wait for a little while...";
  }
}

function replyPrefix(url) {
  if(lang == 'jp'){
    return url + " の要約です。\n";
  }else{
    return "Summary of " + url + ":\n";
  }
}



