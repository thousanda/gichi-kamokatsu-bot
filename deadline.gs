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
  constructor(now) {
    this.now = now;
    this.date = this.getDeadline_();
  }

  /* 外から呼んでいいメソッドたち */
  // 締め切り日がn日後であるか否かをbooleanで返す
  isNDaysLater(n) {
    return areSameDates_(this.now, this.getNDaysBeforeDate_(this.date, n));
  }

  // 締め切り日が今日であるか否かをbooleanで返す (糖衣構文)
  isToday() {
    return this.isNDaysLater(0);
  }

  // どの日から見た締め切り日なのかをDateインスタンスで返す
  getNow() {
    return this.now;
  }

  // 締め切り日のDateインスタンスを返す
  getDate() {
    return this.date;
  }

  /* 内部でしか使いたくないメソッドたち */
  // 翌月の第一火曜日を取得する
  getNextMonthFirstTuesday_() {
    // 来月の最初の日付を取得
    const nextMonth = new Date(this.now.getFullYear(), this.now.getMonth() + 1, 1);
    // 最初の日付が火曜日でない場合は、火曜日に調整する
    const daysUntilTuesday = (2 - nextMonth.getDay() + 7) % 7;
    const firstTuesday = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextMonth.getDate() + daysUntilTuesday);
    return firstTuesday;
  }

  // 翌々月の第一火曜日を取得する
  getNextNextMonthFirstTuesday_() {
    // 翌々月の最初の日付を取得
    const nextNextMonth = new Date(this.now.getFullYear(), this.now.getMonth() + 2, 1);
    // 最初の日付が火曜日でない場合は、火曜日に調整する
    const daysUntilTuesday = (2 - nextNextMonth.getDay() + 7) % 7;
    const firstTuesday = new Date(nextNextMonth.getFullYear(), nextNextMonth.getMonth(), nextNextMonth.getDate() + daysUntilTuesday);
    return firstTuesday;
  }

  // 日付 (Date型オブジェクト) と日数を受け取り、受け取った日付からその日数を引いた日付を返す
  getNDaysBeforeDate_(date, n) {
    // 引数の日付からn日引いた日付を取得
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - n);
  }

  // 翌月の第一火曜日の13日前である、水曜日の23:59が締め切りなので、その日付を返す
  // ただし、すでにその日を過ぎていたら次の締め切り日を返す
  getDeadline_() {
    const midnightToday = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
    // 翌月の第一火曜日の13日前を取得
    let deadline = this.getNDaysBeforeDate_(this.getNextMonthFirstTuesday_(), 13);
    // 今日と一致、もしくは今日よりも未来の日付ならこれを返す
    if (midnightToday <= deadline){
      return deadline;
    }
    // 上記の日付が今日よりも過去の日付だった場合、次の締め切り日を返さないといけない
    // 翌々月の第一火曜日の13日前
    return this.getNDaysBeforeDate_(this.getNextNextMonthFirstTuesday_(), 13);
  }
}

// 年月日が一致しているかどうかをチェック
function　areSameDates_(date1, date2) {
  return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
}
