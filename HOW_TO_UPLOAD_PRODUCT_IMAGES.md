# 📸 How to Upload Product Images - Admin Guide

## Method 1: Upload from PC (Recommended)

### Steps:
1. **Login to Admin Panel** (password: `admin123`)
2. Go to **"Manage Catalog"** tab
3. Click **"Add New Medicine"** button
4. Fill in product details
5. In the **"Product Image"** section:
   - Click **"Upload from PC"** button
   - Select image from your computer
   - Image will be automatically prepared
6. Click **"Add Product to Store"**

### What Happens:
- Image is converted to base64 format
- Stored in browser localStorage
- File name is generated from product name
- Image path is set automatically (e.g., `/products/product-name.jpeg`)

### Important Notes:
⚠️ **Current Implementation (Demo Mode):**
- Images are stored in browser's localStorage
- Images persist across sessions
- Works perfectly for testing and development

🚀 **For Production:**
To save images to actual `/public/products/` folder, you need:
1. A backend server (Node.js/Express)
2. File upload endpoint
3. Update `handleImageUpload` to POST to server
4. Server saves file to `/public/products/` directory

## Method 2: Manual Path Entry

If you already have images in `/public/products/` folder:

1. Place image in: `public/products/your-image.jpeg`
2. In admin form, enter: `/products/your-image.jpeg`
3. Submit form

## Method 3: External URL

Use any image URL:
```
https://example.com/image.jpg
```

## Deleting Products

1. Go to **"Manage Catalog"** tab
2. Hover over any product card
3. Click the **red trash icon** (top-right corner)
4. Confirm deletion

## Supported Image Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

## Best Practices
- Use square images (1:1 ratio)
- Recommended size: 800x800px
- Keep file size under 500KB
- Use descriptive filenames

## Current Product Images Location
All product images should be placed in:
```
public/products/
├── LiverBoost.jpeg
├── SlimAura.jpeg
├── TILLA-E-AZAM.jpeg
├── growmax.jpeg
├── jawahri.jpeg
├── zafrani.jpeg
└── [your-new-images.jpeg]
```

## Troubleshooting

**Image not showing?**
1. Check image path is correct: `/products/image.jpeg`
2. Verify image file exists in `public/products/` folder
3. Clear browser cache
4. Check browser console for errors

**Upload not working?**
1. Make sure file is an image (not PDF, etc.)
2. File size should be reasonable (<5MB)
3. Check browser console for errors

---

**Need Help?**
Contact: RafaiShifa Support Team
