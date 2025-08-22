"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, TrendingUp, LogIn, UserPlus, User, LogOut, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '#contact' },
  { name: 'Blog', href: '/blog' }
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { user, logout, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const closeMenu = () => setIsMenuOpen(false)

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      if (pathname !== '/') {
        // Navigate to home with hash
        window.location.href = `/${href}`
      } else {
        const element = document.getElementById(href.slice(1))
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          // Fallback to update hash
          window.location.hash = href
        }
      }
      closeMenu()
      return
    }
    closeMenu()
  }

  const handleLogout = async () => {
    await logout()
    closeMenu()
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-10">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold group-hover:text-primary transition-colors">
              ForexAI
            </span>
          </Link>

          {/* Desktop Navigation - Only show on larger screens */}
          <div className="hidden xl:flex items-center space-x-8">
            {navigation.map((item) => (
              item.href.startsWith('#') ? (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              <>
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <User className="h-4 w-4" />
                        {user?.firstName || 'Account'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/auth/login">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/auth/register">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors z-10"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="xl:hidden border-t border-border/50 mt-4 py-4 bg-background/95 backdrop-blur-sm rounded-lg"
            >
              <div className="space-y-4">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.href.startsWith('#') ? (
                      <button
                        onClick={() => handleNavClick(item.href)}
                        className="block px-4 py-2 text-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-all font-medium w-full text-left"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="block px-4 py-2 text-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-all font-medium"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Mobile CTA Buttons */}
                <div className="px-4 pt-4 border-t border-border/50 space-y-3">
                  {!loading && (
                    <>
                      {isAuthenticated ? (
                        <>
                          <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard" onClick={closeMenu}>
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Dashboard
                            </Link>
                          </Button>
                          <Button variant="outline" className="w-full" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" className="w-full" asChild>
                            <Link href="/auth/login" onClick={closeMenu}>
                              <LogIn className="h-4 w-4 mr-2" />
                              Sign In
                            </Link>
                          </Button>
                          <Button className="w-full" asChild>
                            <Link href="/auth/register" onClick={closeMenu}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Get Started
                            </Link>
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
