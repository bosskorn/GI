import { BackupItem } from '../types';

export function canReclaim(item: BackupItem) {
  return item.status === 'verified' && Boolean(item.checksum) && Boolean(item.remoteKey);
}

export function markUploading(item: BackupItem): BackupItem {
  if (item.status !== 'pending' && item.status !== 'failed') return item;
  return { ...item, status: 'uploading' };
}

export function markVerified(
  item: BackupItem,
  input: { checksum: string; remoteKey: string; bytes: number },
): BackupItem {
  return {
    ...item,
    status: 'verified',
    checksum: input.checksum,
    remoteKey: input.remoteKey,
    bytes: input.bytes,
  };
}

export function markFailed(item: BackupItem): BackupItem {
  return { ...item, status: 'failed' };
}
