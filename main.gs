/*
  スポットスポンサーの締め切り日を計算して通知する
*/

const msg1Week = "1週間後がお便りの締切だよ！🦆\n(現在、スポットスポンサー制度は停止されています)";
const msgTomorrow = "明日がお便りの締切だよ！🦆\n(現在、スポットスポンサー制度は停止されています)";
const msgToday = "今日がお便りの締切だよ！🦆\n(現在、スポットスポンサー制度は停止されています)";

function main() {
  // スクリプトプロパティからLINE APIのチャネルアクセストークンを取得する
  const scriptProperties = PropertiesService.getScriptProperties();
  const token = scriptProperties.getProperty('token');
  if (token === null || token === "") {
    console.log("tokenが空です")
    throw new Error("channel access token not found")
  }

  // 締め切り日を取得
  const deadline = newDeadline();
  console.log("締め切り: ", deadline.getDate());

  // 条件に応じて通知
  notify_(deadline, token)
}

function notify_(deadline, token) {
  // 1週間前、前日、当日に通知する
  if (deadline.isNDaysLater(7)) {
    // 締め切り日は1週間後？
    console.log("1週間後です。通知します");
    const resp = sendLineBroadcast_(msg1Week, deadline.toString(), token);
    console.log(resp);
    return true;
  } else if (deadline.isNDaysLater(1)) {
    //　締め切り日は明日？
    console.log("明日です。通知します")
    const resp = sendLineBroadcast_(msgTomorrow, deadline.toString(), token);
    console.log(resp);
    return true;
  } else if (deadline.isToday()) {
    // 締め切り日は今日？
    console.log("本日です。通知開始します");
    const resp = sendLineBroadcast_(msgToday, deadline.toString(), token);
    console.log(resp);
    return true;
  }

  console.log("通知しません");
  return false
}

function sendLineBroadcast_(msg, deadlineStr, token) {
  const apiUrl = "https://api.line.me/v2/bot/message/broadcast";
  const formUrl = "https://gichi.world/"

  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
    //"X-Line-Retry-Key": "{UUID}"
  };
  const payload = {
    "messages":[
      {
        "type": "text",
        "text": msg
      },
      {
        "type": "text",
        "text": "締切: " + deadlineStr
      },
      {
        "type": "text",
        "text": formUrl
      }
    ]
  };

  const options = {
    "method": "POST",
    "headers": headers,
    "payload": JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(apiUrl, options);
  return response.getContentText();
}
