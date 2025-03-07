import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import { minioConfig } from 'src/config/minio.config';
import { Readable } from 'stream';

@Injectable()
export class StorageService implements OnModuleInit {
  private minioClient: Client;
  private readonly bucketName: string;
  private logger = new Logger(StorageService.name);

  constructor() {
    this.minioClient = new Client(minioConfig);
    this.bucketName = minioConfig.bucket;
  }

  private getAudioObjectId(id: string) {
    return `${id}.mp3`;
  }

  async onModuleInit() {
    await this.initializeBucket();
  }

  private async initializeBucket() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName);
      }
    } catch (error) {
      this.logger.error('Error initializing the bucket: ', error);
    }
  }

  async uploadAudio(id: string, audioStream: Readable) {
    await this.minioClient.putObject(
      this.bucketName,
      this.getAudioObjectId(id),
      audioStream,
    );
  }

  async getAudioStream(id: string): Promise<Readable> {
    return await this.minioClient.getObject(
      this.bucketName,
      this.getAudioObjectId(id),
    );
  }

  async checkAudioExists(objectId: string) {
    try {
      await this.minioClient.statObject(this.bucketName, objectId);
      return true;
    } catch {
      return false;
    }
  }
}
