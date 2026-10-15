export type BackupStatus = 'pending' | 'uploading' | 'verified' | 'failed';

export type BackupItem = {
  assetId: string;
  uri: string;
  filename: string;
  mediaType: 'photo' | 'video';
  status: BackupStatus;
  checksum?: string;
  remoteKey?: string;
  bytes?: number;
};

export type BackupSummary = {
  photos: number;
  videos: number;
  totalAssets: number;
  backedUpAssets: number;
  reclaimableBytes: number;
};

export type UploadTicket = {
  uploadUrl: string;
  objectKey: string;
  headers?: Record<string, string>;
};
