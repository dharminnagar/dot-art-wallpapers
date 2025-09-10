"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Github } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pixelatedImageUrl, setPixelatedImageUrl] = useState<string>("");
  const [laptopWallpaperUrl, setLaptopWallpaperUrl] = useState<string>("");
  const [phoneWallpaperUrl, setPhoneWallpaperUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG or JPG)");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    processImage(imageUrl);
  };

  const processImage = async (imageUrl: string) => {
    setIsProcessing(true);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new window.Image();

      img.onload = () => {
        if (!ctx) return;

        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;

        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        tempCtx.drawImage(img, 0, 0);

        const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        const dotSize = 20;
        const fontSize = 28;
        const dotChar = "●";

        // Calculate output dimensions maintaining aspect ratio
        const cols = Math.ceil(img.width / dotSize);
        const rows = Math.ceil(img.height / dotSize);
        const outputWidth = cols * dotSize;
        const outputHeight = rows * dotSize;

        // Set canvas size
        canvas.width = outputWidth;
        canvas.height = outputHeight;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let y = 0; y < img.height; y += dotSize) {
          for (let x = 0; x < img.width; x += dotSize) {
            let totalBrightness = 0;
            let totalAlpha = 0;
            let pixelCount = 0;

            // Check pixels in the current block
            for (
              let blockY = y;
              blockY < Math.min(y + dotSize, img.height);
              blockY++
            ) {
              for (
                let blockX = x;
                blockX < Math.min(x + dotSize, img.width);
                blockX++
              ) {
                const pixelIndex = (blockY * img.width + blockX) * 4;
                const r = data[pixelIndex];
                const g = data[pixelIndex + 1];
                const b = data[pixelIndex + 2];
                const a = data[pixelIndex + 3];

                // Calculate brightness (luminance)
                // The formula `const brightness = r * 0.299 + g * 0.587 + b * 0.114;` calculates the **perceived brightness** (luminance) of a color using the standard RGB to grayscale conversion coefficients.

                // Here's why these specific weights are used:

                // 1. **Human eye sensitivity**: Our eyes are not equally sensitive to all colors:
                //   - **Green (0.587)**: Most sensitive - contributes most to perceived brightness
                //   - **Red (0.299)**: Moderately sensitive
                //   - **Blue (0.114)**: Least sensitive - contributes least to brightness

                // 3. **Better dot placement**: Instead of using simple RGB averaging `(r + g + b) / 3`, this formula gives a more accurate representation of how bright a pixel appears to humans, resulting in better dot art that preserves the visual contrast of the original image.

                // For example, a bright green pixel will correctly appear brighter than a bright blue pixel of the same RGB intensity, which matches how we actually perceive these colors.
                const brightness = r * 0.299 + g * 0.587 + b * 0.114;
                totalBrightness += brightness;
                totalAlpha += a;
                pixelCount++;
              }
            }

            const avgBrightness = totalBrightness / pixelCount;
            const avgAlpha = totalAlpha / pixelCount;

            // Only draw dot if there's some opacity (not transparent)
            if (avgAlpha > 30) {
              // Calculate dot opacity based on brightness and alpha
              const opacity = (avgBrightness / 255) * (avgAlpha / 255);

              // Draw white dot with varying opacity
              ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;

              const dotX = (x / dotSize) * dotSize + dotSize / 2;
              const dotY = (y / dotSize) * dotSize + dotSize / 2;

              ctx.fillText(dotChar, dotX, dotY);
            }
          }
        }

        setPixelatedImageUrl(canvas.toDataURL());

        generateActualWallpapers(canvas.toDataURL());

        setIsProcessing(false);
      };

      img.src = imageUrl;
    } catch (error) {
      console.error("Error processing image:", error);
      setIsProcessing(false);
    }
  };

  const generateActualWallpapers = (dotArtDataUrl: string) => {
    const laptopCanvas = document.createElement("canvas");
    const laptopCtx = laptopCanvas.getContext("2d");

    const laptopWidth = 3840;
    const laptopHeight = 2400;

    laptopCanvas.width = laptopWidth;
    laptopCanvas.height = laptopHeight;

    if (laptopCtx) {
      laptopCtx.fillStyle = "#000000";
      laptopCtx.fillRect(0, 0, laptopWidth, laptopHeight);

      const laptopImg = new window.Image();
      laptopImg.onload = () => {
        const padding = laptopWidth < laptopHeight ? 100 : 200;
        const maxWidth = laptopWidth - padding * 2;
        const maxHeight = laptopHeight - padding * 2;

        const isLaptop = laptopWidth > laptopHeight;
        const scaleRatio = isLaptop ? 0.4 : 0.3;
        let drawWidth = laptopImg.width * scaleRatio;
        let drawHeight = laptopImg.height * scaleRatio;

        const scaleX = maxWidth / drawWidth;
        const scaleY = maxHeight / drawHeight;
        const scale = Math.min(scaleX, scaleY, 1);

        drawWidth = drawWidth * scale;
        drawHeight = drawHeight * scale;

        const x = (laptopWidth - drawWidth) / 2;
        const y = (laptopHeight - drawHeight) / 2;

        laptopCtx.drawImage(laptopImg, x, y, drawWidth, drawHeight);
        setLaptopWallpaperUrl(laptopCanvas.toDataURL());
      };
      laptopImg.src = dotArtDataUrl;
    }

    const phoneCanvas = document.createElement("canvas");
    const phoneCtx = phoneCanvas.getContext("2d");

    const phoneWidth = 1080;
    const phoneHeight = 2340;

    phoneCanvas.width = phoneWidth;
    phoneCanvas.height = phoneHeight;

    if (phoneCtx) {
      phoneCtx.fillStyle = "#000000";
      phoneCtx.fillRect(0, 0, phoneWidth, phoneHeight);

      const phoneImg = new window.Image();
      phoneImg.onload = () => {
        const padding = phoneWidth < phoneHeight ? 100 : 200;
        const maxWidth = phoneWidth - padding * 2;
        const maxHeight = phoneHeight - padding * 2;

        const isLaptop = phoneWidth > phoneHeight;
        const scaleRatio = isLaptop ? 0.4 : 0.3;
        let drawWidth = phoneImg.width * scaleRatio;
        let drawHeight = phoneImg.height * scaleRatio;

        const scaleX = maxWidth / drawWidth;
        const scaleY = maxHeight / drawHeight;
        const scale = Math.min(scaleX, scaleY, 1);

        drawWidth = drawWidth * scale;
        drawHeight = drawHeight * scale;

        const x = (phoneWidth - drawWidth) / 2;
        const y = (phoneHeight - drawHeight) / 2;

        phoneCtx.drawImage(phoneImg, x, y, drawWidth, drawHeight);
        setPhoneWallpaperUrl(phoneCanvas.toDataURL());
      };
      phoneImg.src = dotArtDataUrl;
    }
  };

  const generateWallpaper = (width: number, height: number) => {
    if (!pixelatedImageUrl) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    if (ctx) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const img = new window.Image();
      img.onload = () => {
        // Calculate centered position with padding
        const padding = width < height ? 100 : 200;
        const maxWidth = width - padding * 2;
        const maxHeight = height - padding * 2;

        const isLaptop = width > height; // Laptop wallpapers are wider than tall
        const scaleRatio = isLaptop ? 0.4 : 0.3; // 40% for laptop, 30% for mobile
        let drawWidth = img.width * scaleRatio;
        let drawHeight = img.height * scaleRatio;

        const scaleX = maxWidth / drawWidth;
        const scaleY = maxHeight / drawHeight;
        const scale = Math.min(scaleX, scaleY, 1);

        drawWidth = drawWidth * scale;
        drawHeight = drawHeight * scale;

        const x = (width - drawWidth) / 2;
        const y = (height - drawHeight) / 2;

        ctx.drawImage(img, x, y, drawWidth, drawHeight);

        // Download the result
        const link = document.createElement("a");
        link.download = `dot-art-wallpaper-${width}x${height}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };

      img.src = pixelatedImageUrl;
    }
  };

  return (
    <div className="relative bg-background p-4 overflow-hidden">
      <DotPattern
        glow={true}
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
          "opacity-30",
          "fixed inset-0 w-full h-full"
        )}
      />
      <div className="relative z-10 container mx-auto max-w-4xl min-h-screen">
        {!selectedFile ? (
          /* Centered layout when no image is uploaded */
          <div className="min-h-screen flex flex-col items-center justify-center -mt-4">
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">
                  Transform your Images into Wallpapers
                </h1>
              </div>

              {/* Upload Section */}
              <div className="flex justify-center">
                <ImageUpload
                  onFileSelect={handleFileSelect}
                  selectedFile={null}
                  onClear={() => {
                    setSelectedFile(null);
                    setPixelatedImageUrl("");
                    setLaptopWallpaperUrl("");
                    setPhoneWallpaperUrl("");
                    setIsProcessing(false);
                  }}
                />
              </div>
            </div>

            {/* Footer for initial state */}
            <footer className="mt-16 py-8 border-t border-border/20">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-6">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Made with ❤️ by{" "}
                    </span>
                    <a
                      href="https://x.com/dharminnagar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-5 transition-colors">
                      @dharmin
                    </a>
                  </div>
                  <a
                    href="https://github.com/dharminnagar/dot-art-wallpapers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="View source on GitHub">
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </footer>
          </div>
        ) : (
          /* Normal layout when image is uploaded */
          <div>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">
                Transform your Images into Wallpapers
              </h1>
            </div>

            {/* Processing & Preview Section */}
            <div className="space-y-6">
              {/* Reset Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null);
                    setPixelatedImageUrl("");
                    setLaptopWallpaperUrl("");
                    setPhoneWallpaperUrl("");
                    setIsProcessing(false);
                  }}>
                  Choose Different Image
                </Button>
              </div>

              {/* Wallpaper Preview */}
              <div className="space-y-6">
                <div className="space-y-8">
                  {/* Laptop Wallpaper Preview */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <h4 className="text-lg font-medium">Laptop Wallpaper</h4>
                      <p className="text-sm text-muted-foreground">3840x2400</p>
                    </div>

                    {isProcessing ? (
                      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                          <p className="text-sm text-muted-foreground">
                            Generating preview...
                          </p>
                        </div>
                      </div>
                    ) : laptopWallpaperUrl ? (
                      <div className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={laptopWallpaperUrl}
                          alt="Laptop Wallpaper Preview"
                          className="w-full rounded-lg border shadow-lg transition-all duration-300 group-hover:shadow-xl object-contain h-[500px]"
                        />

                        {/* Hover Download Button - Desktop */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-lg hidden md:flex items-center justify-center">
                          <Button
                            onClick={() => generateWallpaper(3840, 2400)}
                            variant={"outline"}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-105 bg-white/90 hover:bg-white"
                            size="lg">
                            <Download className="w-5 h-5 mr-2" />
                            Download Laptop Wallpaper
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    {/* Mobile Download Button */}
                    {laptopWallpaperUrl && (
                      <Button
                        onClick={() => generateWallpaper(3840, 2400)}
                        className="w-full md:hidden">
                        <Download className="w-4 h-4 mr-2" />
                        Download Laptop Wallpaper
                      </Button>
                    )}
                  </div>

                  {/* Phone Wallpaper Preview */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <h4 className="text-lg font-medium">Phone Wallpaper</h4>
                      <p className="text-sm text-muted-foreground">1080x2340</p>
                    </div>

                    {isProcessing ? (
                      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                          <p className="text-sm text-muted-foreground">
                            Generating preview...
                          </p>
                        </div>
                      </div>
                    ) : phoneWallpaperUrl ? (
                      <div className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={phoneWallpaperUrl}
                          alt="Phone Wallpaper Preview"
                          className="w-full rounded-lg border shadow-lg transition-all duration-300 group-hover:shadow-xl object-contain h-[500px]"
                        />

                        {/* Hover Download Button - Desktop */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-lg hidden md:flex items-center justify-center">
                          <Button
                            onClick={() => generateWallpaper(1080, 2340)}
                            variant="outline"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-105 bg-white/90 hover:bg-white"
                            size="lg">
                            <Download className="w-5 h-5 mr-2" />
                            Download Phone Wallpaper
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    {/* Mobile Download Button */}
                    {phoneWallpaperUrl && (
                      <Button
                        onClick={() => generateWallpaper(1080, 2340)}
                        variant="outline"
                        className="w-full md:hidden">
                        <Download className="w-4 h-4 mr-2" />
                        Download Phone Wallpaper
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {selectedFile && (
          <footer className="mt-16 py-8 border-t border-border/20">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Made with ❤️ by{" "}
                  </span>
                  <a
                    href="https://x.com/dharminnagar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-5 transition-colors">
                    @dharminnagar
                  </a>
                </div>
                <a
                  href="https://github.com/dharminnagar/dot-art-wallpapers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="View source on GitHub">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
