import util from '../utility'
/**
 *  teamsの設定ファイルを呼び出し(内部API呼び出し)
 */
async function ReadTeamsSetting() {
  const response = await useFetch('/api/read-teams-setting')
  const formatResponse = util.formatResponse(response)
  return formatResponse
}
/**
 *  teamsの設定ファイルを呼び出し(内部API呼び出し)
 */
async function WriteTeamsSetting(data: object) {
  const response = await useFetch('/api/write-teams-setting', {
    method: 'POST',
    body: JSON.parse(JSON.stringify(data)),
  })
  const formatResponse = util.formatResponse(response)
  return formatResponse
}
/**
 *  teamsにメッセージ送信(内部API呼び出し)
 */
async function SendTeamsMessage(url: string, data: object) {
  const response = await useFetch('/api/send-teams-message', {
    method: 'POST',
    body: { url: url, data: data },
  })
  const formatResponse = util.formatResponse(response)
  return formatResponse
}
/**
 *  CSVデータの読み込み(内部API呼び出し)
 */
async function ReadWorkTime(date: string) {
  const response = await useFetch('/api/read-worktime', {
    method: 'POST',
    body: { date: date },
  })
  const formatResponse = util.formatResponse(response)
  return formatResponse
}
/**
 *  CSVデータの書き込み(内部API呼び出し)
 */
async function SaveWorkTime(date: string, start: string, end: string, rest: object, alltime: string) {
  const response = await useFetch('/api/save-worktime', {
    method: 'POST',
    body: {
      date: date,
      start: start,
      end: end,
      rest: rest,
      alltime: alltime,
    },
  })
  const formatResponse = util.formatResponse(response)
  return formatResponse
}
/**
 *  AWSからコスト情報を取得(内部API呼び出し)
 */
async function GetAWSCost(profile: string, start: string, end: string, region: string) {
  const response = await useFetch('/api/aws-get-cost', {
    method: 'POST',
    body: {
      profile: profile,
      start: start,
      end: end,
      region: region,
    },
  })
  const formatResponse = util.formatResponse(response)
  return formatResponse
}
/**
 * AWSからS3のバケット一覧を取得
 */
async function GetS3List(profile: string) {
  const response = await useFetch('/api/aws-get-s3-list', {
    method: 'POST',
    body: {
      profile: profile,
    },
  })
  const formatResponse = util.formatResponse(response)
  return formatResponse
}
/**
 *  S3のバケット内のファイル一覧を保存
 */
async function GetS3FileList(profile: string, bucket: string) {
  const response = await useFetch('/api/aws-get-s3-filelist', {
    method: 'POST',
    body: {
      profile: profile,
      bucket: bucket,
    },
  })
  const formatResponse = util.formatResponse(response)
  return formatResponse
}
/**
 *  S3にデータを保存
 */
async function SetFiletoS3(profile: string, bucket: string, key: string, body: string) {
  const response = await useFetch('/api/aws-upload-file-tos3', {
    method: 'POST',
    body: {
      profile: profile,
      bucket: bucket,
      key: key,
      body: body,
    },
  })
  const formatResponse = util.formatResponse(response)
  return formatResponse
}

export default {
  ReadTeamsSetting,
  WriteTeamsSetting,
  SendTeamsMessage,
  ReadWorkTime,
  SaveWorkTime,
  GetAWSCost,
  GetS3List,
  GetS3FileList,
  SetFiletoS3,
}
