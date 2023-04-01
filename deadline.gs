/*
  翌月の第一火曜日の13日前である、水曜日の23:59が締め切り
*/

// 今日目線で次の締め切りを示すDeadlineを取得する
function newDeadline() {
  return new Deadline(new Date());
}

// 指定された日付目線で次の締め切りを示すDeadlineを取得する
function newDeadlineFromSpecifiedDate(date) {
  return new Deadline(date);
}

class Deadline {
  constructor(today) {
    this.today = today;
    this.date = getDeadline();
  }
  isNDaysLater(n) {
    return areSameDates(this.today, getNDayBeforeDate(this.date, n));
  }
  isToday() {
    return this.isNDaysLater(0);
  }
  getDate() {
    return this.date;
  }
}


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

// 翌々月の第一火曜日を取得する
function getNextNextMonthFirstTuesday() {
  // 今日の日付を取得
  const today = new Date();
  // 翌々月の最初の日付を取得
  const nextNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  // 最初の日付が火曜日でない場合は、火曜日に調整する
  const daysUntilTuesday = (2 - nextNextMonth.getDay() + 7) % 7;
  const firstTuesday = new Date(nextNextMonth.getFullYear(), nextNextMonth.getMonth(), nextNextMonth.getDate() + daysUntilTuesday);
  return firstTuesday;
}

// 日付 (Date型オブジェクト) と日数を受け取り、受け取った日付からその日数を引いた日付を返す
function getNDayBeforeDate(date, n) {
  // 引数の日付からn日引いた日付を取得
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - n);
}

// 翌月の第一火曜日の13日前である、水曜日の23:59が締め切りなので、その日付を返す
// ただし、すでにその日を過ぎていたら次の締め切り日を返す
function getDeadline() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let deadline = getNDayBeforeDate(getNextMonthFirstTuesday(), 13);
  // 今日よりも未来の日付ならこれを返す
  if (today < deadline){
    return deadline;
  }
  // もし今日よりも過去の日付だった場合、次の締め切り日を返さないといけない
  return getNDayBeforeDate(getNextNextMonthFirstTuesday(), 13);
}

// 年月日が一致しているかどうかをチェック
function　areSameDates(date1, date2) {
  return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
}
