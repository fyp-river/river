
import React, { useState } from 'react';
import { Droplets, BarChart3, Map, AlertCircle, Settings, Menu, X, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: BarChart3 },
    { to: '/sensors', label: 'Sensors', icon: Activity },
    { to: '/map', label: 'Map View', icon: Map },
    { to: '/alerts', label: 'Alerts', icon: AlertCircle },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 lg:px-8">
      <div className="flex items-center gap-2">
        <Droplets className="h-6 w-6 text-river-blue-light animate-flow" />
        <span className="text-xl font-semibold text-white">RiverWatcher</span>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} active={currentPath === item.to}>
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-center gap-2 pb-4 border-b">
                <Droplets className="h-6 w-6 text-river-blue-light" />
                <span className="text-lg font-semibold">RiverWatcher</span>
              </div>
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                      currentPath === item.to
                        ? "text-river-purple-light bg-secondary"
                        : "text-muted-foreground hover:text-river-foreground hover:bg-secondary/50"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop Profile/Status */}
      <div className="hidden md:flex items-center gap-4">
        <div className="rounded-full bg-river-purple/30 p-1.5 text-river-purple-light">
          <Droplets className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  children: React.ReactNode;
  to: string;
  active?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ children, to, active }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
        active
          ? "text-river-purple-light bg-secondary"
          : "text-muted-foreground hover:text-river-foreground hover:bg-secondary/50"
      )}
    >
      {children}
    </Link>
  );
};

export default Header;
