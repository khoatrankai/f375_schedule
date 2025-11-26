"use client"
import { IoMdAdd } from "react-icons/io";
import type React from "react"
import { CiBoxList } from "react-icons/ci";
import { GrTreeOption } from "react-icons/gr";
import { Button, Dropdown, Form, Input, MenuProps, Modal, Select, Table } from "antd";
import { useEffect, useState } from "react"
// import { mockDepartments } from "@/lib/mock-data"
import { Plus, Edit2, Trash2 } from "lucide-react"
// import type { Department } from "@/lib/types"
import { groupsService } from "@/services/groupService";
import { Option } from "antd/es/mentions";
import { RecordNode } from "@/lib/types";
import { MdDelete } from "react-icons/md";
interface TreeNodeProps {
  node: RecordNode
  level: number
  searchQuery: string
  onSelect: (node: RecordNode) => void
  onCreateFolder: (parentId: string) => void
  onDelete: (nodeId: string) => void
  onCopy: (node: RecordNode) => void
  onMove: (nodeId: string, targetParentId: string) => void
  setFormData:any
  setShowForm:any
  formData:any
  // clipboardNode: RecordNode | null
}
// const items = [
//   {
//     label: (
//       <p className="cursor-pointer" onClick={()=>{
        
//       }}>
//         <IoMdAdd />
//         <span>Thêm phòng con</span>
        
//       </p>
//     ),
//     key: '0',
//   },
//   {
//     label: (
//        <p className="cursor-pointer" onClick={()=>{

//       }}>
//         <MdDelete />
//         <span>Xóa phòng</span>
        
//       </p>
//     ),
//     key: '1',
//   }
// ];

function TreeNodeComponent({
  node,
  level,
  searchQuery,
  onSelect,
  onCreateFolder,
  onDelete,
  onCopy,
  onMove,
  formData,
  setFormData,
  setShowForm
  // clipboardNode,
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  

  const nodeMatches = node.name.toLowerCase().includes(searchQuery.toLowerCase())
  const childrenMatch = node.children?.some(
    (child:any) => child.name.toLowerCase().includes(searchQuery.toLowerCase()) || (child.children?.length ? true : false),
  )

  if (searchQuery && !nodeMatches && !childrenMatch) return null

  const isFolder = true
  const hasChildren = isFolder && node.children && node.children.length > 0

  return (
    <div>
      <Dropdown menu={{items:[
  {
    label: (
      <div className="cursor-pointer flex items-center" onClick={()=>{
        setShowForm(true)
        setFormData({...formData,parent:node.id})
      }}>
        <IoMdAdd />
        <span>Thêm phòng con</span>
        
      </div>
    ),
    key: '0',
  },
  {
    label: (
       <div className="cursor-pointer flex items-center" onClick={()=>{
        onDelete(node.id)
      }}>
        <MdDelete />
        <span>Xóa phòng</span>
        
      </div>
    ),
    key: '1',
  }
]}} trigger={['contextMenu']}>
  <div
        className="flex items-center gap-2 px-2 py-2 hover:bg-blue-500/10 rounded cursor-pointer group relative"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onContextMenu={(e)=>{e.preventDefault()}}
        onClick={() => {
          if (isFolder) setIsExpanded(!isExpanded)
          onSelect(node)
        }}
      >
        {isFolder && (
          <button className="p-0 hover:bg-blue-500/20 rounded transition-colors w-5 h-5 flex items-center justify-center">
            {hasChildren ? (
              <span className="text-blue-600 font-bold">{isExpanded ? "▼" : "▶"}</span>
            ) : (
              <span className="w-5" />
            )}
          </button>
        )}

        {!isFolder && <div className="w-5" />}

        <div className="p-1.5 bg-blue-500/10 rounded">
          {isFolder ? <span className="text-lg">📁</span> : <span className="text-lg">📄</span>}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium text-foreground truncate ${
              searchQuery && node.name.toLowerCase().includes(searchQuery.toLowerCase())
                ? "font-bold text-blue-600"
                : ""
            }`}
          >
            {node.name}
          </p>
        </div>

        {/* <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-1 hover:bg-blue-500/20 rounded transition-colors text-muted-foreground"
            title="Menu hành động"
          >
            ⋮
          </button>
        </div> */}

        {!isFolder && node.date && (
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {new Date(node.date).toLocaleDateString("vi-VN")}
          </span>
        )}

        {/* {showMenu && (
          <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-sm shadow-lg z-40 min-w-max">
            {isFolder && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onCreateFolder(node.id)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-blue-500/10 transition-colors border-b border-border"
                >
                  + Tạo thư mục con
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCopy(node)
                setShowMenu(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-blue-500/10 transition-colors border-b border-border"
            >
              📋 Sao chép
            </button>
         
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Bạn có chắc chắn muốn xóa "${node.name}"?`)) {
                  onDelete(node.id)
                  setShowMenu(false)
                }
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
            >
              🗑️ Xóa
            </button>
          </div>
        )} */}
      </div>
</Dropdown>
      

      {isFolder && isExpanded && hasChildren && (
        <div>
          {(node.children??[]).map((child:any) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              searchQuery={searchQuery}
              onSelect={onSelect}
              onCreateFolder={onCreateFolder}
              onDelete={onDelete}
              onCopy={onCopy}
              onMove={onMove}
              setShowForm={setShowForm}
              setFormData={setFormData}
              formData={formData}
              // clipboardNode={clipboardNode}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<any[]>([])
  const [recordTree,setRecordTree] = useState<RecordNode[]>([])
  const [statusBtn,setStatusBtn] = useState<boolean>(false)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    commandant: "",
    description: "",
    parent:"",
    groups:[]
  })

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    if (editId) {
      // setDepartments(departments.map((d) => (d.id === editId ? { ...d, ...formData } : d)))
      await groupsService.updateGroup(editId,formData)
      setEditId(null)
    } else {
      // setDepartments([
      //   ...departments,
      //   {
      //     id: Date.now().toString(),
      //     ...formData,
      //   },
      // ])
      await groupsService.createGroup(formData)
    }
    fetchData()
    setFormData({ name: "", code: "", commandant: "", description: "" ,parent:"",groups:[]})
    setShowForm(false)
  }


  const handleEdit = (dept: any) => {
    setFormData({
      name: dept.name,
      code: dept.code,
      commandant: dept.commandant,
      description: dept.description,
      parent:dept?.parent?.id,
      groups:dept?.group_one?.map((dt:any) => dt?.group_two?.id)
    })
    setEditId(dept.id)
    setShowForm(true)
  }

  const handleDelete = async(id: string) => {
    // setDepartments(departments.filter((d) => d.id !== id))
    console.log("goi")
    await groupsService.deleteGroup(id)
    fetchData()
  }

  const fetchData = async()=>{
    const res = await groupsService.getGroups()
    const res2 = await groupsService.getTreeGroup()
    if(res?.statusCode === 200){
      setDepartments(res?.data)
    }
    if(res2?.statusCode === 200){
      setRecordTree(res2?.data)
    }
  }

  useEffect(()=>{
    fetchData()
  },[])


  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary">Quản lý Phòng ban</h1>
          <div className="flex gap-2 items-center">
            <Button
        className={`flex-1 bg-transparent h-12  items-center`}
        style={{color:`${statusBtn ?'white':'blue'}`}}
        type="text"
        onClick={() => setStatusBtn(false)}
      >
        <CiBoxList size={16}/>
        Danh sách
      </Button>

       <Button
        className={`flex-1 bg-transparent h-12 items-center`}
         style={{color:`${statusBtn ?'blue':'white'}`}}
        type="text"
        onClick={() => setStatusBtn(true)}
      >
        <GrTreeOption size={16}/>
        Cây
      </Button>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="military-btn flex items-center gap-2">
          <Plus size={20} />
          Thêm phòng ban
        </button>
      </div>

      {showForm && (
        <div className="military-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tên phòng ban</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mã phòng</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Chỉ huy</label>
                <input
                  type="text"
                  value={formData.commandant}
                  onChange={(e) => setFormData({ ...formData, commandant: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Ban chỉ huy</label>
              <Select
                  className="w-64"
                  placeholder="Chọn ban"
                  showSearch
                  onChange={(e)=>{
                    setFormData({...formData,parent:e})
                  }}
                  value={formData.parent}
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
             <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground"
                rows={3}
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
                  setFormData({ name: "", code: "", commandant: "", description: "",parent:"",groups:[] })
                }}
                className="military-btn-secondary"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {
          !statusBtn ? <>
  {departments.map((dept) => (
          <div key={dept.id} className="military-card p-6 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-primary mb-2">{dept.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{dept.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-foreground">
                  <span className="text-muted-foreground">Mã:</span> {dept.code}
                </span>
                <span className="text-foreground">
                  <span className="text-muted-foreground">Chỉ huy:</span> {dept.commandant}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(dept)}
                className="p-2 hover:bg-primary/20 text-primary rounded transition"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(dept.id)}
                className="p-2 hover:bg-destructive/20 text-destructive rounded transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
          </>:
          <div className="bg-background/50 rounded border border-border overflow-hidden">
            <div className="p-3 border-b border-border bg-blue-500/5">
              <h3 className="text-sm font-semibold text-foreground">Cây phòng ban</h3>
            </div>
            <div className="overflow-y-auto max-h-[600px] p-2">
              {recordTree.map((node:any) => (
                <TreeNodeComponent
                  key={node.id}
                  node={node}
                  level={0}
                  searchQuery={""}
                  onSelect={()=>{}}
                  onCreateFolder={()=>{}}
                  onDelete={handleDelete}
                  onCopy={()=>{}}
                  onMove={()=>{}}
                  setFormData={setFormData}
                  setShowForm={setShowForm}
                  formData={formData}
                  // clipboardNode={}
                />
              ))}
            </div>
          </div>
        }
        
        
      </div>
    </div>
  )
}
