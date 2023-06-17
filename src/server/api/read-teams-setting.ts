import fs from 'fs';

export default defineEventHandler(async () => {
  // Object型の型宣言
  interface responseObj {
    ResultCode: string;
    FileData: any;
  }
  interface fileDataObj {
    webhook: string;
    start_title: string;
    start_text: string;
    end_title: string;
    end_text: string;
  }
  // 設定ファイルの置き場所
  const filePath: string = 'src/assets/json/webhook_teams.json';
  const response: responseObj = {
    ResultCode: '000000',
    FileData: {},
  };
  const fileData: fileDataObj = {
    webhook: '',
    start_title: '',
    start_text: '',
    end_title: '',
    end_text: '',
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
    fileData.start_title = fileContent.start_title;
    fileData.start_text = fileContent.start_text;
    fileData.end_title = fileContent.end_title;
    fileData.end_text = fileContent.end_text;
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
