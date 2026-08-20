// Resolve a product image: if the path is a local /products/ path that was
// uploaded via the admin panel, the actual image data lives in localStorage
// under the 'product_images' map (base64). Browsers load bundled /products/ files
// normally, but uploaded-only images need this lookup to display everywhere.
export function getProductImageSrc(imageUrl: string): string {
  if (imageUrl.startsWith('/products/')) {
    try {
      const productImages = JSON.parse(localStorage.getItem('product_images') || '{}');
      return productImages[imageUrl] || imageUrl;
    } catch {
      return imageUrl;
    }
  }
  return imageUrl;
}