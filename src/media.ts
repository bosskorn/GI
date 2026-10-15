import * as MediaLibrary from 'expo-media-library';
import type { LocalMediaItem } from './types';

export async function requestMediaAccess(): Promise<boolean> {
  const result = await MediaLibrary.requestPermissionsAsync(false, ['photo', 'video']);
  return result.granted;
}

export async function scanRecentMedia(limit = 200): Promise<LocalMediaItem[]> {
  const result = await MediaLibrary.getAssetsAsync({
    first: limit,
    mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
    sortBy: [[MediaLibrary.SortBy.creationTime, false]],
  });

  return result.assets.map((asset) => ({
    id: asset.id,
    uri: asset.uri,
    filename: asset.filename,
    kind: asset.mediaType === MediaLibrary.MediaType.video ? 'video' : 'photo',
    width: asset.width,
    height: asset.height,
    createdAt: asset.creationTime,
    durationSeconds: asset.duration || undefined,
    status: 'pending',
  }));
}

export async function deleteBackedUpAssets(assetIds: string[]): Promise<boolean> {
  if (assetIds.length === 0) return true;
  return MediaLibrary.deleteAssetsAsync(assetIds);
}
