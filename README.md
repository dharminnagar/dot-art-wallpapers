# Dot Art Wallpapers

Transform your images into stunning dot art wallpapers optimized for both desktop and mobile devices. This web application uses advanced image processing algorithms to convert your photos into beautiful monochromatic dot patterns, perfect for minimalist wallpapers.

## Features

- **Smart Image Processing**: Converts any image into artistic dot patterns using brightness-based sampling
- **Multi-Device Support**: Generates wallpapers optimized for both laptops (3840×2400) and phones (1080×2340)
- **Drag & Drop Interface**: Simple, intuitive file upload with drag-and-drop support
- **Real-time Preview**: Instant preview of your wallpapers before downloading
- **Intelligent Scaling**: Automatically scales and centers artwork for optimal wallpaper composition
- **Monochrome Aesthetic**: Creates elegant white-on-black dot art perfect for any device

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/dharminnagar/dot-wallpapers.git
cd dot-wallpapers
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

1. **Upload**: Drag and drop or select an image file (PNG/JPG, max 10MB)
2. **Processing**: The app analyzes your image using brightness sampling to create dot patterns
3. **Preview**: See real-time previews of your laptop and phone wallpapers
4. **Download**: Click to download high-resolution wallpapers optimized for your devices

### Image Processing Algorithm

The application uses a sophisticated dot art generation process:

- **Sampling**: Divides the image into a grid and samples pixel brightness
- **Dot Placement**: Places dots with opacity based on average brightness of each grid section
- **Transparency Handling**: Preserves transparency information for better results with transparent images
- **Canvas Rendering**: Uses HTML5 Canvas for high-performance image processing

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS
- **UI Components**: [ShadCN](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## Project Structure

```
src/
├── app/
│   ├── favicon.ico
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout with theme provider
│   └── page.tsx             # Main application page with image processing logic
├── components/
│   ├── ui/                  # Reusable UI components (Button, Card, Input, Label)
│   ├── image-upload.tsx     # Drag & drop file upload component
│   ├── file-upload-05.tsx   # Alternative upload component
│   └── theme-provider.tsx   # Theme context provider
└── lib/
    └── utils.ts             # Utility functions and class name helpers
```

## Features in Detail

### Image Upload

- Drag and drop interface with visual feedback
- File type validation (PNG, JPG)
- File size limit (10MB)
- Real-time file information display

### Wallpaper Generation

- **Laptop Wallpapers**: 3840×2400 resolution
- **Phone Wallpapers**: 1080×2340 resolution
- Black background with centered artwork
- Intelligent padding and scaling

### User Experience

- Responsive design for all screen sizes
- Loading states with animations
- Hover effects for desktop interactions
- Mobile-optimized download buttons
- Clean, minimalist interface

## Configuration

### Supported Image Formats

- PNG (recommended for transparency)
- JPEG/JPG
- Maximum file size: 10MB

### Output Specifications

- **Laptop Wallpaper**: 3840×2400px (suitable for 4K displays)
- **Phone Wallpaper**: 1080×2340px (modern smartphone ratio)
- **Format**: PNG with transparency support
- **Background**: Pure black (#000000)
- **Dots**: White with varying opacity

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Links

- [Live Demo](https://dot-art-wallpapers.vercel.app)
- [GitHub Repository](https://github.com/dharminnagar/dot-art-wallpapers)
- [Report Issues](https://github.com/dharminnagar/dot-art-wallpapers/issues)

---

Made with ❤️ using Next.js and TypeScript
