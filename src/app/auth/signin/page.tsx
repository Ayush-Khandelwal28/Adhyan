'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Brain, Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignIn() {
  const router = useRouter();
  const { status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Sign in attempt:', formData);
    try {
      const response = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });

      console.log('Sign in response:', response);

      if (response?.error) {
        console.error('Sign in failed:', response.error);
        setError(response.error || 'Sign in failed');
      } else if (response?.status === 200) {
        console.log('Sign in successful:', response);
        router.push('/dashboard');
      }
      else {
        console.error('Unexpected response:', response);
        setError('An unexpected error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleSignIn = () => {
  //   console.log('Google sign in clicked');
  //   // This is where you'd integrate with Google OAuth
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header with Logo and Theme Toggle */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-white">
            <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span>Adhyan</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Sign In Card */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-base">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    disabled={isLoading}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-12"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-12 h-12"
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Forgot Password */}
              {/* <div className="text-right">
                <Link 
                  href="#" 
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
                >
                  Forgot your password?
                </Link>
              </div> */}

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Divider */}
            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div> */}

            {/* Google Sign In */}
            {/* <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-12 text-base font-medium"
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button> */}

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}