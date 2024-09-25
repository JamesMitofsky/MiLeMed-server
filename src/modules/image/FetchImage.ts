import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Resolver, Query } from 'type-graphql';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

@Resolver()
export class FetchImageResolver {
  @Query(() => [String])
  async listImages(): Promise<string[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME!,
        Prefix: 'uploads/', // Adjust this if necessary
      });

      const response = await s3Client.send(command);
      const images = response.Contents
        ? response.Contents.filter(
            (object) =>
              object.Key?.endsWith('.jpg') ||
              object.Key?.endsWith('.png') ||
              object.Key?.endsWith('.jpeg'),
          ) // Add other image types as needed
            .map(
              (object) =>
                `https://${process.env.S3_BUCKET_NAME!}.s3.${process.env.AWS_REGION}.amazonaws.com/${object.Key}`,
            )
        : [];

      return images;
    } catch (error) {
      console.error('Error listing images:', error);
      throw new Error(
        'Failed to list images from the bucket: ' + error.message,
      );
    }
  }
}
