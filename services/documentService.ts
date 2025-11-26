import { apiClient } from "@/lib/api"



export class DocumentsService {
  async getDocuments(params?: any) {
    try {
      const response = await apiClient.get<any>("/documents", params)
      return response || { works: [], total: 0, page: 1, limit: 10 }
    } catch (error) {
      console.error("Get works error:", error)
      return { works: [], total: 0, page: 1, limit: 10 }
    }
  }

  async getDocument(id: string) {
    try {
      const response = await apiClient.get<any>(`/documents/${id}`)
      return response || null
    } catch (error) {
      console.error("Get user error:", error)
      return null
    }
  }


  async createDocument(work: any) {
    try {
      const response = await apiClient.upload<any>("/documents", work)
      return response || null
    } catch (error) {
      console.error("Create user error:", error)
      return null
    }
  }

  async updateDocument(id: string, user: any) {
    try {
      const response = await apiClient.uploadPatch<any>(`/documents/${id}`, user)
      return response || null
    } catch (error) {
      console.error("Update user error:", error)
      return null
    }
  }

  async deleteDocument(id: string) {
    try {
      const response = await apiClient.delete<any>(`/documents/${id}`)
      return response || false
    } catch (error) {
      console.error("Delete user error:", error)
      return false
    }
  }

  
}

export const documentsService = new DocumentsService()
