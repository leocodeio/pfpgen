"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Sparkles, Download, Users, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { useSession, signIn } from "@/lib/auth-client";

export default function Home() {
  const { data: session, isPending } = useSession();

  const handleGetStarted = () => {
    if (session) {
      window.location.href = "/editor";
    } else {
      signIn.social({
        provider: "google",
        callbackURL: "/editor",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Camera className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">PFPGen</span>
        </div>
        <div className="flex items-center space-x-4">
          {session ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user.name}
              </span>
              <Link href="/editor">
                <Button>Go to Editor</Button>
              </Link>
            </div>
          ) : (
            <Button
              onClick={() => signIn.social({ provider: "google" })}
              disabled={isPending}
            >
              Sign In with Google
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6" variant="secondary">
            ✨ AI-Powered Profile Picture Editor
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Professional
            <span className="text-blue-600"> Profile Pictures</span>
            in Seconds
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Remove backgrounds, apply professional filters, and optimize for
            social media platforms. Perfect for LinkedIn, Instagram, Twitter,
            and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isPending}
              className="px-8 py-4 text-lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              <Download className="mr-2 h-5 w-5" />
              View Examples
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            5 free images included • No credit card required
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Professional Profile Pictures
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful AI-driven tools that make professional photo editing
            accessible to everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Sparkles className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>AI Background Removal</CardTitle>
              <CardDescription>
                Advanced AI instantly removes backgrounds with precision,
                perfect for professional headshots.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Professional Filters</CardTitle>
              <CardDescription>
                8 carefully crafted filters including vintage, dramatic, soft,
                and professional presets.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Social Media Templates</CardTitle>
              <CardDescription>
                Pre-optimized templates for LinkedIn, Instagram, Twitter,
                Facebook, and TikTok.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Camera className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Real-time Preview</CardTitle>
              <CardDescription>
                Interactive canvas with live editing. See your changes instantly
                as you make them.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Shape Cropping</CardTitle>
              <CardDescription>
                Crop to perfect circles, squares, hearts, stars, and other
                custom shapes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Download className="h-12 w-12 text-teal-600 mb-4" />
              <CardTitle>Multiple Export Formats</CardTitle>
              <CardDescription>
                Download in PNG, JPG, or WebP formats with quality optimization
                for any platform.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple 4-Step Process
            </h2>
            <p className="text-xl text-gray-600">
              From upload to download in under a minute
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Image</h3>
              <p className="text-gray-600">
                Drag and drop or click to upload your photo
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Remove Background</h3>
              <p className="text-gray-600">
                AI automatically removes the background
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply Edits</h3>
              <p className="text-gray-600">
                Add backgrounds, filters, and adjustments
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Download</h3>
              <p className="text-gray-600">
                Export optimized for your favorite platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Fair Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for trying out PFPGen</CardDescription>
              <div className="text-3xl font-bold text-gray-900">$0</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>5 image
                  processing credits
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  All editing features
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Basic export formats
                </li>
              </ul>
              <Button
                className="w-full mt-6"
                variant="outline"
                onClick={handleGetStarted}
                disabled={isPending}
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-500 relative">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              Most Popular
            </Badge>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>
                For professionals and frequent users
              </CardDescription>
              <div className="text-3xl font-bold text-gray-900">
                $9.99<span className="text-lg text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Unlimited image processing
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  All editing features
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  All export formats
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Priority processing
                </li>
              </ul>
              <Button className="w-full mt-6">Upgrade to Pro</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Camera className="h-6 w-6" />
              <span className="text-xl font-bold">PFPGen</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/support" className="text-gray-400 hover:text-white">
                Support
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>
              &copy; 2024 PFPGen. All rights reserved. Built with ❤️ for
              professional profile picture creation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
