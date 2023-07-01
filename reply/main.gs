/*
  スポットスポンサーの締め切り日を聞かれたら返信する
*/

/* ロガー */
// リクエスト/レスポンス時のログは通常の実行時のようには残らないため、スプレッドシートに書き出す
class SheetLogger {
  constructor(spreadsheetId) {
    this.spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    this.sheet = this.spreadsheet.getActiveSheet();
  }

  // ログを書き出す
  log(message) {
    const timestamp = new Date();
    this.sheet.appendRow([timestamp, message]);
  }
}

/* 初期化 */
let channelAccessToken;
let logger;

function init_() {
  // スクリプトプロパティ
  const scriptProperties = PropertiesService.getScriptProperties();

  /* ロガー */
  // ロガー用のスプレッドシートID
  const logSheetId = scriptProperties.getProperty('log_sheet_id');
  if (logSheetId === null || logSheetId === "") {
    throw new Error("log_sheetd_id not found");
  }
  // 初期化
  logger = new SheetLogger(logSheetId);

  /* スクリプトプロパティから必要な情報を取得する */
  // チャンネルアクセストークン
  channelAccessToken = scriptProperties.getProperty('channel_access_token');
  if (channelAccessToken === null || channelAccessToken === "") {
    error = new Error("channel access token not found");
    logger.log(`Error: ${error.message}`);
    throw error;
  }
}

init_();

// POSTリクエスト時の挙動
function doPost(e) {
  try {
    logger.log(JSON.stringify(e));

    const reqBody = e.postData.contents;
    const reqBodyDecoded = JSON.parse(reqBody);
    for (event of reqBodyDecoded.events) {
      if (event.type === "message") {
        const replyToken = event.replyToken;
        const resp = postReply_(channelAccessToken, replyToken);
        logger.log(`response: ${resp}`);
      }
    }

  } catch (error) {
    logger.log(`Error: ${error.message}`);
    throw error
  }

  return ContentService.createTextOutput('ok');
}

// 返信メッセージを送信する
function postReply_(channelAccessToken, replyToken) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + channelAccessToken,
  };
  const payload = {
    "replyToken": replyToken,
    "messages": [
      {
        "type":"text",
        "text":"Hello, user"
      },
      {
        "type":"text",
        "text":"May I help you?"
      }
    ]
  };

  const options = {
    'method' : 'post',
    'headers': headers,
    'payload' : JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(url, options);
  return response.getContentText();
}
