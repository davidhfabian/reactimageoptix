# ReactImageOptix

Smart image optimizer for React and React Native projects with automatic backup and detailed reports.

## Features

- Automatic image optimization
- Maintains original format and quality
- Creates backups automatically
- Generates detailed HTML reports
- Supports common React/React Native project structures
- TypeScript support

## Installation

```bash
npm install -g reactimageoptix
```

## Usage

```bash
reactimageoptix [options]

Options:
  -q, --quality <number>   Output quality (1-100)
  -b, --backup <path>      Backup directory path
  -r, --report <path>      Report file path
  --no-backup             Disable backup
  -h, --help              Display help
```

## Example

```bash
cd your-react-project
reactimageoptix
```

## License

MIT