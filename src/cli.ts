#!/usr/bin/env node
import { program } from 'commander';
import { optimize } from './index';

program
  .option('-q, --quality <number>', 'Output quality (1-100)', '80')
  .option('-b, --backup <path>', 'Backup directory path', './images-backup')
  .option('-r, --report <path>', 'Report file path', './optimization-report.html')
  .option('--no-backup', 'Disable backup')
  .parse();

const options = program.opts();

optimize({
  quality: parseInt(options.quality),
  backupDir: options.backup ? options.backup : undefined,
  reportPath: options.report
}).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});