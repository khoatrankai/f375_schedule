import { apiClient } from "@/lib/api"



export class GroupsService {
  async getGroups(params?: any) {
    try {
      const response = await apiClient.get<any>("/groups", params)
      return response || { users: [], total: 0, page: 1, limit: 10 }
    } catch (error) {
      console.error("Get users error:", error)
      return { users: [], total: 0, page: 1, limit: 10 }
    }
  }

  async getGroup(id: string) {
    try {
      const response = await apiClient.get<any>(`/groups/${id}`)
      return response || null
    } catch (error) {
      console.error("Get user error:", error)
      return null
    }
  }

  async getTreeGroup() {
    try {
      const response = await apiClient.get<any>(`/groups/tree`)
      return response || null
    } catch (error) {
      console.error("Login user error:", error)
      return null
    }
  }

  async createGroup(group: any) {
    try {
      const response = await apiClient.post<any>("/groups", group)
      return response || null
    } catch (error) {
      console.error("Create user error:", error)
      return null
    }
  }

  async updateGroup(id: string, group: any) {
    try {
      const response = await apiClient.patch<any>(`/groups/${id}`, group)
      return response || null
    } catch (error) {
      console.error("Update user error:", error)
      return null
    }
  }

  async deleteGroup(id: string) {
    try {
      const response = await apiClient.delete<any>(`/groups/${id}`)
      return response.success || false
    } catch (error) {
      console.error("Delete user error:", error)
      return false
    }
  }


}

export const groupsService = new GroupsService()
