'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

export default function Login() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onPasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess('Signed in successfully!');
      router.push('/dashboard');
      router.refresh();
    }
  }

  async function onMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`
      }
    });
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Check your email for the magic link!');
    }
    setLoading(false);
  }

  async function signInWithGitHub() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'github', 
      options: { 
        redirectTo: `${location.origin}/auth/callback` 
      }
    });
    
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to World Model Journal</CardTitle>
          <CardDescription>
            Track your beliefs, predictions, and calibrate your worldview
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded text-sm">
              {success}
            </div>
          )}

          {/* Password Login Form */}
          <form onSubmit={onPasswordLogin} className="space-y-3">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in with password'}
            </Button>
          </form>

          {/* Magic Link Option */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button 
            onClick={onMagicLink}
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send magic link instead'}
          </Button>

          {/* GitHub OAuth */}
          <Button 
            onClick={signInWithGitHub} 
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Redirecting...' : 'Continue with GitHub'}
          </Button>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

