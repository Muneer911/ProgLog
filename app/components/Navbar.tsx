"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Avatar, AvatarFallback } from './ui/avatar';
import { LogOut, User, Settings, ClipboardList, Menu } from 'lucide-react';

interface NavbarProps {
  userEmail: string;
  onSignOut: () => void;
}

export default function Navbar({ userEmail, onSignOut }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const userInitials = userEmail
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav 
      className="border-b bg-card shadow-sm sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="size-5 sm:size-6 text-primary" aria-hidden="true" />
            <span className="sr-only">Proglog</span>
            <span aria-hidden="true" className="text-lg sm:text-xl">Proglog</span>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:block truncate max-w-[200px]">
              {userEmail}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative size-8 rounded-full p-0"
                  aria-label="User menu"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm">My Account</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 size-4" aria-hidden="true" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" aria-hidden="true" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSignOut}>
                  <LogOut className="mr-2 size-4" aria-hidden="true" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="flex sm:hidden items-center gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="size-9"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <Avatar className="size-10">
                      <AvatarFallback>
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">My Account</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="mr-2 size-4" aria-hidden="true" />
                      Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="mr-2 size-4" aria-hidden="true" />
                      Settings
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={() => {
                        setIsOpen(false);
                        onSignOut();
                      }}
                    >
                      <LogOut className="mr-2 size-4" aria-hidden="true" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
