"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, UserRole } from "./types"
import { usersService } from "@/services/userService"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (requiredRole: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const listLevel = [ { value: 'Binh nhì', tag: 'binh_nhi' },
  { value: 'Binh nhất', tag: 'binh_nhat' },
  { value: 'Hạ sĩ', tag: 'ha_si' },
  { value: 'Trung sĩ', tag: 'trung_si' },
  { value: 'Thượng sĩ', tag: 'thuong_si' },

  // Quân nhân chuyên nghiệp
  { value: 'Thiếu úy QNCN', tag: 'thieu_uy_qncn' },
  { value: 'Trung úy QNCN', tag: 'trung_uy_qncn' },
  { value: 'Thượng úy QNCN', tag: 'thuong_uy_qncn' },
  { value: 'Đại úy QNCN', tag: 'dai_uy_qncn' },
  { value: 'Thiếu tá QNCN', tag: 'thieu_ta_qncn' },
  { value: 'Trung tá QNCN', tag: 'trung_ta_qncn' },
  { value: 'Thượng tá QNCN', tag: 'thuong_ta_qncn' },

  // Sĩ quan cấp úy
  { value: 'Thiếu úy', tag: 'thieu_uy' },
  { value: 'Trung úy', tag: 'trung_uy' },
  { value: 'Thượng úy', tag: 'thuong_uy' },
  { value: 'Đại úy', tag: 'dai_uy' },

  // Sĩ quan cấp tá
  { value: 'Thiếu tá', tag: 'thieu_ta' },
  { value: 'Trung tá', tag: 'trung_ta' },
  { value: 'Thượng tá', tag: 'thuong_ta' },
  { value: 'Đại tá', tag: 'dai_ta' },

  // Sĩ quan cấp tướng
  { value: 'Thiếu tướng', tag: 'thieu_tuong' },
  { value: 'Trung tướng', tag: 'trung_tuong' },
  { value: 'Thượng tướng', tag: 'thuong_tuong' },
  { value: 'Đại tướng', tag: 'dai_tuong' }]
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("currentUser")
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    // Mock authentication - in production, call your API
    const res = await usersService.loginUser({email,password})
    if(res?.statusCode === 200){
      setUser({...res?.data,rank:listLevel.find(dt => dt.tag === res?.data?.level)?.value})
       localStorage.setItem("currentUser", JSON.stringify({...res?.data,rank:listLevel.find(dt => dt.tag === res?.data?.level)?.value}))
     
    }
    // const mockUser: User = {
    //   id: "1",
    //   name: "Trung tá Nguyễn Văn A",
    //   email: email,
    //   role: "admin",
    //   department: "Sư đoàn Phòng không 375",
    //   rank: "Trung tá",
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // }
    // setUser(mockUser)
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false
    return requiredRoles.includes(user.role)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (undefined === context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
