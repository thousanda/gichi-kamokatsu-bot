/*
  スポットスポンサーの締め切り日を計算して通知する
*/

// テストに必要なデータを用意する
function init_() {
  // スクリプトプロパティからLINE APIのチャネルアクセストークンを取得する
  const scriptProperties = PropertiesService.getScriptProperties();
  const token = scriptProperties.getProperty('token');
  if (token === null || token === "") {
    console.log("tokenが空です")
    throw new Error("channel access token not found")
  }

  return {
    'token': token
  };
}

/* 正常系 */
// 締め切り日の1週間前
function test1Week() {
  data = init_();

  // とある締め切り日 (2023/4/19) の1週間前を現在とする
  const now = new Date(2023, 3, 12);  // JSの月は0から始まるので 2023/4/12

  // 締め切り日を取得
  const deadline = newDeadlineFromSpecifiedDate(now);
  console.log("今日: ", deadline.getNow());
  console.log("締め切り日: ", deadline.getDate());

  const wasNotified = notify_(deadline, data.token);
  if (!wasNotified) {
    throw new Error('通知されるはずなのにされなかった');
  }
}

// 締め切り日の前日
function testTommorow() {
  data = init_();

  // とある締め切り日 (2023/4/19) の前日を現在とする
  const now = new Date(2023, 3, 18);  // JSの月は0から始まるので 2023/4/18

  // 締め切り日を取得
  const deadline = newDeadlineFromSpecifiedDate(now);
  console.log("今日: ", deadline.getNow());
  console.log("締め切り日: ", deadline.getDate());

  const wasNotified = notify_(deadline, data.token);
  if (!wasNotified) {
    throw new Error('通知されるはずなのにされなかった');
  }
}

// 締め切り日の当日
function testToday() {
  data = init_();

  // とある締め切り日 (2023/4/19) の当日を現在とする
  const now = new Date(2023, 3, 19);  // JSの月は0から始まる

  // 締め切り日を取得
  const deadline = newDeadlineFromSpecifiedDate(now);
  console.log("今日: ", deadline.getNow());
  console.log("締め切り日: ", deadline.getDate());

  const wasNotified = notify_(deadline, data.token);
  if (!wasNotified) {
    throw new Error('通知されるはずなのにされなかった');
  }
}

/* 異常系 */
// 締め切り日の1週間前より前
function test10Days() {
  data = init_();

  // とある締め切り日 (2023/4/19) の10日前を現在とする
  const now = new Date(2023, 3, 9);  // JSの月は0から始まるので 2023/4/9

  // 締め切り日を取得
  const deadline = newDeadlineFromSpecifiedDate(now);
  console.log("今日: ", deadline.getNow());
  console.log("締め切り日: ", deadline.getDate());

  const wasNotified = notify_(deadline, data.token);
  if (wasNotified) {
    throw new Error('通知されないはずなのにされた');
  }
}

// 締め切り日の1週間前より後、前日より前
function test4Days() {
  data = init_();

  // とある締め切り日 (2023/4/19) の4日前を現在とする
  const now = new Date(2023, 3, 15);  // JSの月は0から始まるので 2023/4/15

  // 締め切り日を取得
  const deadline = newDeadlineFromSpecifiedDate(now);
  console.log("今日: ", deadline.getNow());
  console.log("締め切り日: ", deadline.getDate());

  const wasNotified = notify_(deadline, data.token);
  if (wasNotified) {
    throw new Error('通知されないはずなのにされた');
  }
}

// 締め切り日の翌日以降、月が変わる前
function testAfterDeadlineWithinTheMonth() {
  data = init_();

  // とある締め切り日 (2023/4/19) の1日後を現在とする
  const now = new Date(2023, 3, 20);  // JSの月は0から始まるので 2023/4/20

  // 締め切り日を取得
  const deadline = newDeadlineFromSpecifiedDate(now);
  console.log("今日: ", deadline.getNow());
  console.log("締め切り日: ", deadline.getDate());

  const wasNotified = notify_(deadline, data.token);
  if (wasNotified) {
    throw new Error('通知されないはずなのにされた');
  }
}
