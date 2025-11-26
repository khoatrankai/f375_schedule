import { apiClient } from "@/lib/api"



export class SchedulesService {
  async getSchedules(params?: any) {
    try {
      const response = await apiClient.get<any>("/schedules", params)
      return response || { schedules: [], total: 0, page: 1, limit: 10 }
    } catch (error) {
      console.error("Get schedules error:", error)
      return { schedules: [], total: 0, page: 1, limit: 10 }
    }
  }

  async getSchedule(id: string) {
    try {
      const response = await apiClient.get<any>(`/schedules/${id}`)
      return response || null
    } catch (error) {
      console.error("Get user error:", error)
      return null
    }
  }


  async createSchedule(work: any) {
    try {
      const response = await apiClient.post<any>("/schedules", work)
      return response || null
    } catch (error) {
      console.error("Create user error:", error)
      return null
    }
  }

  async updateSchedule(id: string, user: any) {
    try {
      const response = await apiClient.patch<any>(`/schedules/${id}`, user)
      return response || null
    } catch (error) {
      console.error("Update user error:", error)
      return null
    }
  }

  async deleteSchedule(id: string) {
    try {
      const response = await apiClient.delete<any>(`/schedules/${id}`)
      return response || false
    } catch (error) {
      console.error("Delete user error:", error)
      return false
    }
  }

  
}

export const schedulesService = new SchedulesService()
