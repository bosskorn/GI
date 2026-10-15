import { UploadTicket } from '../types';

const API_URL = process.env.EXPO_PUBLIC_BACKUP_API_URL;

export async function requestUploadTicket(input: {
  filename: string;
  contentType: string;
  checksum: string;
  bytes: number;
}): Promise<UploadTicket> {
  if (!API_URL) throw new Error('EXPO_PUBLIC_BACKUP_API_URL is not configured');

  const response = await fetch(`${API_URL}/v1/backups/upload-ticket`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error(`Upload ticket failed: ${response.status}`);
  return response.json() as Promise<UploadTicket>;
}

export async function confirmUpload(input: {
  objectKey: string;
  checksum: string;
  bytes: number;
}) {
  if (!API_URL) throw new Error('EXPO_PUBLIC_BACKUP_API_URL is not configured');

  const response = await fetch(`${API_URL}/v1/backups/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error(`Upload confirmation failed: ${response.status}`);
  return response.json();
}
