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
  const report = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ReactImageOptix Report</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #7C3AED;
            --primary-light: #8B5CF6;
            --primary-dark: #6D28D9;
            --success: #059669;
            --warning: #D97706;
            --danger: #DC2626;
            --gray-50: #F9FAFB;
            --gray-100: #F3F4F6;
            --gray-200: #E5E7EB;
            --gray-300: #D1D5DB;
            --gray-600: #4B5563;
            --gray-700: #374151;
            --gray-800: #1F2937;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: var(--gray-800);
            background: var(--gray-50);
        }

        .container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
        }

        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .logo {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 1rem;
        }

        .timestamp {
            color: var(--gray-600);
            font-size: 0.875rem;
        }

        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1rem;
            margin-bottom: 3rem;
        }

        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        }

        .stat-title {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--gray-600);
            margin-bottom: 0.5rem;
        }

        .stat-value {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--gray-800);
        }

        .stat-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
            margin-top: 0.5rem;
        }

        .badge-success {
            background: #DCFCE7;
            color: var(--success);
        }

        .directory-section {
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
            margin-bottom: 2rem;
            overflow: hidden;
        }

        .directory-header {
            padding: 1.25rem;
            background: var(--gray-50);
            border-bottom: 1px solid var(--gray-200);
        }

        .directory-path {
            font-family: ui-monospace, monospace;
            font-size: 0.875rem;
            color: var(--gray-600);
            padding: 0.5rem;
            background: var(--gray-100);
            border-radius: 0.375rem;
            word-break: break-all;
        }

        .directory-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            padding: 1.25rem;
            background: white;
        }

        .image-grid {
            display: grid;
            gap: 1rem;
            padding: 1.25rem;
        }

        .image-card {
            display: grid;
            grid-template-columns: 1fr auto;
            padding: 1rem;
            background: var(--gray-50);
            border-radius: 0.5rem;
            gap: 1rem;
        }

        .image-info h4 {
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--gray-700);
        }

        .image-stat {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            color: var(--gray-600);
            padding: 0.25rem 0;
        }

        .reduction-value {
            font-weight: 500;
        }

        .reduction-high {
            color: var(--success);
        }

        .reduction-medium {
            color: var(--warning);
        }

        .reduction-low {
            color: var(--danger);
        }

        @media (max-width: 640px) {
            .image-card {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">ReactImageOptix</div>
            <div class="timestamp">Generated on ${new Date().toLocaleString()}</div>
        </div>

        <div class="summary">
            <div class="stat-card">
                <div class="stat-title">Total Images</div>
                <div class="stat-value">${results.totalImages}</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Original Size</div>
                <div class="stat-value">${formatBytes(results.totalSizeBefore)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Optimized Size</div>
                <div class="stat-value">${formatBytes(results.totalSizeAfter)}</div>
                <div class="stat-badge badge-success">
                    ${((results.totalSizeBefore - results.totalSizeAfter) / results.totalSizeBefore * 100).toFixed(2)}% reduction
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Directories Processed</div>
                <div class="stat-value">${results.sourceDirectories.size}</div>
            </div>
        </div>

        ${Array.from(results.sourceDirectories).map(dir => {
            const dirImages = results.images.filter(img => img.sourceDirectory === dir);
            const dirSizeBefore = dirImages.reduce((acc, img) => acc + img.originalSize, 0);
            const dirSizeAfter = dirImages.reduce((acc, img) => acc + img.optimized.size, 0);
            
            return `
                <div class="directory-section">
                    <div class="directory-header">
                        <div class="directory-path">${path.relative(process.cwd(), dir)}</div>
                    </div>

                    <div class="directory-stats">
                        <div class="stat-card">
                            <div class="stat-title">Images</div>
                            <div class="stat-value">${dirImages.length}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-title">Total Reduction</div>
                            <div class="stat-value">
                                ${((dirSizeBefore - dirSizeAfter) / dirSizeBefore * 100).toFixed(2)}%
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-title">Size</div>
                            <div class="stat-value">
                                ${formatBytes(dirSizeAfter)}
                            </div>
                        </div>
                    </div>

                    <div class="image-grid">
                        ${dirImages.map(image => `
                            <div class="image-card">
                                <div class="image-info">
                                    <h4>${image.name}</h4>
                                    <div class="image-stat">
                                        <span>Original Size</span>
                                        <span>${formatBytes(image.originalSize)}</span>
                                    </div>
                                    <div class="image-stat">
                                        <span>Optimized Size</span>
                                        <span>${formatBytes(image.optimized.size)}</span>
                                    </div>
                                    <div class="image-stat">
                                        <span>Dimensions</span>
                                        <span>${image.originalDimensions}</span>
                                    </div>
                                </div>
                                <div class="reduction-value ${
                                    image.optimized.reduction > 70 ? 'reduction-high' : 
                                    image.optimized.reduction > 40 ? 'reduction-medium' : 
                                    'reduction-low'
                                }">
                                    ${image.optimized.reduction}%
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('')}
    </div>
</body>
</html>`;

  fs.writeFileSync(reportPath, report);
}