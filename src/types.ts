export interface Config {
  searchPaths: string[];
  quality: number;
  format: string;
  reportPath: string;
  backupDir?: string;
}

export interface OptimizationResult {
  name: string;
  sourceDirectory: string;
  originalSize: number;
  originalDimensions: string;
  optimized: {
    size: number;
    reduction: number;
  };
}

export interface OptimizationResults {
  totalImages: number;
  totalSizeBefore: number;
  totalSizeAfter: number;
  images: OptimizationResult[];
  sourceDirectories: Set<string>;
}