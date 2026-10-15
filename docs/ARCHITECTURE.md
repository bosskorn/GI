# KeepPic Architecture

## Product invariant

KeepPic is a backup product first. Local deletion is a separate, explicit user action that is gated by verified backup state.

## Components

### Mobile app
- Media permission + discovery
- Local asset catalog
- Backup queue
- Retry/backoff
- Network/charging policy
- Restore UI
- Safe reclaim UI

### Backup API
- Authentication
- Per-user quotas
- Upload-ticket generation
- Object metadata
- Checksum verification
- Backup state transitions
- Restore authorization

### Object storage
Any S3-compatible provider can sit behind the API contract, for example AWS S3, Cloudflare R2, Tencent COS via a compatible adapter, or another object store.

## State machine

```text
pending
  ↓
uploading
  ├──→ failed → retry → uploading
  ↓
server object verification
  ↓
verified
  ↓
eligible for user-confirmed reclaim
```

Never transition directly from `uploading` to local deletion.

## Data model (planned)

### Asset
- localAssetId
- filename
- mediaType
- localUri
- bytes
- createdAt
- checksum

### BackupObject
- userId
- assetId
- objectKey
- checksum
- bytes
- storageProvider
- verifiedAt
- status

## Security
- TLS in transit
- Private buckets only
- Short-lived signed upload URLs
- Per-user authorization on every object
- No public object URLs
- Do not place cloud credentials in the mobile app
- Future option: client-side encryption before upload

## Reclaim rules

An item is reclaimable only when:

```ts
status === 'verified' && checksum && remoteKey
```

Before deletion, production code should also re-check the server record and require Android's platform confirmation where applicable.

## MVP boundary

The current branch establishes the mobile scaffold and safety model. It does not pretend cloud backup is complete until a real backend and object storage are configured and verified end-to-end.
