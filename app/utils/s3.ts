import AWS from 'aws-sdk'

export type ImageType = 'ORIGINAL' | 'CROPPED'

export function constructS3ImageKey(
  orgId: string,
  type: ImageType,
  id: string
): string {
  return `${orgId}/${type.toLowerCase()}/${id}`
}

export function getS3Client(): AWS.S3 {
  return new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY || 'minio',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minio123',
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  })
}
