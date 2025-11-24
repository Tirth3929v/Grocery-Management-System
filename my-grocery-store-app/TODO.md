# Fix Profile Photo Upload Issue

## Information Gathered
- ProfilePage.js sends formData with profileImage to /api/auth/update
- authRoutes.js uses multer with destination path.join(__dirname, '../uploads/profiles')
- server.js serves static files from /uploads to backend/uploads
- The profiles folder does not exist in uploads, unlike banners
- The path resolution may be incorrect if relative paths are resolved relative to cwd
- Admin and user both use the same update route

## Plan
- Update authRoutes.js to use absolute path for profile image destination
- Update bannerRoutes.js to use absolute path for consistency
- Ensure ProfilePage updates imagePreview correctly after save
- Verify that admin can access profile upload (same route)

## Dependent Files
- my-grocery-store-app/backend/routes/authRoutes.js
- my-grocery-store-app/backend/routes/bannerRoutes.js
- my-grocery-store-app/frontend/src/components/User/ProfilePage.js

## Followup Steps
- Test profile photo upload for user
- Test profile photo upload for admin (if applicable)
- Verify image displays after refresh
- Check that profiles folder is created in backend/uploads
