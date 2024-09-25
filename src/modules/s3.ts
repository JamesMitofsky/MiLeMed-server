import dotenv from 'dotenv';
dotenv.config();

import { S3Client } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  //https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-credential-providers/Variable/fromEnv/
  credentials: fromEnv(),
});
