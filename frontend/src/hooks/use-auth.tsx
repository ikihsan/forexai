"use client"

import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { LOGIN_MUTATION, REGISTER_MUTATION, LOGOUT_MUTATION, GET_CURRENT_USER } from '@/lib/graphql/operations'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

interface RegisterInput {
  email: string
  password: string
  firstName: string
  lastName: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const [loginMutation] = useMutation(LOGIN_MUTATION)
  const [registerMutation] = useMutation(REGISTER_MUTATION)
  const [logoutMutation] = useMutation(LOGOUT_MUTATION)

  const { data: userData, loading: userLoading } = useQuery(GET_CURRENT_USER, {
    skip: typeof window === 'undefined' || !globalThis?.localStorage?.getItem?.('accessToken'),
    errorPolicy: 'ignore'
  })

  // Initialize auth state from localStorage (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      if (token) {
        // Token exists, user should be set from the GET_CURRENT_USER query
        // This just ensures we don't immediately show login state
      }
    }
  }, [])

  useEffect(() => {
    if (userData?.me) {
      setUser(userData.me)
    }
    setLoading(userLoading)
  }, [userData, userLoading])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data } = await loginMutation({
        variables: { input: { email, password } }
      })

      if (data?.login?.accessToken) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', data.login.accessToken)
        }
        setUser(data.login.user)
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
          variant: "success"
        })

        // Redirect based on user status
  router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterInput) => {
    try {
      setLoading(true)
      const { data } = await registerMutation({
        variables: { input: userData }
      })

      if (data?.register?.accessToken) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', data.register.accessToken)
        }
        setUser(data.register.user)
        
        toast({
          title: "Account created!",
          description: "Welcome to ForexAI. Choose your subscription plan to get started.",
          variant: "success"
        })

  router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive"
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutMutation()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
      }
      setUser(null)
      router.push('/')
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
        variant: "info"
      })
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
