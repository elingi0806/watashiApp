import fs from 'fs';

export default defineEventHandler(async () => {
  // Object型の型宣言
  interface responseObj {
    ResultCode: string;
    FileData: any;
  }
  interface fileDataObj {
    webhook: string;
    title: string;
    text: string;
  }
  // 設定ファイルの置き場所
  const filePath: string = 'src/assets/json/webhook_teams.json';
  const response: responseObj = {
    ResultCode: '000000',
    FileData: {},
  };
  const fileData: fileDataObj = {
    webhook: '',
    title: '',
    text: '',
  };
  // ファイルの存在確認
  try {
    fs.statSync(filePath);
  } catch (err) {
    console.error('ReadTeamsSetting ERROR : NOT EXIST FILE', err);
    response.ResultCode = '001001';
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found File',
      data: response,
    });
  }

  try {
    const fileResponse = fs.readFileSync(filePath, 'utf8');
    const fileContent = JSON.parse(fileResponse);
    fileData.webhook = fileContent.webhook;
    fileData.title = fileContent.title;
    fileData.text = fileContent.text;
    response.FileData = fileData;
    console.error('ReadTeamsSetting SUCCESS : ', response);
    return response;
  } catch (err: any) {
    response.ResultCode = '001001';
    response.FileData = err;
    console.error('ReadTeamsSetting ERROR : FILE READ', err);
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found Content',
      data: response,
    });
  }
});
