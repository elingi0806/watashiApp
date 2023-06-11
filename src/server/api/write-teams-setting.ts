import fs from 'fs';

export default defineEventHandler(async (event) => {
  // Object型の型宣言
  interface responseObj {
    ResultCode: string;
  }
  // 設定ファイルの置き場所
  const filePath: string = 'src/assets/json/webhook_teams.json';
  const response: responseObj = {
    ResultCode: '000000',
  };
  // requestのbodyを解読
  const body = await readBody(event);
  try {
    fs.writeFileSync(filePath, JSON.stringify(body, null, '    '));
    return response;
  } catch (err) {
    console.error('WriteTeamsSetting ERROR : CANNOT WRITE FILE', err);
    response.ResultCode = '001003';
    throw createError({
      statusCode: 404,
      statusMessage: 'Cannot Write File',
      data: response,
    });
  }
});
