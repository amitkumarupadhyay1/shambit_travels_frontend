/**
 * Authentication Utilities
 * Helper functions for authentication operations
 */

import { signOut } from "next-auth/react"
import axios from "axios"
import { tokenManager } from "./tokenManager"

/**
 * Perform complete logout
 * - Blacklist refresh token on backend
 * - Clear all local storage
 * - Sign out from NextAuth
 * - Redirect to login page
 */
export async function performLogout(redirectUrl: string = "/login"): Promise<void> {
  try {
    // Get refresh token before clearing
    const refreshToken = tokenManager.getRefreshToken()
    const accessToken = tokenManager.getAccessToken()

    // Try to blacklist token on backend
    if (refreshToken && accessToken) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/logout/`,
          { refresh: refreshToken },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            timeout: 5000, // 5 second timeout
          }
        )
        console.log("✅ Token blacklisted successfully")
      } catch (error) {
        // Log error but continue with logout
        console.error("⚠️ Failed to blacklist token:", error)
      }
    }

    // Clear all tokens from localStorage
    tokenManager.clearTokens()

    // Clear any other auth-related data
    if (typeof window !== 'undefined') {
      // Clear any additional auth data
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes('auth') || 
        key.includes('token') || 
        key.includes('session')
      )
      keysToRemove.forEach(key => localStorage.removeItem(key))
    }

    // Sign out from NextAuth
    await signOut({ 
      callbackUrl: redirectUrl,
      redirect: true 
    })

    console.log("✅ Logout completed successfully")
  } catch (error) {
    console.error("❌ Logout error:", error)
    
    // Even if logout fails, clear local data and redirect
    tokenManager.clearTokens()
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
    
    // Force redirect
    window.location.href = redirectUrl
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return tokenManager.isAuthenticated()
}

/**
 * Get current access token
 */
export async function getAccessToken(): Promise<string | null> {
  return tokenManager.getValidAccessToken()
}

/**
 * Store authentication tokens
 */
export function storeTokens(access: string, refresh: string): void {
  tokenManager.setTokens(access, refresh)
}

/**
 * Clear authentication tokens
 */
export function clearTokens(): void {
  tokenManager.clearTokens()
}
