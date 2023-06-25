import { fromIni } from '@aws-sdk/credential-providers'
import { CostExplorerClient, GetCostAndUsageCommand } from '@aws-sdk/client-cost-explorer'

export default defineEventHandler(async (event) => {
  // Object型の型宣言
  interface responseObj {
    ResultCode: string
    CostData: any
  }
  const response: responseObj = {
    ResultCode: '000000',
    CostData: null,
  }
  // requestのbodyを解読
  const body = await readBody(event)
  // リクエストの読み込み
  const start = body.start // 開始日時
  const end = body.end // 終了日時
  const region = body.region // リージョンの指定
  const profile = body.profile // credidentialのprofile

  // a client can be shared by different commands.
  const client = new CostExplorerClient({
    credentials: fromIni({ profile: profile }),
    region: region,
  })
  const params: any = {
    TimePeriod: {
      Start: start,
      End: end,
    },
    Granularity: 'MONTHLY',
    Metrics: ['BlendedCost'],
  }
  const command = new GetCostAndUsageCommand(params)

  try {
    const data = await client.send(command)
    response.CostData = data
  } catch (err) {
    console.error('ReadAWSCost ERROR :', err)
    response.ResultCode = '005001'
    throw createError({
      statusCode: 404,
      statusMessage: 'CANNOT GET COSTDATA',
      data: err,
    })
  }

  return response
})
