"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { LogIn, ClipboardList } from 'lucide-react';

interface SignInProps {
  onSignIn: (email: string) => void;
  onSwitchToSignUp: () => void;
}

export default function SignIn({ onSignIn, onSwitchToSignUp }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onSignIn(email);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center gap-2">
            <ClipboardList className="size-6" aria-hidden="true" />
            <span>Proglog</span>
          </div>
        </div>
      </header>
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)] p-4">
        <Card className="w-full max-w-md hover:shadow-lg transition-shadow">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <LogIn className="size-6" aria-hidden="true" />
              <CardTitle>Welcome to Proglog</CardTitle>
            </div>
            <CardDescription>
              Sign in to track your progress and achieve your goals
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full hover:scale-[1.02] transition-transform">
                Sign In
              </Button>
              <p className="text-center text-muted-foreground">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignUp}
                  className="text-primary hover:underline focus:underline focus:outline-none"
                  aria-label="Switch to sign up page"
                >
                  Sign Up
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}