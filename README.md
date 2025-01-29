# 🖼️ ReactImageOptix

> Effortlessly optimize all your React project images with a single command! Save bandwidth and boost performance without compromising quality.

ReactImageOptix is your go-to solution for hassle-free image optimization in React and React Native projects. Just run one command and let it handle everything - from optimization to backups and detailed reports.

## ✨ Features

- 🚀 **One-Command Optimization**: Automatically process all images in your project
- 🎯 **Smart Processing**: Maintains original format while reducing file size
- 🔄 **Automatic Backups**: Keep your original files safe
- 📊 **Detailed Reports**: Beautiful HTML reports showing optimization results
- 🛡️ **Type-Safe**: Full TypeScript support
- 📱 **Universal**: Works with both React and React Native projects

## 🚀 Quick Start

```bash
# Install globally
npm install -g reactimageoptix

# Navigate to your project
cd your-react-project

# Run optimization
reactimageoptix
```

That's it! Your images are now optimized for web performance! 🎉

## 🛠️ Advanced Usage

```bash
reactimageoptix [options]

Options:
  -q, --quality <number>   Output quality (1-100)
  -b, --backup <path>      Backup directory path
  -r, --report <path>      Report file path
  --no-backup             Disable backup
  -h, --help              Display help
```

## 💡 Example

```bash
# Basic usage
reactimageoptix

# Custom quality and backup location
reactimageoptix --quality 85 --backup ./backups
```

## Why ReactImageOptix?

- **Save Bandwidth**: Reduce image sizes by up to 70% without visible quality loss
- **Save Time**: No need to manually optimize each image
- **Safe to Use**: Automatic backups ensure you never lose your original files
- **Perfect for CI/CD**: Easily integrate into your build pipeline

## 🎯 Recommendations

- **Image Formats**: 
  - Use JPEG for photographs and complex images with many colors
  - Use PNG for images with transparency or text
  - Use WebP when broad browser support isn't a concern
  
- **Optimal Settings**:
  - For web: Quality 80-85 is usually the sweet spot
  - For mobile: Consider using quality 70-75 to reduce bundle size
  
- **Best Practices**:
  - Run optimization before deployment
  - Keep backups of original images for future needs
  - Use version control to track optimized images
  - Consider different quality settings for development and production

- **Performance Tips**:
  - Implement lazy loading for images below the fold
  - Use appropriate image dimensions for different devices
  - Consider using responsive images with srcset
  
## 📝 License

MIT

---
Made with ❤️ for the React community