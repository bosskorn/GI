import * as MediaLibrary from 'expo-media-library';
import { BackupSummary } from '../types';

const PAGE_SIZE = 200;
const MAX_SCAN = 5000;

export async function scanLibrary(): Promise<BackupSummary> {
  let after: string | undefined;
  let scanned = 0;
  let photos = 0;
  let videos = 0;
  let hasNextPage = true;

  while (hasNextPage && scanned < MAX_SCAN) {
    const page = await MediaLibrary.getAssetsAsync({
      first: PAGE_SIZE,
      after,
      mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
      sortBy: [MediaLibrary.SortBy.creationTime],
    });

    for (const asset of page.assets) {
      if (asset.mediaType === MediaLibrary.MediaType.video) videos += 1;
      else photos += 1;
    }

    scanned += page.assets.length;
    hasNextPage = page.hasNextPage;
    after = page.endCursor;
  }

  return {
    photos,
    videos,
    totalAssets: photos + videos,
    backedUpAssets: 0,
    reclaimableBytes: 0,
  };
}
