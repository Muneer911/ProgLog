"use client";

import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState('signin');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const handleSignIn = (email: string) => {
    setCurrentUser(email);
    setCurrentView('dashboard');
  };

  const handleSignUp = (email: string) => {
    setCurrentUser(email);
    setCurrentView('dashboard');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentView('signin');
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {currentView === 'signin' && (
        <SignIn
          onSignIn={handleSignIn}
          onSwitchToSignUp={() => setCurrentView('signup')}
        />
      )}
      {currentView === 'signup' && (
        <SignUp
          onSignUp={handleSignUp}
          onSwitchToSignIn={() => setCurrentView('signin')}
        />
      )}
      {currentView === 'dashboard' && currentUser && (
        <Dashboard userEmail={currentUser} onSignOut={handleSignOut} />
      )}
    </div>
  );
}