import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useRef } from "react";

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export default function ImageUpload({
  onFileSelect,
  selectedFile,
  onClear,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="sm:mx-auto sm:max-w-lg flex items-center justify-center p-6 w-full max-w-lg">
      <div className="w-full">
        {!selectedFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-4 flex justify-center space-x-4 rounded-md border border-dashed border-input px-6 py-10 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}>
            <div className="sm:flex sm:items-center sm:gap-x-3">
              <Upload
                className="mx-auto h-8 w-8 text-muted-foreground sm:mx-0 sm:h-6 sm:w-6"
                aria-hidden={true}
              />
              <div className="mt-4 flex text-sm leading-6 text-foreground sm:mt-0">
                <p>Drag and drop or</p>
                <Label
                  htmlFor="image-upload"
                  className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary hover:underline hover:underline-offset-4">
                  <span>choose file</span>
                  <input
                    ref={fileInputRef}
                    id="image-upload"
                    name="image-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </Label>
                <p className="pl-1">to upload</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative mt-4 rounded-lg bg-muted p-3">
            <div className="absolute right-1 top-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="rounded-sm p-2 text-muted-foreground hover:text-foreground"
                aria-label="Remove">
                <X className="size-4 shrink-0" aria-hidden={true} />
              </Button>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background shadow-sm ring-1 ring-inset ring-input">
                <ImageIcon
                  className="size-5 text-foreground"
                  aria-hidden={true}
                />
              </span>
              <div className="w-full">
                <p className="text-xs font-medium text-foreground">
                  {selectedFile.name}
                </p>
                <p className="mt-0.5 flex justify-between text-xs text-muted-foreground">
                  <span>
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                  <span>Ready to process</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="mt-2 flex items-center justify-between text-xs leading-5 text-muted-foreground">
          Max size: 10 MB. Accepted: PNG, JPG (transparent images preferred).
        </p>
      </div>
    </div>
  );
}
