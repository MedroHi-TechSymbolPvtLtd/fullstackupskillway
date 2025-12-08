# Short Course Archived Status Fix

## Issue
The frontend was trying to create a short course with `status: 'archived'`, but the backend validation only accepted `'draft'` or `'published'`, causing a validation error.

## Error Message
```
"status: Invalid enum value. Expected 'draft' | 'published', received 'archived'"
```

## Solution Applied

### 1. Updated Prisma Schema
**File:** `prisma/schema.prisma`

Added `archived` to the `ContentStatus` enum:

```prisma
enum ContentStatus {
  draft
  published
  archived  // ✅ Added
}
```

### 2. Updated Validation Schema
**File:** `src/validators/cms.ts`

Updated `commonContentSchema` to accept `'archived'`:

```typescript
status: z.enum(['draft', 'published', 'archived']).default('draft'),
```

Also updated `studyAbroadSchema` to support `'archived'`:

```typescript
status: z.enum(['draft', 'published', 'archived']).default('draft'),
```

## Next Steps

### 1. Create and Run Database Migration

You need to create a migration to update the database schema:

```bash
npx prisma migrate dev --name add_archived_status_to_content
```

This will:
- Create a migration file
- Update the database schema
- Regenerate Prisma Client

### 2. Restart the Server

After running the migration, restart your backend server to use the updated Prisma Client.

### 3. Test

Try creating a short course with `status: 'archived'` again. It should now work!

## Affected Content Types

The `archived` status is now available for all content types that use `ContentStatus`:
- ✅ Blogs
- ✅ Videos
- ✅ Courses
- ✅ Ebooks
- ✅ Short Courses
- ✅ Certified Courses
- ✅ Study Abroad

## Status Values

Now all CMS content types support three status values:
- `draft` - Content is saved but not visible
- `published` - Content is live and visible
- `archived` - Content is archived (hidden from public view)

---

**Fixed:** January 15, 2025



