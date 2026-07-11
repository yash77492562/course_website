import { logger } from '@/lib/utils/logger';
/**
 * Convert R2 direct URLs to backend proxy URLs to avoid CORS issues
 */
export function convertToProxyUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
  
  // Check if this is an R2 URL
  if (url.includes('.r2.cloudflarestorage.com')) {
    try {
      const urlObj = new URL(url);
      // Extract the path (remove leading slash)
      // Format: https://bucket.account.r2.cloudflarestorage.com/path/to/file
      const filePath = urlObj.pathname.substring(1); // Remove leading slash
      
      // Return proxy URL (encode the entire path)
      return `${apiUrl}/api/video/stream/${filePath}`;
    } catch (error) {
      logger.error('Failed to parse R2 URL:', error);
      return url;
    }
  }
  
  // Return original URL if not R2
  return url;
}

/**
 * Convert a record of quality URLs to proxy URLs
 */
export function convertQualityUrlsToProxy(
  qualities: Record<string, string> | undefined
): Record<string, string> | undefined {
  if (!qualities) return undefined;
  
  const proxiedQualities: Record<string, string> = {};
  
  for (const [quality, url] of Object.entries(qualities)) {
    const proxiedUrl = convertToProxyUrl(url);
    if (proxiedUrl) {
      proxiedQualities[quality] = proxiedUrl;
    }
  }
  
  return Object.keys(proxiedQualities).length > 0 ? proxiedQualities : undefined;
}
