import fs from 'fs';

export default defineEventHandler(async (event) => {
  // Object型の型宣言
  interface responseObj {
    ResultCode: string;
  }
  const response: responseObj = {
    ResultCode: '000000',
  };
  // requestのbodyを解読
  const body = await readBody(event);

  // リクエストの読み込み
  const starttime = body.start; // 開始日時
  const endtime = body.end; // 終了日時
  const resttime = JSON.stringify(body.rest); // 休憩時間
  const year_month_day = body.date; // 書き込み日時
  const workalltime = body.alltime; // 就業時間

  const year = year_month_day.substring(0, 4);
  const year_month = year_month_day.substring(0, 6);

  // 設定ファイルの置き場所
  const dirPath: string = `src/assets/csv/${year}`;
  const filePath: string = `src/assets/csv/${year}/${year_month}.csv`;

  // ディレクトリの存在確認
  if (!fs.existsSync(dirPath)) {
    // ディレクトリが存在しなければディレクトリを生成する
    fs.mkdir(dirPath, (err) => {
      if (err) {
        console.error(`${dirPath} -ディレクトリ作成失敗`, err);
        response.ResultCode = '004001';
        throw createError({
          statusCode: 404,
          statusMessage: 'CANNOT CREATE DIRECTORY',
          data: response,
        });
      }
    });
  }

  let csvColums: string[] = [];
  let csvData: string = '';
  // 書き込む新しいデータ
  const newStr = `${year_month_day},${starttime},${endtime},${resttime},${workalltime}`;
  try {
    // ファイルの存在確認
    if (fs.existsSync(filePath)) {
      // すでにファイルが存在すれば読み込む
      const csvTmp = fs.readFileSync(filePath, { encoding: 'utf8' });
      csvColums = csvTmp.split(/\n/); // 改行で区切る
      let targetIndex = csvColums.findIndex((col) =>
        col.includes(year_month_day)
      );
      if (targetIndex >= 0) {
        // すでにデータが存在する場合、新しいデータに書き換える
        csvColums.splice(targetIndex, 1, newStr);
      } else {
        // データが存在しない場合
        csvColums.push(newStr);
      }
    } else {
      // ファイルが存在しない場合
      csvColums.push('date,start,end,rest,alltime');
      csvColums.push(newStr);
    }
    csvData = csvColums.join('\n'); // 配列を改行で区切った文字列に変換
  } catch (err) {
    console.error(`ファイルの書き込み準備失敗`, err);
    response.ResultCode = '004002';
    throw createError({
      statusCode: 404,
      statusMessage: 'CANNOT READ FILE',
      data: response,
    });
  }

  // ファイルに書き込み
  fs.writeFile(filePath, csvData, function (err) {
    if (err) {
      console.error(`ファイルの書き込み失敗`, err);
      response.ResultCode = '004003';
      throw createError({
        statusCode: 404,
        statusMessage: 'CANNOT WRITE FILE',
        data: response,
      });
    }
  });
  return response;
});
