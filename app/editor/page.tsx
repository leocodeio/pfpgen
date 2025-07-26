"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, Settings, Palette, Share2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useSession } from "@/lib/auth-client";
import { removeBackground } from "@imgly/background-removal";

interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  sharpening: number;
  blur: number;
  gamma: number;
}

interface FilterPreset {
  name: string;
  label: string;
}

const FILTER_PRESETS: FilterPreset[] = [
  { name: "none", label: "Original" },
  { name: "professional", label: "Professional" },
  { name: "vintage", label: "Vintage" },
  { name: "dramatic", label: "Dramatic" },
  { name: "soft", label: "Soft" },
  { name: "blackwhite", label: "B&W" },
  { name: "warm", label: "Warm" },
  { name: "cool", label: "Cool" },
];

export default function EditorPage() {
  const { data: session } = useSession();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    sharpening: 0,
    blur: 0,
    gamma: 1,
  });

  const [selectedFilter, setSelectedFilter] = useState("none");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setProcessedImage(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleRemoveBackground = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    try {
      const result = await removeBackground(uploadedFile);
      const url = URL.createObjectURL(result);
      setProcessedImage(url);
    } catch (error) {
      console.error("Background removal failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdjustmentChange = (
    key: keyof ImageAdjustments,
    value: number[],
  ) => {
    setAdjustments((prev) => ({
      ...prev,
      [key]: value[0],
    }));
  };

  const handleFilterChange = (filterName: string) => {
    setSelectedFilter(filterName);
  };

  const handleUploadToServer = async () => {
    if (!uploadedFile) return null;

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleProcessImage = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    try {
      const imageUrl = await handleUploadToServer();
      if (!imageUrl) throw new Error("Upload failed");

      const operations = [
        { type: "removeBackground", params: {} },
        { type: "adjustments", params: adjustments },
        { type: "filter", params: { name: selectedFilter } },
        {
          type: "addBackground",
          params: {
            type: "color",
            value: backgroundColor,
          },
        },
      ];

      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
          operations,
        }),
      });

      if (!response.ok) {
        throw new Error("Processing failed");
      }

      const data = await response.json();
      setProcessedImage(data.processedUrl);
    } catch (error) {
      console.error("Processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "pfpgen-processed-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access the editor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">PFPGen Editor</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {session.user.name}
            </span>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
            >
              Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload and Preview Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Image Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!originalImage ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {isDragActive
                        ? "Drop your image here"
                        : "Upload your image"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Drag and drop or click to select • PNG, JPG, WebP • Max
                      10MB
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Original
                      </h3>
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={originalImage}
                          alt="Original"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Processed
                      </h3>
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {processedImage ? (
                          <img
                            src={processedImage}
                            alt="Processed"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {isProcessing
                              ? "Processing..."
                              : "No processed image"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {originalImage && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      onClick={handleRemoveBackground}
                      disabled={isProcessing}
                      variant="outline"
                    >
                      Remove Background
                    </Button>
                    <Button
                      onClick={handleProcessImage}
                      disabled={isProcessing}
                    >
                      Process Image
                    </Button>
                    {processedImage && (
                      <Button onClick={handleDownload} className="ml-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Editing Controls */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Editing Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="background" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="background">
                      <Palette className="mr-1 h-4 w-4" />
                      Background
                    </TabsTrigger>
                    <TabsTrigger value="adjustments">
                      <Settings className="mr-1 h-4 w-4" />
                      Adjust
                    </TabsTrigger>
                    <TabsTrigger value="filters">
                      <Share2 className="mr-1 h-4 w-4" />
                      Filters
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="background" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900 mb-2 block">
                        Background Color
                      </label>
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-full h-10 rounded border"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="adjustments" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900 mb-2 block">
                        Brightness: {adjustments.brightness}
                      </label>
                      <Slider
                        value={[adjustments.brightness]}
                        onValueChange={(value) =>
                          handleAdjustmentChange("brightness", value)
                        }
                        min={-100}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-900 mb-2 block">
                        Contrast: {adjustments.contrast}
                      </label>
                      <Slider
                        value={[adjustments.contrast]}
                        onValueChange={(value) =>
                          handleAdjustmentChange("contrast", value)
                        }
                        min={-100}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-900 mb-2 block">
                        Saturation: {adjustments.saturation}
                      </label>
                      <Slider
                        value={[adjustments.saturation]}
                        onValueChange={(value) =>
                          handleAdjustmentChange("saturation", value)
                        }
                        min={-100}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-900 mb-2 block">
                        Sharpening: {adjustments.sharpening}
                      </label>
                      <Slider
                        value={[adjustments.sharpening]}
                        onValueChange={(value) =>
                          handleAdjustmentChange("sharpening", value)
                        }
                        min={0}
                        max={10}
                        step={0.1}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="filters" className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {FILTER_PRESETS.map((filter) => (
                        <Button
                          key={filter.name}
                          variant={
                            selectedFilter === filter.name
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleFilterChange(filter.name)}
                          className="text-xs"
                        >
                          {filter.label}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
