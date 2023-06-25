import { fromIni } from '@aws-sdk/credential-providers'
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  // Object型の型宣言
  interface responseObj {
    ResultCode: string
    Contents: any
  }
  const response: responseObj = {
    ResultCode: '000000',
    Contents: null,
  }

  // requestのbodyを解読
  const body = await readBody(event)
  // リクエストの読み込み
  const bucket = body.bucket //バケットの指定
  const profile = body.profile // credidentialのprofile

  const client = new S3Client({
    credentials: fromIni({ profile: profile }),
  })
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    // The default and maximum number of keys returned is 1000. This limits it to
    // one for demonstration purposes.
    MaxKeys: 100,
  })

  try {
    let isTruncated: boolean = true
    let contents = []

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken }: any = await client.send(command)
      const contentsList = Contents.map((c: any) => c.Key)
      contents.push(...contentsList)
      isTruncated = IsTruncated
      command.input.ContinuationToken = NextContinuationToken
    }
    response.Contents = contents
  } catch (err) {
    console.error('GetS3FileList ERROR :', err)
    response.ResultCode = '007001'
    throw createError({
      statusCode: 404,
      statusMessage: 'CANNOT GET S3 FILE DATA',
      data: err,
    })
  }

  return response
})
