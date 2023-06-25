import { fromIni } from '@aws-sdk/credential-providers'
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  // Object型の型宣言
  interface responseObj {
    ResultCode: string
    Buckets: any
    Owner: any
  }
  const response: responseObj = {
    ResultCode: '000000',
    Buckets: null,
    Owner: null,
  }

  // requestのbodyを解読
  const body = await readBody(event)
  const profile = body.profile // credidentialのprofile

  const client = new S3Client({})
  const command = new ListBucketsCommand({
    credentials: fromIni({ profile: profile }),
  })

  try {
    const { Owner, Buckets } = await client.send(command)
    response.Buckets = Buckets
    response.Owner = Owner
  } catch (err) {
    console.error('GetAWSS3Bucket ERROR :', err)
    response.ResultCode = '006001'
    throw createError({
      statusCode: 404,
      statusMessage: 'CANNOT GET S3 ListData',
      data: err,
    })
  }

  return response
})
