<img src="src/assets/img/icon-128.png" width="64"/>

# Coursera Helper Extension

A Chrome extension designed to enhance your Coursera learning experience with powerful transcript extraction and navigation features.

## Features

### 🎯 Core Functionality

- **Quick Extract**: One-click transcript copying directly next to Coursera's "Save note" button
- **Batch Extract**: Extract transcripts from entire course sections at once
- **Smart Navigation**: Easy course navigation through a convenient sidebar
- **Overlay System**: Clean, responsive modal system for displaying content

### 💡 Key Highlights

- Seamless integration with Coursera's UI
- Automatic markdown formatting for extracted transcripts
- Persistent functionality across page navigation
- Smart caching for improved performance
- Responsive design that works on any screen size

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm start` for development mode or `npm run build` for production
4. Load the extension in Chrome:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build` folder

## Development

### Prerequisites

- Node.js >= 18
- npm or yarn
- Chrome browser

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Project Structure

- `src/modules/` - Core functionality modules
- `src/components/` - React components
- `src/assets/` - Static assets
- `src/utils/` - Helper utilities

## Contributing

We welcome contributions! Whether it's bug fixes, new features, or improvements to documentation, your help is appreciated.

### How to Contribute

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Feature Requests & Issues

Have an idea for a new feature or found a bug? Please open an issue! We're particularly interested in:

- Additional transcript formatting options
- Integration with note-taking apps
- Multiple language support
- Custom export formats
- Search functionality
- Course progress tracking features

## Roadmap

### Upcoming Features

- Enhanced caching strategies
- Custom themes/styling
- Transcript preview before download
- Selective video extraction
- Integration with popular note-taking applications

### Under Consideration

- Offline access to transcripts
- Multiple language support
- Advanced search functionality
- Custom export formats (PDF, DOC)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you find this extension helpful, please consider:

- Starring the repository
- Sharing it with fellow Coursera learners
- Contributing to its development
- Reporting any issues you encounter

---

Built with ❤️ for Coursera learners
