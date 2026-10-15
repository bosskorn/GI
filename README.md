# KeepPic

Android-first mobile photo/video backup app focused on one clear promise: **back up originals safely, then help users reclaim device storage.**

## MVP scope

- Request Android media-library permission
- Scan local photos and videos
- Show total asset counts
- Prepare backup queue state model
- Prepare S3-compatible upload API contract
- Require server verification before an asset becomes reclaimable
- Never silently delete local media

## Safety invariant

A local asset must **not** be considered safe to delete unless all conditions are true:

1. Upload completed successfully
2. Server confirms the object exists
3. Checksum/hash matches
4. Backup status is `verified`
5. User explicitly chooses to reclaim space

## Stack

- Expo SDK 57
- React Native 0.86
- TypeScript
- `expo-media-library`
- S3-compatible object storage via a backend-issued upload ticket

## Run locally

```bash
npm install
cp .env.example .env
npm start
```

For Android native development:

```bash
npm run android
```

## Environment

```env
EXPO_PUBLIC_BACKUP_API_URL=https://api.example.com
```

## Planned backup flow

```text
Android Media Library
        ↓
Asset scan + queue
        ↓
Request upload ticket
        ↓
Direct upload to object storage
        ↓
Server verification + checksum
        ↓
status = verified
        ↓
User may reclaim local space
```

## API contract

### `POST /v1/backups/upload-ticket`

Request:

```json
{
  "filename": "IMG_0001.jpg",
  "contentType": "image/jpeg",
  "checksum": "sha256:...",
  "bytes": 1234567
}
```

Response:

```json
{
  "uploadUrl": "https://object-storage/...",
  "objectKey": "users/.../IMG_0001.jpg",
  "headers": {}
}
```

### `POST /v1/backups/confirm`

The backend verifies the object and checksum before returning a verified state.

## Next implementation steps

1. Persist backup queue locally
2. Generate SHA-256 checksums for source files
3. Implement resumable/direct uploads
4. Add Wi-Fi-only and charging-only policies
5. Add real verified-byte calculation
6. Add safe reclaim workflow using Android MediaStore confirmation
7. Add authentication and per-user storage quotas
8. Add restore/download flow

## Product direction

KeepPic should remain simpler than a full photo-management suite. The primary UX is:

> **Backup → verify → reclaim space safely**

AI search, albums, family sharing, and encrypted vault features can be added only after the backup/reclaim core is reliable.
