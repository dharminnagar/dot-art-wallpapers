"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Download, Image as ImageIcon } from "lucide-react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
  const [pixelatedImageUrl, setPixelatedImageUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setOriginalImageUrl(imageUrl);
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

        // Create a temporary canvas to get image data
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;

        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        tempCtx.drawImage(img, 0, 0);

        // Get image data for analysis
        const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        // Settings for dot art
        const dotSize = 20; // Increased spacing between dots
        const fontSize = 28; // Much larger font size for bigger dots
        const dotChar = "●"; // Larger filled circle character instead of bullet

        // Calculate output dimensions maintaining aspect ratio
        const cols = Math.ceil(img.width / dotSize);
        const rows = Math.ceil(img.height / dotSize);
        const outputWidth = cols * dotSize;
        const outputHeight = rows * dotSize; // Use dotSize for height too

        // Set canvas size
        canvas.width = outputWidth;
        canvas.height = outputHeight;

        // Set canvas style for text rendering
        ctx.fillStyle = "#000000"; // Black background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Process image in blocks and convert to dot art
        for (let y = 0; y < img.height; y += dotSize) {
          for (let x = 0; x < img.width; x += dotSize) {
            // Sample pixels in current block
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
              const dotY = (y / dotSize) * dotSize + dotSize / 2; // Use dotSize instead of fontSize

              ctx.fillText(dotChar, dotX, dotY);
            }
          }
        }

        setPixelatedImageUrl(canvas.toDataURL());
        setIsProcessing(false);
      };

      img.src = imageUrl;
    } catch (error) {
      console.error("Error processing image:", error);
      setIsProcessing(false);
    }
  };

  const generateWallpaper = (width: number, height: number) => {
    if (!pixelatedImageUrl) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    // Fill with black background
    if (ctx) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const img = new window.Image();
      img.onload = () => {
        // Calculate centered position with padding
        const padding = width < height ? 100 : 200; // More padding for mobile
        const maxWidth = width - padding * 2;
        const maxHeight = height - padding * 2;

        // Scale down to make image smaller - different sizes for laptop vs mobile
        const isLaptop = width > height; // Laptop wallpapers are wider than tall
        const scaleRatio = isLaptop ? 0.4 : 0.3; // 40% for laptop, 30% for mobile
        let drawWidth = img.width * scaleRatio;
        let drawHeight = img.height * scaleRatio;

        // Then scale down further if still too large for the space
        const scaleX = maxWidth / drawWidth;
        const scaleY = maxHeight / drawHeight;
        const scale = Math.min(scaleX, scaleY, 1); // Don't scale up

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Dot Art Wallpaper Generator
          </h1>
          <p className="text-muted-foreground">
            Transform your images into dot art wallpapers
          </p>
        </div>

        {/* Upload Section */}
        {!selectedFile && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Your Image</CardTitle>
              <CardDescription>
                Upload a PNG or JPG image (transparent images preferred). Max
                file size: 10MB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg mb-2">Drag and drop your image here</p>
                <p className="text-muted-foreground mb-4">or click to browse</p>
                <Button variant="outline">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </CardContent>
          </Card>
        )}

        {/* Processing & Preview Section */}
        {selectedFile && (
          <div className="space-y-6">
            {/* File Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setOriginalImageUrl("");
                      setPixelatedImageUrl("");
                      setIsProcessing(false);
                    }}>
                    Choose Different Image
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Image Preview */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Original</CardTitle>
                </CardHeader>
                <CardContent>
                  {originalImageUrl && (
                    // Using img element for blob URLs which can't be optimized by Next.js Image
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={originalImageUrl}
                      alt="Original"
                      className="w-full h-auto max-h-64 object-contain rounded-lg border"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Dot Art */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dot Art</CardTitle>
                </CardHeader>
                <CardContent>
                  {isProcessing ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">
                          Converting to dot art...
                        </p>
                      </div>
                    </div>
                  ) : pixelatedImageUrl ? (
                    // Using img element for blob URLs which can't be optimized by Next.js Image
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pixelatedImageUrl}
                      alt="Dot Art"
                      className="w-full h-auto max-h-64 object-contain rounded-lg border"
                    />
                  ) : null}
                </CardContent>
              </Card>
            </div>

            {/* Download Section */}
            {pixelatedImageUrl && !isProcessing && (
              <Card>
                <CardHeader>
                  <CardTitle>Download Wallpapers</CardTitle>
                  <CardDescription>
                    Your dot art will be centered on a black background
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Button
                      onClick={() => generateWallpaper(3840, 2400)}
                      className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Laptop Wallpaper (3840x2400)
                    </Button>
                    <Button
                      onClick={() => generateWallpaper(1080, 2340)}
                      variant="outline"
                      className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Phone Wallpaper (1080x2340)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
