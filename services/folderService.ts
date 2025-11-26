import { apiClient } from "@/lib/api"



export class FoldersService {
  async getFolders(params?: any) {
    try {
      const response = await apiClient.get<any>("/folders", params)
      return response || { works: [], total: 0, page: 1, limit: 10 }
    } catch (error) {
      console.error("Get works error:", error)
      return { works: [], total: 0, page: 1, limit: 10 }
    }
  }

  async getFolder(id: string) {
    try {
      const response = await apiClient.get<any>(`/folders/${id}`)
      return response || null
    } catch (error) {
      console.error("Get user error:", error)
      return null
    }
  }


  async createFolder(folder: any) {
    try {
      const response = await apiClient.post<any>("/folders", folder)
      return response || null
    } catch (error) {
      console.error("Create user error:", error)
      return null
    }
  }

  async updateFolder(id: string, folder: any) {
    try {
      const response = await apiClient.patch<any>(`/folders/${id}`, folder)
      return response || null
    } catch (error) {
      console.error("Update user error:", error)
      return null
    }
  }

  async deleteFolder(id: string) {
    try {
      const response = await apiClient.delete<any>(`/folders/${id}`)
      return response || false
    } catch (error) {
      console.error("Delete user error:", error)
      return false
    }
  }

  
}

export const foldersService = new FoldersService()
