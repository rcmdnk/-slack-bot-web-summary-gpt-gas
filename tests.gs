function testExtractMainContent() {
  Logger.log(extractMainContent('<body><div class="main-article">abc</div></body>') == "abc");
  Logger.log(extractMainContent('<body><div class="article-text">abc<p>xyz</p></div></body>') == "abcxyz");
  Logger.log(extractMainContent('<body><div>abc<p>xyz</p></div><div>zzz</div></body>') == "abcxyzzzz");
  Logger.log(extractMainContent('<p>hoge</p><aaa><div>abc<p>xyz</p></div><div>zzz</div></aaa>') == "hogeabcxyzzzz");
}

function testSlackNotify() {
  slackNotify("Test Test Test");
}

function testExecute() {
const cache = CacheService.getScriptCache();
  cache.put('url', "https://example.com");
  execute();
}

function testCheerio() {
  const html = UrlFetchApp.fetch("https://example.com").getContentText();
  const $ = Cheerio.load(html);
  Logger.log($('h1').text());
  Logger.log($('body').text());
  $('p').each(function(i, elm) {
    Logger.log($(this).text());
});
}