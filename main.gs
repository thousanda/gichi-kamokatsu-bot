/*
  翌月の第一火曜日の13日前である、水曜日の23:59が締め切り
*/

function main() {
  const message = "今日の23:59がスポットスポンサーの締切日だよ！🦆"

  // スクリプトプロパティからLINE APIのチャネルアクセストークンを取得する
  const scriptProperties = PropertiesService.getScriptProperties();
  const token = scriptProperties.getProperty('token');
  if (token === null || token === "") {
    console.log("tokenが空です")
    throw new Error("channel access token not found")
  }

  // デバッグログ
  const nextMonthFirstTuesday = getNextMonthFirstTuesday();
  console.log("nextMonthFirstTuesday: ", nextMonthFirstTuesday);
  console.log("13日前: ", getNDayBeforeDate(nextMonthFirstTuesday, 13));
  console.log("締め切り: ", getDeadline());
  console.log("今日は締め切り日？: ", isDeadline());

  // 今日が締め切り日なら通知する
  if (isDeadline()) {
  // if (true) {  // テスト用の必ず通す条件
    console.log("通知開始します");
    const resp = sendLineBroadcast(message, token);
    console.log(resp);
  }
}

/* 締め切り日を取得するための補助関数たち */
// 翌月の第一火曜日を取得する
function getNextMonthFirstTuesday() {
  // 今日の日付を取得
  const today = new Date();
  // 来月の最初の日付を取得
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  // 最初の日付が火曜日でない場合は、火曜日に調整する
  const daysUntilTuesday = (2 - nextMonth.getDay() + 7) % 7;
  const firstTuesday = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextMonth.getDate() + daysUntilTuesday);
  return firstTuesday;
}

// 日付 (Date型オブジェクト) と日数を受け取り、受け取った日付からその日数を引いた日付を返す
function getNDayBeforeDate(date, n) {
  // 引数の日付からn日引いた日付を取得
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - n);
}

// 翌月の第一火曜日の13日前である、水曜日の23:59が締め切りなので、その日付を返す
function getDeadline() {
  const nextMonthFirstTuesday = getNextMonthFirstTuesday();
  return getNDayBeforeDate(nextMonthFirstTuesday, 13);
}

// 年月日が一致しているかどうかをチェック
function　areSameDate(date1, date2) {
  return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
}

// 今日が締め切り日か否かを返す
function isDeadline() {
  const today = new Date();
  //const today = new Date('2023-03-22T00:00:00');  // テスト用の日付
  console.log(today);
  const deadline = getDeadline();
  return areSameDate(today, deadline);
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
