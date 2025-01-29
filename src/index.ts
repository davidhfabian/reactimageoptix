import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import chalk from 'chalk';
import { Config, OptimizationResults, OptimizationResult } from './types';
import { formatBytes, findImagesRecursively, generateReport } from './utils';

const DEFAULT_CONFIG: Config = {
  searchPaths: [
    './src/assets',
    './src/assets/images',
    './src/img',
    './assets',
    './assets/images',
    './public/images',
    './public/assets',
    './app/assets',
    './resources/images'
  ],
  quality: 80,
  format: 'webp',
  reportPath: './optimization-report.html',
  backupDir: './images-backup'
};

async function optimizeImage(
  imagePath: string,
  filename: string,
  sourceDir: string,
  config: Config,
  results: OptimizationResults
): Promise<void> {
  try {
    // Create backup if enabled
    if (config.backupDir) {
      const backupPath = path.join(config.backupDir, path.relative(process.cwd(), imagePath));
      fs.mkdirSync(path.dirname(backupPath), { recursive: true });
      fs.copyFileSync(imagePath, backupPath);
    }

    const image = sharp(imagePath);
    const metadata = await image.metadata();
    const stats = fs.statSync(imagePath);
    const originalSize = stats.size;

    if (!metadata.width || !metadata.format) {
      throw new Error('Invalid image metadata');
    }

    const imageResult: OptimizationResult = {
      name: filename,
      sourceDirectory: sourceDir,
      originalSize,
      originalDimensions: `${metadata.width}x${metadata.height || '?'}`,
      optimized: {
        size: 0,
        reduction: 0
      }
    };

    // Optimize using WebP internally
    const optimizedBuffer = await image
      .webp({ quality: config.quality })
      .toBuffer();

    // Convert back to original format and save
    await sharp(optimizedBuffer)
      .toFormat(metadata.format)
      .toFile(imagePath + '.tmp');

    // Replace original with optimized version
    fs.renameSync(imagePath + '.tmp', imagePath);
    
    const optimizedStats = fs.statSync(imagePath);
    const optimizedSize = optimizedStats.size;
    const reduction = Number(((originalSize - optimizedSize) / originalSize * 100).toFixed(2));

    imageResult.optimized = {
      size: optimizedSize,
      reduction
    };

    console.log(chalk.green('✓'), path.relative(process.cwd(), imagePath));
    console.log(
      chalk.gray('  Original:'), formatBytes(originalSize),
      chalk.gray('→'), 
      optimizedSize > originalSize ? chalk.red(formatBytes(optimizedSize)) : chalk.green(formatBytes(optimizedSize))
    );
    console.log(
      chalk.gray('  Reducción:'),
      reduction < 0 ? chalk.red(`${reduction}%`) :
      reduction > 50 ? chalk.green(`${reduction}%`) : 
      chalk.yellow(`${reduction}%`),
      '\n'
    );

    results.images.push(imageResult);
    results.totalSizeBefore += originalSize;
    results.totalSizeAfter += optimizedSize;
  } catch (error) {
    console.error(chalk.red('❌'), `Error optimizando ${filename}:`, error);
  }
}

export async function optimize(config: Partial<Config> = {}): Promise<void> {
  const finalConfig: Config = { ...DEFAULT_CONFIG, ...config };
  
  const results: OptimizationResults = {
    totalImages: 0,
    totalSizeBefore: 0,
    totalSizeAfter: 0,
    images: [],
    sourceDirectories: new Set()
  };

  try {
    console.log(chalk.blue('🔍'), 'Buscando imágenes...\n');
    
    const imageFiles: any[] = [];
    finalConfig.searchPaths.forEach(searchPath => {
      if (fs.existsSync(searchPath)) {
        const files = findImagesRecursively(searchPath, []);
        files.forEach(file => {
          imageFiles.push(file);
          results.sourceDirectories.add(file.directory);
        });
      }
    });

    results.totalImages = imageFiles.length;
    
    if (imageFiles.length === 0) {
      console.log(chalk.yellow('⚠️'), 'No se encontraron imágenes en las rutas especificadas');
      return;
    }

    console.log(
      chalk.blue('📁'), `Directorios: ${results.sourceDirectories.size}\n`,
      chalk.blue('🖼️'), `Imágenes: ${imageFiles.length}\n`
    );

    if (finalConfig.backupDir) {
      fs.mkdirSync(finalConfig.backupDir, { recursive: true });
    }

    for (const file of imageFiles) {
      await optimizeImage(
        file.path,
        file.name,
        file.directory,
        finalConfig,
        results
      );
    }

    generateReport(results, finalConfig.reportPath);
    
    const totalReduction = ((results.totalSizeBefore - results.totalSizeAfter) / results.totalSizeBefore * 100).toFixed(2);
    
    console.log(chalk.green('✨'), 'Optimización completada');
    console.log(
      chalk.gray('   Reducción total:'),
      chalk.green(`${totalReduction}%`),
      chalk.gray(`(${formatBytes(results.totalSizeBefore)} → ${formatBytes(results.totalSizeAfter)})`)
    );

    if (finalConfig.backupDir) {
      console.log(chalk.gray('   Backup guardado en:'), finalConfig.backupDir);
    }
    
    console.log(chalk.gray('   Reporte:'), finalConfig.reportPath);

  } catch (error) {
    console.error(chalk.red('❌'), 'Error:', error);
    throw error;
  }
}