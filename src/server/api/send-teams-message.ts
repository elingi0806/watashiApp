import axios from 'axios';
export default defineEventHandler(async (event) => {
  let response = {
    ResultCode: '000000',
  };
  // requestのbodyを解読
  const body = await readBody(event);
  // ファイルの存在確認
  try {
    await axios.post(body.url, body.data);
    console.log('SendTeamsMessage SUCCESS', response);
  } catch (err) {
    console.error('SendTeamsMessage ERROR', err);
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found File',
      data: { ResultCode: '002001' },
    });
  }
  return response;
});
