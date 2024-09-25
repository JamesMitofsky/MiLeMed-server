import { Upload } from '@aws-sdk/lib-storage';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from '../s3';
import { ListBucketsCommand } from '@aws-sdk/client-s3';

@Resolver()
export class UploadImageResolver {
  @Mutation(() => String)
  async uploadImage(
    @Arg('file', () => GraphQLUpload) file: FileUpload,
  ): Promise<string> {
    const { createReadStream, filename, mimetype } = file;
    console.log('Attempting to upload image:', filename);

    // make the filename websafe
    const safeFilename = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `uploads/${uuidv4()}-${safeFilename}`, // Unique filename
      Body: createReadStream(),
      ContentType: mimetype,
    };

    try {
      // Test connectivity by listing buckets
      const listBucketsCommand = new ListBucketsCommand({});
      await s3Client.send(listBucketsCommand);
      console.log('S3 Client is connected. Buckets are accessible.');

      // Use the Upload class for streaming uploads
      const upload = new Upload({
        client: s3Client,
        params: uploadParams,
      });

      await upload.done(); // Wait for the upload to complete

      // Generate the S3 file URL
      const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
      console.log('Image uploaded successfully:', fileUrl);
      return fileUrl;
    } catch (error) {
      console.error('Error during S3 operation:', error); // Log the detailed error
      throw new Error('Failed to upload image to S3: ' + error.message);
    }
  }
}
