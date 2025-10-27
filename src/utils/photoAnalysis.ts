import { Photo } from "../types/photo";
import * as MediaLibrary from "expo-media-library";

/**
 * Photo Analysis & Categorization Utilities
 * Smart detection for screenshots, duplicates, and other categories
 */

// ============================================
// SCREENSHOT DETECTION
// ============================================

export const isScreenshot = (photo: Photo): boolean => {
  if (photo.mediaType !== "photo") return false;

  // Check if mediaSubtypes includes screenshot (iOS 14+)
  if (photo.mediaSubtypes && photo.mediaSubtypes.length > 0) {
    const hasScreenshotSubtype = photo.mediaSubtypes.some(
      (subtype) =>
        subtype.toLowerCase().includes("screenshot") ||
        subtype.toLowerCase().includes("screen")
    );
    if (hasScreenshotSubtype) return true;
  }

  // Check filename patterns common for screenshots
  const screenshotPatterns = [
    /screenshot/i,
    /screen_shot/i,
    /screen-shot/i,
    /screenrecord/i,
    /skjermbilde/i, // Norwegian
    /skjermdump/i,  // Norwegian
    /^IMG_\d{4}\.PNG$/i, // iOS screenshot pattern: IMG_0001.PNG
    /^Screenshot_\d{4}/i, // Android pattern
  ];

  const hasScreenshotFilename = screenshotPatterns.some(pattern =>
    pattern.test(photo.filename)
  );

  if (hasScreenshotFilename) return true;

  // Additional heuristic: Screenshots on iPhone are typically PNG files
  // with specific dimensions matching screen resolutions
  const isPNG = photo.filename.toLowerCase().endsWith('.png');

  if (isPNG) {
    // Common iPhone screenshot dimensions (portrait and landscape)
    const commonScreenshotDimensions = [
      // iPhone 14 Pro Max, 13 Pro Max, 12 Pro Max
      { w: 1290, h: 2796 }, { w: 2796, h: 1290 },
      // iPhone 14 Pro, 13 Pro, 12 Pro
      { w: 1179, h: 2556 }, { w: 2556, h: 1179 },
      // iPhone 14, 13, 12
      { w: 1170, h: 2532 }, { w: 2532, h: 1170 },
      // iPhone 11, XR
      { w: 828, h: 1792 }, { w: 1792, h: 828 },
      // iPhone 11 Pro, X, XS
      { w: 1125, h: 2436 }, { w: 2436, h: 1125 },
      // iPhone 8 Plus, 7 Plus, 6s Plus
      { w: 1242, h: 2208 }, { w: 2208, h: 1242 },
      // iPhone SE, 8, 7, 6s
      { w: 750, h: 1334 }, { w: 1334, h: 750 },
    ];

    // Check if dimensions match common screenshot sizes (with 10px tolerance)
    const matchesDimensions = commonScreenshotDimensions.some(dim => {
      const widthMatch = Math.abs(photo.width - dim.w) <= 10;
      const heightMatch = Math.abs(photo.height - dim.h) <= 10;
      return widthMatch && heightMatch;
    });

    if (matchesDimensions) return true;
  }

  return false;
};

export const findScreenshots = (photos: Photo[]): Photo[] => {
  const screenshots = photos.filter(isScreenshot);
  console.log(`Screenshot detection: Found ${screenshots.length} out of ${photos.length} photos`);

  // Debug: Show first 5 screenshots found
  if (screenshots.length > 0) {
    console.log("First 5 screenshots found:");
    screenshots.slice(0, 5).forEach(s => {
      console.log(`  - ${s.filename} (${s.width}x${s.height})`);
    });
  }

  // Debug: Check some PNG files that weren't detected
  const pngFiles = photos.filter(p => p.filename.toLowerCase().endsWith('.png') && !isScreenshot(p));
  if (pngFiles.length > 0) {
    console.log(`Found ${pngFiles.length} PNG files that are NOT screenshots. First 5:`);
    pngFiles.slice(0, 5).forEach(p => {
      console.log(`  - ${p.filename} (${p.width}x${p.height})`);
    });
  }

  return screenshots;
};

// ============================================
// DUPLICATE DETECTION (Perceptual Hash)
// ============================================

export interface DuplicateGroup {
  bestPhoto: Photo;
  duplicates: Photo[];
  totalSize: number;
}

/**
 * Simple perceptual hash algorithm
 * Returns a hash string that is similar for visually similar images
 */
const calculatePerceptualHash = (photo: Photo): string => {
  // For now, we'll use a simpler approach: group by dimensions and creation time proximity
  // Real pHash would require image processing, which is complex in React Native
  const dimensionHash = `${photo.width}x${photo.height}`;
  const timeHash = Math.floor(photo.creationTime / 1000); // Group within same second
  return `${dimensionHash}_${timeHash}`;
};

/**
 * Find exact duplicates (same dimensions, created within 1 second)
 * This is a simplified version - full pHash would require native modules
 */
export const findDuplicates = (photos: Photo[]): DuplicateGroup[] => {
  const groups = new Map<string, Photo[]>();

  // Group photos by hash
  photos.forEach(photo => {
    if (photo.mediaType === "photo") { // Only check photos, not videos
      const hash = calculatePerceptualHash(photo);
      const existing = groups.get(hash) || [];
      existing.push(photo);
      groups.set(hash, existing);
    }
  });

  // Find groups with 2+ photos (duplicates)
  const duplicateGroups: DuplicateGroup[] = [];

  groups.forEach(groupPhotos => {
    if (groupPhotos.length >= 2) {
      // Sort by fileSize or quality metrics to find best photo
      const sorted = [...groupPhotos].sort((a, b) => {
        // Prefer higher resolution
        const aPixels = a.width * a.height;
        const bPixels = b.width * b.height;
        return bPixels - aPixels;
      });

      const bestPhoto = sorted[0];
      const duplicates = sorted.slice(1);

      duplicateGroups.push({
        bestPhoto,
        duplicates,
        totalSize: duplicates.length * (2 * 1024 * 1024), // Estimate 2MB per duplicate
      });
    }
  });

  return duplicateGroups;
};

// ============================================
// SIMILAR PHOTOS (Burst detection)
// ============================================

export interface SimilarGroup {
  photos: Photo[];
  bestPhoto: Photo;
  category: "burst" | "similar";
}

/**
 * Find burst photos (multiple photos taken within 2 seconds)
 */
export const findBurstPhotos = (photos: Photo[]): SimilarGroup[] => {
  const photosCopy = [...photos].filter(p => p.mediaType === "photo");
  photosCopy.sort((a, b) => a.creationTime - b.creationTime);

  const burstGroups: SimilarGroup[] = [];
  let currentBurst: Photo[] = [];

  for (let i = 0; i < photosCopy.length; i++) {
    const photo = photosCopy[i];
    const nextPhoto = photosCopy[i + 1];

    if (currentBurst.length === 0) {
      currentBurst.push(photo);
    } else {
      const lastPhoto = currentBurst[currentBurst.length - 1];
      const timeDiff = photo.creationTime - lastPhoto.creationTime;

      // If photos are within 2 seconds, add to burst
      if (timeDiff <= 2000) {
        currentBurst.push(photo);
      } else {
        // End of burst - save if 3+ photos
        if (currentBurst.length >= 3) {
          const bestPhoto = currentBurst[Math.floor(currentBurst.length / 2)]; // Pick middle photo
          burstGroups.push({
            photos: currentBurst,
            bestPhoto,
            category: "burst",
          });
        }
        currentBurst = [photo];
      }
    }

    // Handle last burst
    if (!nextPhoto && currentBurst.length >= 3) {
      const bestPhoto = currentBurst[Math.floor(currentBurst.length / 2)];
      burstGroups.push({
        photos: currentBurst,
        bestPhoto,
        category: "burst",
      });
    }
  }

  return burstGroups;
};

// ============================================
// BLURRY PHOTO DETECTION
// ============================================

/**
 * Detect potentially blurry photos
 * Uses heuristics: very small file size relative to dimensions suggests heavy compression/blur
 */
export const isPotentiallyBlurry = (photo: Photo): boolean => {
  if (photo.mediaType !== "photo") return false;

  // Heuristic: If we have fileSize, check if it's suspiciously small for the resolution
  if (photo.fileSize) {
    const pixels = photo.width * photo.height;
    const bytesPerPixel = photo.fileSize / pixels;

    // If less than 0.2 bytes per pixel, likely heavily compressed (blurry or low quality)
    return bytesPerPixel < 0.2;
  }

  return false;
};

// ============================================
// VIDEO DETECTION
// ============================================

export const findVideos = (photos: Photo[]): Photo[] => {
  return photos.filter(p => p.mediaType === "video");
};

export const findLargeVideos = (photos: Photo[], minSizeMB: number = 50): Photo[] => {
  return photos.filter(p => {
    if (p.mediaType !== "video") return false;
    if (!p.fileSize) return false;
    return p.fileSize > minSizeMB * 1024 * 1024;
  });
};

// ============================================
// SELFIE DETECTION
// ============================================

/**
 * Detect selfies (front camera photos)
 * Note: Expo Media Library doesn't expose camera direction,
 * so we use filename heuristics and aspect ratio patterns
 */
export const isPotentialSelfie = (photo: Photo): boolean => {
  if (photo.mediaType !== "photo") return false;

  // Common selfie filename patterns
  const selfiePatterns = [
    /selfie/i,
    /front/i,
    /img_\d{8}_\d{6}/i, // Common front camera pattern
  ];

  const hasSelfieName = selfiePatterns.some(pattern => pattern.test(photo.filename));

  // Selfies are often portrait orientation with specific aspect ratios
  const aspectRatio = photo.width / photo.height;
  const isPortrait = aspectRatio < 1;

  return hasSelfieName || (isPortrait && aspectRatio > 0.6 && aspectRatio < 0.8);
};

// ============================================
// RECENT PHOTOS
// ============================================

export const findRecentPhotos = (photos: Photo[], daysAgo: number = 7): Photo[] => {
  const cutoffTime = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);
  return photos.filter(p => p.creationTime >= cutoffTime);
};

// ============================================
// CATEGORY AGGREGATION
// ============================================

export interface PhotoCategory {
  id: string;
  name: string;
  description: string;
  photos: Photo[];
  icon: string;
  color: string;
  potentialSavings: number; // bytes
}

export const categorizePhotos = (allPhotos: Photo[]): PhotoCategory[] => {
  const categories: PhotoCategory[] = [];

  // Screenshots
  const screenshots = findScreenshots(allPhotos);
  if (screenshots.length > 0) {
    categories.push({
      id: "screenshots",
      name: "Skjermbilder",
      description: `${screenshots.length} skjermbilder funnet`,
      photos: screenshots,
      icon: "phone-portrait-outline",
      color: "#3B82F6", // Blue
      potentialSavings: screenshots.length * 2 * 1024 * 1024, // Estimate 2MB each
    });
  }

  // Duplicates
  const duplicateGroups = findDuplicates(allPhotos);
  const allDuplicates = duplicateGroups.flatMap(g => g.duplicates);
  if (allDuplicates.length > 0) {
    categories.push({
      id: "duplicates",
      name: "Duplikater",
      description: `${duplicateGroups.length} grupper med duplikater`,
      photos: allDuplicates,
      icon: "copy-outline",
      color: "#EF4444", // Red
      potentialSavings: duplicateGroups.reduce((sum, g) => sum + g.totalSize, 0),
    });
  }

  // Burst photos
  const burstGroups = findBurstPhotos(allPhotos);
  const allBurstPhotos = burstGroups.flatMap(g => g.photos.filter(p => p.id !== g.bestPhoto.id));
  if (allBurstPhotos.length > 0) {
    categories.push({
      id: "bursts",
      name: "Burst-bilder",
      description: `${burstGroups.length} burst-serier funnet`,
      photos: allBurstPhotos,
      icon: "camera-outline",
      color: "#8B5CF6", // Purple
      potentialSavings: allBurstPhotos.length * 2 * 1024 * 1024,
    });
  }

  // Videos
  const videos = findVideos(allPhotos);
  if (videos.length > 0) {
    categories.push({
      id: "videos",
      name: "Videoer",
      description: `${videos.length} videoer`,
      photos: videos,
      icon: "videocam-outline",
      color: "#10B981", // Green
      potentialSavings: videos.length * 10 * 1024 * 1024, // Estimate 10MB each
    });
  }

  // Large videos
  const largeVideos = findLargeVideos(allPhotos, 50);
  if (largeVideos.length > 0) {
    categories.push({
      id: "large-videos",
      name: "Store Videoer",
      description: `${largeVideos.length} videoer over 50MB`,
      photos: largeVideos,
      icon: "film-outline",
      color: "#F59E0B", // Orange
      potentialSavings: largeVideos.reduce((sum, v) => sum + (v.fileSize || 100 * 1024 * 1024), 0),
    });
  }

  return categories;
};
