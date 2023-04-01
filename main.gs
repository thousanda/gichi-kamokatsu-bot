/*
  スポットスポンサーの締め切り日を計算して通知する
*/

function main() {
  const msg1Week = "1週間後の23:59がスポットスポンサーの締切日だよ！🦆";
  const msgTomorrow = "明日の23:59がスポットスポンサーの締切日だよ！🦆";
  const msgToday = "今日の23:59がスポットスポンサーの締切日だよ！🦆";

  // スクリプトプロパティからLINE APIのチャネルアクセストークンを取得する
  const scriptProperties = PropertiesService.getScriptProperties();
  const token = scriptProperties.getProperty('token');
  if (token === null || token === "") {
    console.log("tokenが空です")
    throw new Error("channel access token not found")
  }

  // 締め切り日を取得
  const deadline = newDeadline();
  console.log("締め切り日: ", deadline.getDate());
  console.log(deadline.isToday());

  // 1週間前、前日、当日に通知する
  if (deadline.isNDaysLater(7)) {
    // 締め切り日は1週間後？
    console.log("1週間後です。通知します");
    const resp = sendLineBroadcast(msg1Week, token);
    console.log(resp);
  } else if (deadline.isNDaysLater(1)) {
    //　締め切り日は明日？
    console.log("明日です。通知します")
    const resp = sendLineBroadcast(msgTomorrow, token);
    console.log(resp);
  } else if (deadline.isToday()) {
    // 締め切り日は今日？
    console.log("本日です。通知開始します");
    const resp = sendLineBroadcast(msgToday, token);
    console.log(resp);
  } else {
    console.log("通知しません");
  }
}

function sendLineBroadcast(msg, token) {
  const apiUrl = "https://api.line.me/v2/bot/message/broadcast";
  const sponsorUrl = "https://higuchi.world/gichiland-spot-sponsor"

  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
    //"X-Line-Retry-Key": "{UUID}"
  };
  const payload = {
    "messages":[
      {
        "type":"text",
        "text":msg
      },
      {
        "type": "text",
        "text": sponsorUrl
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
