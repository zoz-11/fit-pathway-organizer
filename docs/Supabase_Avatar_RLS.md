# Supabase Avatar Storage RLS Policy

## Purpose

This document provides the recommended Row Level Security (RLS) policy for managing user avatar/profile picture storage in Supabase. These policies ensure that:

- Users can only upload avatars to their own storage folder
- Users can only update or delete their own avatars
- All users can view public avatars
- Proper security boundaries are maintained for profile pictures

## Prerequisites

- A Supabase project with authentication enabled
- A storage bucket created for avatars (e.g., `avatars`)
- Users authenticated via Supabase Auth

## Step-by-Step Deployment Instructions

### Step 1: Create Storage Bucket

1. Navigate to your Supabase Dashboard
2. Go to **Storage** in the left sidebar
3. Click **New Bucket**
4. Name the bucket `avatars`
5. Set the bucket to **Public** (allows authenticated users to read)
6. Click **Create Bucket**

### Step 2: Apply RLS Policies

1. In the Supabase Dashboard, go to **Storage** > **Policies**
2. Select the `avatars` bucket
3. Click **New Policy**
4. Choose **Create a custom policy**
5. Copy and paste the SQL policies below

### Step 3: Enable RLS (if not already enabled)

RLS should be enabled by default on storage buckets, but you can verify:

```sql
-- Verify RLS is enabled on storage.objects
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'storage' AND tablename = 'objects';
```

## Ready-to-Paste SQL Policies

### Policy 1: Allow users to upload their own avatars

```sql
-- Allow authenticated users to INSERT their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 2: Allow users to update their own avatars

```sql
-- Allow authenticated users to UPDATE their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 3: Allow users to delete their own avatars

```sql
-- Allow authenticated users to DELETE their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 4: Allow public read access to all avatars

```sql
-- Allow anyone to view avatars (public read)
CREATE POLICY "Public users can view all avatars"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'avatars'
);
```

## Expected File Path Structure

With these policies in place, avatar files should be stored with the following path structure:

```
avatars/{user_id}/avatar.jpg
avatars/{user_id}/profile-pic.png
```

For example:

```
avatars/550e8400-e29b-41d4-a716-446655440000/avatar.jpg
```

## Security Notes

### ✅ What These Policies Protect Against

1. **Unauthorized Uploads**: Users cannot upload files to other users' folders
2. **Unauthorized Modifications**: Users cannot modify or delete other users' avatars
3. **Path Traversal**: The `foldername()` function safely extracts the folder preventing directory traversal attacks
4. **Anonymous Uploads**: Only authenticated users can upload avatars

### ⚠️ Important Security Considerations

1. **File Size Limits**: Configure bucket-level file size limits in Supabase Dashboard (recommended: 2-5 MB for avatars)
2. **File Type Validation**: Implement client-side and server-side validation to only allow image types (jpg, png, webp, etc.)
3. **Rate Limiting**: Consider implementing rate limits on avatar uploads to prevent abuse
4. **File Name Sanitization**: Always sanitize file names on the client side before upload
5. **Virus Scanning**: For production applications, consider implementing virus scanning on uploads

### 🔒 Additional Hardening (Optional)

For extra security, you can restrict file types at the policy level:

```sql
-- Example: Restrict to image files only
CREATE POLICY "Users can upload their own avatar (images only)"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  (storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'gif', 'webp')
);
```

## Testing the Policies

### Test Upload

```javascript
// Example: Upload avatar using Supabase JS client
const { data, error } = await supabase.storage
  .from("avatars")
  .upload(`${user.id}/avatar.jpg`, file);

if (error) {
  console.error("Upload failed:", error);
} else {
  console.log("Upload successful:", data);
}
```

### Test Public Access

```javascript
// Get public URL for an avatar
const { data } = supabase.storage
  .from("avatars")
  .getPublicUrl(`${userId}/avatar.jpg`);

console.log("Public URL:", data.publicUrl);
```

## Troubleshooting

### Error: "new row violates row-level security policy"

- **Cause**: User is trying to upload to a path they don't own
- **Solution**: Ensure the upload path starts with the user's ID: `{user_id}/filename`

### Error: "permission denied for table objects"

- **Cause**: RLS policies are not properly configured
- **Solution**: Verify all policies are created and RLS is enabled

### Avatars not visible publicly

- **Cause**: Bucket is set to private or SELECT policy is missing
- **Solution**: Ensure bucket is public and Policy 4 (SELECT) is applied

## Removing Policies (If Needed)

```sql
-- Drop all avatar policies
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public users can view all avatars" ON storage.objects;
```

## References

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

## Version History

- **v1.0** (Initial): Basic RLS policies for avatar storage

---

**Last Updated**: October 2025  
**Maintainer**: FIT Pathway Organizer Team
