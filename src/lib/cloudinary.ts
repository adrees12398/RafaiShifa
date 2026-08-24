// Cloudinary image uploads (free tier).
// Setup (one time):
//   1. Create free account at https://cloudinary.com
//   2. Dashboard -> copy your Cloud Name
//   3. Settings -> Upload -> Upload presets -> Add upload preset
//      - Set Signing Mode to "Unsigned"
//      - Copy the preset name
//   4. Put both values below (or as VITE_ env vars)

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'YOUR_UPLOAD_PRESET';

export const isCloudinaryConfigured = (): boolean =>
  CLOUD_NAME !== 'YOUR_CLOUD_NAME' && UPLOAD_PRESET !== 'YOUR_UPLOAD_PRESET';

// Uploads an image and returns its permanent public URL (works on every device).
export async function uploadProductImage(file: File): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary not configured. Set cloud name + upload preset.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudinary upload failed (HTTP ${res.status}): ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.secure_url as string;
}