import { apiClient } from "@/lib/api"



export class WorksService {
  async getWorks(params?: any) {
    try {
      const response = await apiClient.get<any>("/works", params)
      return response || { works: [], total: 0, page: 1, limit: 10 }
    } catch (error) {
      console.error("Get works error:", error)
      return { works: [], total: 0, page: 1, limit: 10 }
    }
  }

  async getWork(id: string) {
    try {
      const response = await apiClient.get<any>(`/works/${id}`)
      return response || null
    } catch (error) {
      console.error("Get user error:", error)
      return null
    }
  }


  async createWork(work: any) {
    try {
      const response = await apiClient.post<any>("/works", work)
      return response || null
    } catch (error) {
      console.error("Create user error:", error)
      return null
    }
  }

  async updateWork(id: string, user: any) {
    try {
      const response = await apiClient.patch<any>(`/works/${id}`, user)
      return response || null
    } catch (error) {
      console.error("Update user error:", error)
      return null
    }
  }

  async deleteWork(id: string) {
    try {
      const response = await apiClient.delete<any>(`/works/${id}`)
      return response || false
    } catch (error) {
      console.error("Delete user error:", error)
      return false
    }
  }

  
}

export const worksService = new WorksService()
