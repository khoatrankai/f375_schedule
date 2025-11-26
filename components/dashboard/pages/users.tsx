"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { mockUsers } from "@/lib/mock-data"
import type { User } from "@/lib/types"
import { Plus, Edit2, Trash2, Lock } from "lucide-react"
import { Select } from "antd"
import { Option } from "antd/es/mentions"
import { usersService } from "@/services/userService"
import { groupsService } from "@/services/groupService"


const levels = [ { value: 'Binh nhì', tag: 'binh_nhi' },
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

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
    const [departments, setDepartments] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    status: "active",
    level: "binh_nhi",
    role: "user",
    group: "",
    groups: [],
  })

  const roleLabels: Record<string, string> = {
    admin: "Quản trị viên",
    commandant: "Chỉ huy",
    officer: "Sĩ quan",
    user: "Binh sĩ",
  }

  const handleSubmit = async(e: React.FormEvent) => {
    console.log(formData)
    e.preventDefault()
    if (editId) {
      const res = await usersService.updateUser(editId,formData)
      if(res?.statusCode === 200){
        fetchData()
      }
      setEditId(null)
    } else {
      const res = await usersService.createUser(formData)
      if(res?.statusCode === 201){
        fetchData()
      }
    }
    setFormData({
      name: "",
      email: "",
      password: "",
      status: "active",
      level: "binh_nhi",
      role: "user",
      group: "",
      groups: []
    })
    setShowForm(false)
  }

  const handleEdit = (user: any) => {
    setFormData({
      ...user,group:user?.group?.id,groups:user?.permission?.map((dt:any)=>{
        return dt?.group?.id
      })
    })
    setEditId(user.id)
    setShowForm(true)
  }

  const handleDelete = async(id: string) => {
    // setUsers(users.filter((u) => u.id !== id))
    const res = await usersService.deleteUser(id)
    console.log(res)
    if(res?.statusCode === 200){
      fetchData()
    }
  }

  const fetchData = async()=>{
    const res = await usersService.getUsers()
    const res2 = await groupsService.getGroups()
    if(res?.statusCode === 200){
      setUsers(res?.data)
    }
        if(res2?.statusCode === 200){
          setDepartments(res2?.data)
        }
        
  }

  useEffect(()=>{
    fetchData()
  },[])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Quản lý User</h1>
          <p className="text-sm text-muted-foreground mt-1">4 cấp độ quyền hạn</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="military-btn flex items-center gap-2">
          <Plus size={20} />
          Thêm người dùng
        </button>
      </div>

      {showForm && (
        <div className="military-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tên đầy đủ</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground"
                  required
                />
              </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mật khẩu</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground"
                  required
                />
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Cấp bậc</label>
                <Select
                  className="w-full"
                  placeholder="Chọn cấp bậc"
                  showSearch
                  onChange={(e)=>{
                    setFormData({...formData,level:e})
                  }}
                  value={formData.level}
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                   {levels?.map((dt) => (
                    <Option key={dt.tag} value={dt.tag}>
                      {dt.value}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Đơn vị/Phong ban</label>
                <Select
                                  className="w-full"
                                  placeholder="Chọn ban"
                                  showSearch
                                  onChange={(e)=>{
                                    setFormData({...formData,group:e})
                                  }}
                                  value={formData.group}
                                  filterOption={(input, option) => {
                                    const text = Array.isArray(option?.children)
                                      ? option.children.join("")
                                      : option?.children ?? "";
                                    return text.toLowerCase().includes(input.toLowerCase());
                                  }}
                                >
                                   {departments?.map((dt) => (
                                    <Option key={dt.id} value={dt.id}>
                                      {dt.name}
                                    </Option>
                                  ))}
                                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Quyền hạn</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground"
              >
                <option value="user">Binh sĩ (Cấp 4)</option>
                <option value="officer">Sĩ quan (Cấp 3)</option>
                <option value="commandant">Chỉ huy (Cấp 2)</option>
                <option value="admin">Quản trị viên (Cấp 1)</option>
              </select>
            </div>
                <div>
              <label className="block text-sm font-medium mb-2">Ban theo dõi</label>
              <Select
                    mode="multiple"
                    allowClear
                    maxTagCount={"responsive"}
                    style={{ width: "320px" }}
                    value={formData.groups}
                    placeholder="Vui lòng chọn danh sách"
                    onChange={(e) => {
                      console.log(e)
                      setFormData({...formData,groups:e});
                    }}
                    options={departments?.map((department:any) => ({
                      label: (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div>
                            <strong>{department.name}</strong>
                            <div style={{ fontSize: "12px", color: "gray" }}>{department.code}</div>
                          </div>
                        </div>
                      ),
                      value: department.id,
                    }))}
                  />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="military-btn">
                {editId ? "Cập nhật" : "Tạo mới"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditId(null)
                  setFormData({
                     name: "",
                    email: "",
                    password: "",
                    status: "active",
                    level: "binh_nhi",
                    role: "user",
                    group: "",
                    groups: [] 
                  })
                }}
                className="military-btn-secondary"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-muted-foreground font-semibold">Tên</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-semibold">Cấp bậc</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-semibold">Phòng ban</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-semibold">Quyền hạn</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-card/50 transition">
                <td className="px-4 py-3 text-foreground font-medium">{user.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3 text-foreground">{levels.find(dt => dt.tag === user.level)?.value}</td>
                <td className="px-4 py-3 text-muted-foreground">{user?.group?.name}({user?.group?.code})</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-sm text-xs font-semibold flex items-center gap-1 w-fit ${
                      user.role === "admin"
                        ? "bg-destructive/20 text-destructive"
                        : user.role === "commandant"
                          ? "bg-orange-500/20 text-orange-400"
                          : user.role === "officer"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    <Lock size={12} />
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 hover:bg-primary/20 text-primary rounded transition"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2 hover:bg-destructive/20 text-destructive rounded transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permission Levels Legend */}
      <div className="military-card p-6 mt-8">
        <h3 className="font-bold text-primary mb-4">Cấp độ quyền hạn</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-background rounded border border-border">
            <p className="font-semibold text-foreground mb-1">Cấp 1: Quản trị viên</p>
            <p className="text-xs text-muted-foreground">Toàn quyền quản lý hệ thống</p>
          </div>
          <div className="p-3 bg-background rounded border border-border">
            <p className="font-semibold text-foreground mb-1">Cấp 2: Chỉ huy</p>
            <p className="text-xs text-muted-foreground">Quản lý phòng ban và công việc</p>
          </div>
          <div className="p-3 bg-background rounded border border-border">
            <p className="font-semibold text-foreground mb-1">Cấp 3: Sĩ quan</p>
            <p className="text-xs text-muted-foreground">Xem và quản lý sổ sách</p>
          </div>
          <div className="p-3 bg-background rounded border border-border">
            <p className="font-semibold text-foreground mb-1">Cấp 4: Binh sĩ</p>
            <p className="text-xs text-muted-foreground">Xem công việc và lịch trình</p>
          </div>
        </div>
      </div>
    </div>
  )
}
