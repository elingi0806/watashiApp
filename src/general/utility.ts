interface responseObj {
  data: object;
  error: object;
  execute: any;
  pending: any;
  refresh: any;
}

/**
 *  APIレスポンスを整形する
 */
function formatResponse(response: responseObj) {
  const tmp = JSON.parse(JSON.stringify(response));
  tmp.data = tmp.data._rawValue;
  return tmp;
}

export default { formatResponse };
