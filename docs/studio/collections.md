# Studio: Collections Workspace

## List Page — `/studio/collections`

Table with columns:
- Name (linked to editor)
- Slug
- Status (Published/Draft badge)
- Featured (checkmark or dash)
- Display Order
- Product Count
- Created Date

## Editor Page — `/studio/collections/:id` or `/studio/collections/new`

Form fields:
- **Name** — display name
- **Slug** — URL path (auto-generated from name, manually editable)
- **Tagline** — short descriptor shown on homepage
- **Status** — Published / Draft toggle
- **Display Order** — numeric sort position
- **Featured on Homepage** — boolean toggle
- **Description** — short description
- **Editorial Story** — long-form narrative (textarea)
- **Hero Image** — upload to `HOP-films` bucket
- **Hero Video** — upload to `HOP-films` bucket

## Services

| Function | Operation |
|----------|-----------|
| `fetchAllCollections()` | SELECT all, ordered by display_order |
| `fetchCollectionById(id)` | SELECT single by id |
| `createCollection(data)` | INSERT |
| `updateCollection(id, data)` | UPDATE |
| `uploadCollectionFile(collectionId, file, type)` | Upload to `HOP-films`/'{id}/{type}-{timestamp}' + return URL |
| `deleteCollectionFile(url)` | DELETE from storage bucket |

## Hooks

| Hook | Description |
|------|-------------|
| `useCollections()` | List all collections |
| `useCollection(id)` | Single collection by id |
| `useCreateCollection()` | Create mutation |
| `useUpdateCollection()` | Update mutation |
| `useUploadCollectionFile()` | File upload mutation |
| `useDeleteCollectionFile()` | File delete mutation |
