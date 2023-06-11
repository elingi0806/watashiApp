import fs from 'fs';

export default defineEventHandler(async (event) => {
  // Object型の型宣言
  interface responseObj {
    ResultCode: string;
    CSVData: any;
  }
  const response: responseObj = {
    ResultCode: '000000',
    CSVData: [],
  };
  // requestのbodyを解読
  const body = await readBody(event);

  const year_month = body.date;
  const year = year_month.substring(0, 4);

  // 設定ファイルの置き場所
  const filePath: string = `src/assets/csv/${year}/${year_month}.csv`;

  // ファイルの存在確認
  if (!fs.existsSync(filePath)) {
    console.error('ReadCSVData ERROR : NOT EXIST FILE');
    response.ResultCode = '003001';
    throw createError({
      statusCode: 404,
      statusMessage: 'NOT EXIST FILE',
      data: response,
    });
  }

  // ファイルの読み込み
  try {
    const csvTmp = fs.readFileSync(filePath, { encoding: 'utf8' });
    const csvColums = csvTmp.split(/\n/); // 改行で区切る
    const csvColumsArr: any[] = [];
    let csvColumsTitle: any[] = [];
    csvColums.forEach((col, index) => {
      if (index === 0) {
        // 先頭はタイトル
        csvColumsTitle = col.split(',');
      } else {
        // 業務データの読み込み
        let colColum: any[] = [];
        const obj: any = {};
        let jsonStr: String = '';
        let existJsonFlag = false;
        // 休憩時間のデータ読み込み
        const jsonStartIndex = col.indexOf('{');
        const jsonEndIndex = col.indexOf('}');
        if (jsonStartIndex >= 0 && jsonEndIndex >= 0) {
          // 休憩時間のデータが存在しなければ先に抜き出して配列化されないようにする
          jsonStr = col.slice(jsonStartIndex, jsonEndIndex + 1);
          existJsonFlag = true;
        }
        colColum = col.split(',');
        csvColumsTitle.forEach((c, i) => {
          // 3つ目のデータは休憩時間のデータ
          if (i !== 3 || !existJsonFlag) {
            obj[c] = colColum[i];
          } else {
            obj[c] = jsonStr;
          }
        });
        csvColumsArr.push(obj);
      }
    }); // csvデータを配列化
    response.CSVData = csvColumsArr;
    console.log('ReadCSVData SUCCESS : ', csvColumsTitle, csvColumsArr);
    return response;
  } catch (err) {
    console.error('ReadCSVData ERROR : CANNOT READ FILE', err);
    response.ResultCode = '003002';
    throw createError({
      statusCode: 404,
      statusMessage: 'CANNOT READ FILE',
      data: response,
    });
  }
});
