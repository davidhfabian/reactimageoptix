import fs from 'fs';
import path from 'path';
import { OptimizationResults } from './types';

export function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

export function findImagesRecursively(dir: string, fileList: any[] = []): any[] {
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findImagesRecursively(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
      fileList.push({
        path: filePath,
        name: file,
        directory: dir
      });
    }
  });

  return fileList;
}

export function generateReport(results: OptimizationResults, reportPath: string): void {
  // Report HTML template implementation...
  const report = `<!DOCTYPE html>...`; // Previous HTML template
  fs.writeFileSync(reportPath, report);
}