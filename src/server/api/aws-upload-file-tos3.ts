import { fromIni } from '@aws-sdk/credential-providers'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  // Object型の型宣言
  interface responseObj {
    ResultCode: string
    Data: any
  }
  const response: responseObj = {
    ResultCode: '000000',
    Data: null,
  }

  // requestのbodyを解読
  const request = await readBody(event)
  // リクエストの読み込み
  const bucket = request.bucket // バケット名
  const key = request.key // キー名
  const content = request.body // ファイルの中身
  const profile = request.profile // credidentialのprofile

  const client = new S3Client({
    credentials: fromIni({ profile: profile }),
  })
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: content,
  })

  try {
    const data = await client.send(command)
    response.Data = data
  } catch (err) {
    console.error('SetFiletoBucket ERROR :', err)
    response.ResultCode = '007001'
    throw createError({
      statusCode: 404,
      statusMessage: 'CANNOT SET Data TO S3 ',
      data: err,
    })
  }

  return response
})
