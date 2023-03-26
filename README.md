# slack-gpt-url-summary-gas
Google Apps Script for a Slack command that creates a summary of a given URL.

# How to create a summary from large content

The maximum number of tokens for [gpt-3.5-turbo](https://platform.openai.com/docs/models/gpt-3-5) is 4096. The number of tokens is about 3/4 of the number of words in English, which is more than the number of characters in Japanese.


> [What are tokens and how to count them?  OpenAI Help Center](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)

The text on most web pages has more tokens than the maximum allowed by gpt-3.5-turbo. Therefore, to create a summary of the entire text, the total text is divided into chunks, and summaries are created for each chunk. Then, the final summary is created from the combined summaries.

Currently, the script only divides the text by the number of characters and does not analyze it. To ensure to retain the content, some overlapping characters are included in each chunk.

# Setup

## On Slack


* Create a new slash command.
  * Go to the [Slack API](https://api.slack.com/apps) page.
  * **Cretate New App**
    * From scratch:
      * Set **App Name** like "Web summary by ChatGPT".
      * Pick a workspace.
    * Go to **Incoming Webhooks** from the left tab.
      * Add New Webhook to Workspace
        * Select a channel where the summary will be written.
        * Copy the Webhook URL (it should be like `https://hooks.slack.com/services/...`).
    * Go to **Slash Commands** from the left tab.
      * **Create New Command**
        * Command: **web_sum** or anything you like.
        * Request URL: This will be filled later (after GAS deployment), so fill with a dummy URL like **https://example.com**.
        * Short description: **Summarize web page.**.
        * Usage Hint: **URL**.
    * Install the app to your workspace.

Now you can run `/web_sum` in your workspace.

## On Google Apps Script

* Open [Goole Apps Script Home](https://script.google.com/home).
* Create new project.
* Add Library:
  * Push `+` of **Library**, and add following script ID:
    * Cheerio: `1ReeQ6WO8kKNxoaA_O0XEQ589cIrRvEBA9qcWpNqdOP17i47u6N9M5Xh0`
* Make script files named **slack-gas-url**, **params**, and **secrets**.
* Copy the contents of **slack-gas-url.gs**, **params.gs** and **secrets.gs** in this repository to your script files.
* Edit **params.gs**
  * Set **jp** or **en** for the `lang`.
  * You may want to change the `system` or answer words (in `preReplyWords` and `replyPrefix`) in the script.
  * About `chunkLength` and `overlap`:
    * `chunkLength` should be small enough to fit within the max token limit (4096) of the [gpt-3.5-turbo](https://platform.openai.com/docs/models/gpt-3-5).
      * The total token size will be calculated from the system words, chunk + answer (summary).
      * It could be smaller than the number of characters in English. On the other hand, it could be larger than the number of characters in Japanese.
    * The text is not analyzed and is only separated by the number of characters. Therefore, a larger overlap is safer to maintain enough information, but it will require more iterations to ask ChatGPT (which means more cost and more time).
* Edit **secrets.gs**
  * Get your Open AI API key from https://platform.openai.com/account/api-keys and set it as `openaiApiKey`.
  * Write `slackWebhook` which is the URL of Incoming Webhook created in the previous step.
* Deploy as Web app.
  * Click on the **Deploy** button on the project page and select **New deployment**.
  * Choose **Web app**.
    * Settings:
      * Description: **Web summary maker**
      * Execute as: **Me (<your gmail ddress>)** # This should be **Me** to chose **Anyone** below.
      * Who has access: **Anyone** # This should be **Anyone** to give access to Slack.
     * Ref: [Create and manage deployments Apps Script Google Developers](https://developers.google.com/apps-script/concepts/deployments)
  * Click **Deploy**
    * You will get a Web app URL. Copy and paste it into the **Request URL** field of the slash command you created in the previous step.

# Usage

In slack, call the command

    /web_sum https://example.com

You will immediately see `preReplyWords`.

After a while, ChatGPT will give a summary of the Web page.

![slack reply](https://github.com/rcmdnk/slack-gpt-url-summary-gas/raw/main/picks/slackreply.png)

Note: The summary will be posted in the channel where you set for the Incoming Webhook, even if you run the command from the other channels.
