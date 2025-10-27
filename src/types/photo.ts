export interface Photo {
  id: string;
  uri: string;
  filename: string;
  width: number;
  height: number;
  creationTime: number;
  modificationTime: number;
  duration: number;
  mediaType: "photo" | "video";
  mediaSubtypes?: string[];
  fileSize?: number; // File size in bytes
}

export interface PhotoStats {
  totalPhotos: number;
  reviewedPhotos: number;
  photosToKeep: number;
  photosToDelete: number;
  estimatedSpaceFreed: number; // in bytes
}
