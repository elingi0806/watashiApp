import util from '../utility';
/**
 *  teamsの設定ファイルを呼び出し(内部API呼び出し)
 */
async function ReadTeamsSetting() {
  const response = await useFetch('/api/read-teams-setting');
  const formatResponse = util.formatResponse(response);
  return formatResponse;
}
/**
 *  teamsの設定ファイルを呼び出し(内部API呼び出し)
 */
async function WriteTeamsSetting(data: object) {
  const response = await useFetch('/api/write-teams-setting', {
    method: 'POST',
    body: JSON.parse(JSON.stringify(data)),
  });
  const formatResponse = util.formatResponse(response);
  return formatResponse;
}
/**
 *  teamsにメッセージ送信(内部API呼び出し)
 */
async function SendTeamsMessage(url: string, data: object) {
  const response = await useFetch('/api/send-teams-message', {
    method: 'POST',
    body: { url: url, data: data },
  });
  const formatResponse = util.formatResponse(response);
  return formatResponse;
}

export default { ReadTeamsSetting, WriteTeamsSetting, SendTeamsMessage };
