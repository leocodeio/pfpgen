"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Settings, CreditCard, Download, Calendar } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl: string | null;
  status: string;
  createdAt: string;
  operations: any;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchUserImages();
    }
  }, [session]);

  const fetchUserImages = async () => {
    try {
      const response = await fetch("/api/user/images");
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access your dashboard.
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Link href="/editor">
              <Button>
                <Camera className="mr-2 h-4 w-4" />
                New Image
              </Button>
            </Link>
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
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {session.user.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {session.user.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {session.user.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Plan</span>
                    <Badge variant="secondary">Free</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Credits</span>
                    <span className="text-sm font-medium">5 remaining</span>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/editor" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Camera className="mr-2 h-4 w-4" />
                    Create New Image
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Your Images
              </h2>
              <p className="text-gray-600">
                Manage your processed profile pictures
              </p>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : images.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No images yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start by creating your first professional profile picture
                  </p>
                  <Link href="/editor">
                    <Button>
                      <Camera className="mr-2 h-4 w-4" />
                      Create Your First Image
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <Card
                    key={image.id}
                    className="group hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                        {image.processedUrl ? (
                          <img
                            src={image.processedUrl}
                            alt="Processed image"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={image.originalUrl}
                            alt="Original image"
                            className="w-full h-full object-cover opacity-50"
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={
                              image.status === "COMPLETED"
                                ? "default"
                                : image.status === "PROCESSING"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {image.status}
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(image.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {image.processedUrl && (
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = image.processedUrl!;
                              link.download = `pfpgen-${image.id}.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            <Download className="mr-2 h-3 w-3" />
                            Download
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
