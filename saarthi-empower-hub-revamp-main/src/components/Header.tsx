import { useState } from 'react';
import { Menu, X, ChevronDown, User, Settings, LogOut, Home, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExploreModal from './ExploreModal';
import AboutModal from './AboutModal';
import AuthModal from './AuthModal';
import HelpPopup from './HelpPopup';
import SaarthiLogo from './SaarthiLogo';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  isLoggedIn?: boolean;
  userDashboard?: boolean;
  userName?: string;
  onLogin?: (name: string) => void;
  onLogout?: () => void;
  currentView?: 'landing' | 'dashboard';
  onViewChange?: (view: 'landing' | 'dashboard') => void;
}

const Header = ({ userDashboard = false, onViewChange, onLogin }: HeaderProps) => {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const userName = user ? user.name : 'User';
  const onLogout = logout;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgotPassword' | 'resetPassword' | 'changePassword'>('login');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);

  const openAuth = (mode: typeof authMode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    setSettingsDropdownOpen(false);
    setUserDropdownOpen(false);
  };

  const handleHomeClick = () => {
    if (onViewChange) {
      onViewChange('landing');
    } else if (userDashboard) {
      window.location.reload();
    }
  };

  const handleDashboardClick = () => {
    if (onViewChange) {
      onViewChange('dashboard');
    }
  };

  const handleAuthLogin = (name: string) => {
    onLogin?.(name);
  };

  const handleAboutSignUp = () => {
    openAuth('signup');
  };

  return (
    <>
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation - Left aligned */}
            <div className="flex items-center gap-8">
              <div onClick={handleHomeClick} className="flex items-center gap-3 cursor-pointer">
                <SaarthiLogo size="md" />
                <span className="font-bold text-xl text-foreground hidden sm:block">Saarthi</span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <button
                  onClick={handleHomeClick}
                  className="nav-link font-medium flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>

                <button
                  onClick={() => setIsExploreOpen(true)}
                  className="nav-link font-medium flex items-center gap-1 hover:text-primary transition-colors"
                >
                  Explore <ChevronDown className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="nav-link font-medium hover:text-primary transition-colors"
                >
                  About
                </button>

                {isLoggedIn && (
                  <button
                    onClick={handleDashboardClick}
                    className="nav-link font-medium hover:text-primary transition-colors"
                  >
                    Dashboard
                  </button>
                )}
              </nav>
            </div>

            {/* Right side - Auth and Settings */}
            <div className="hidden md:flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => openAuth('login')}
                    className="text-foreground hover:text-primary"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => openAuth('signup')}
                    className="btn-hero"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  {/* Settings dropdown */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      onClick={() => { setSettingsDropdownOpen(!settingsDropdownOpen); setUserDropdownOpen(false); }}
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>

                    {settingsDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-lg shadow-elegant py-2 z-50">
                        <button
                          onClick={() => openAuth('changePassword')}
                          className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-foreground text-sm"
                        >
                          <Lock className="w-4 h-4" />
                          Change Password
                        </button>
                        <div className="border-t border-border/50 my-1" />
                        <button
                          onClick={() => { onLogout(); setSettingsDropdownOpen(false); }}
                          className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-destructive text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>

                  {/* User / Account dropdown */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      onClick={() => { setUserDropdownOpen(!userDropdownOpen); setSettingsDropdownOpen(false); }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-sm font-semibold">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden lg:block max-w-[100px] truncate">{userName}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-lg shadow-elegant py-2 z-50">
                        <div className="px-4 py-2 border-b border-border/50">
                          <p className="font-medium text-foreground text-sm truncate">{userName}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <button
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-sm"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                        <div className="border-t border-border/50 my-1" />
                        <button
                          onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                          className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-destructive text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => { handleHomeClick(); setIsMobileMenuOpen(false); }}
                  className="text-left nav-link font-medium flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
                <button
                  onClick={() => { setIsExploreOpen(true); setIsMobileMenuOpen(false); }}
                  className="text-left nav-link font-medium"
                >
                  Explore
                </button>
                <button
                  onClick={() => { setIsAboutOpen(true); setIsMobileMenuOpen(false); }}
                  className="text-left nav-link font-medium"
                >
                  About
                </button>

                {!isLoggedIn ? (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                    <Button variant="ghost" onClick={() => { openAuth('login'); setIsMobileMenuOpen(false); }}>
                      Login
                    </Button>
                    <Button onClick={() => { openAuth('signup'); setIsMobileMenuOpen(false); }} className="btn-hero">
                      Sign Up
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                    <Button
                      variant="ghost"
                      onClick={() => { handleDashboardClick(); setIsMobileMenuOpen(false); }}
                    >
                      Dashboard
                    </Button>
                    <Button variant="ghost">Profile</Button>
                    <Button
                      variant="ghost"
                      onClick={() => { openAuth('changePassword'); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-2 justify-center"
                    >
                      <Lock className="w-4 h-4" />
                      Change Password
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                      className="text-destructive"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <ExploreModal isOpen={isExploreOpen} onClose={() => setIsExploreOpen(false)} onLogin={() => openAuth('login')} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} onOpenAuth={handleAboutSignUp} />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleAuthLogin}
        defaultMode={authMode}
      />
      <HelpPopup isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};

export default Header;
