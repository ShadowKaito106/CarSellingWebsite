'use client'

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { endpoints } from '@/config/api'

interface User {
  _id: string
  full_name: string
  username?: string
  email: string
  phone_number: string
  address: string
  role: 'user' | 'admin'
  avatar_url?: string
  cover_image_url?: string
  rating: number
  kyc_status: 'pending' | 'verified' | 'rejected'
  identity_document_type?: 'CMND' | 'CCCD' | 'Hộ chiếu'
  identity_document_number?: string
  identity_document_images?: {
    front?: string
    back?: string
  }
  wallet_balance?: number
  favorites?: string[]
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isRefreshing: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  // Function to fetch and update user data
  const fetchUserData = useCallback(async (token: string) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(endpoints.auth.currentUser, { headers });
      
      if (!response.ok) {
        // Nếu có lỗi từ API (401, 403), xóa token và đăng xuất
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
        throw new Error('Error fetching user data');
      }

      const data = await response.json();
      // Ensure data is valid before setting the user
      if (data && typeof data === 'object') {
        setUser(data);
        setIsAuthenticated(true);
        
        // Also store in local storage for offline access
        localStorage.setItem('userData', JSON.stringify(data));
      } else {
        throw new Error('Invalid user data received');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // Kiểm tra nếu lỗi là do không kết nối được với server (network error)
      if (error instanceof TypeError && (error.message.includes('Failed to fetch') || error.message.includes('Network'))) {
        // Sử dụng dữ liệu từ localStorage nếu có
        const cachedUserData = localStorage.getItem('userData');
        if (cachedUserData) {
          try {
            const userData = JSON.parse(cachedUserData);
            setUser(userData);
            setIsAuthenticated(true);
            console.log('Using cached user data');
          } catch (e) {
            // Nếu không thể parse JSON, xử lý lỗi
            localStorage.removeItem('userData');
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // Nếu không có dữ liệu trong localStorage, tạo một user mẫu nếu có token
          if (token) {
            // Tạo user mẫu khi đang offline nhưng có token
            const sampleUser = {
              _id: 'offline-user-id',
              name: 'Người dùng Offline',
              email: 'offline@example.com',
              phone: '0123456789',
              role: 'user',
              avatar_url: '/user-avatar.png',
              full_name: 'Người dùng Offline'
            };
            setUser(sampleUser);
            setIsAuthenticated(true);
            // Lưu thông tin này vào localStorage để có thể sử dụng lại
            localStorage.setItem('userData', JSON.stringify(sampleUser));
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        // Các lỗi khác
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Kiểm tra token trong localStorage khi component mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          setIsLoading(false)
          return
        }

        await fetchUserData(token)
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('token')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [fetchUserData])

  // Add a function to refresh user data
  const refreshUserData = async (): Promise<void> => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes
    
    try {
      setIsRefreshing(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      
      await fetchUserData(token);
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // If refresh fails, try to use cached data
      const cachedUserData = localStorage.getItem('userData');
      if (cachedUserData) {
        try {
          const userData = JSON.parse(cachedUserData);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (e) {
          console.error('Error parsing cached user data:', e);
        }
      }
    } finally {
      setIsRefreshing(false);
    }
  }

  const login = async (email: string, password: string): Promise<any> => {
    try {
      const response = await fetch(endpoints.auth.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      if (!data || !data.token) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('token', data.token);
      
      // Check if user data exists in the response
      if (data.user && typeof data.user === 'object') {
        // Save user data to local storage for offline use
        localStorage.setItem('userData', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        // If no user data in response, fetch it using the token
        await fetchUserData(data.token);
      }
      
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      
      // Nếu không kết nối được với server và thông tin đăng nhập là admin/admin, cho phép đăng nhập
      if (error instanceof TypeError && error.message.includes('Failed to fetch') && 
          email === 'admin@example.com' && password === 'admin') {
        
        const sampleUser = {
          _id: 'offline-admin-id',
          name: 'Admin Offline',
          email: 'admin@example.com',
          phone: '0123456789',
          role: 'admin',
          avatar_url: '/user-avatar.png',
          full_name: 'Admin Offline'
        };
        
        localStorage.setItem('token', 'offline-token');
        localStorage.setItem('userData', JSON.stringify(sampleUser));
        
        setUser(sampleUser);
        setIsAuthenticated(true);
        setIsLoading(false);
        
        return { success: true, user: sampleUser, token: 'offline-token' };
      }
      
      throw error;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await fetch(endpoints.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        return true
      }

      throw new Error(data.message || 'Registration failed')
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
    router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isRefreshing,
        login,
        register,
        logout,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
} 