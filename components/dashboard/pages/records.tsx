"use client"

import { createElement, useEffect, useRef, useState } from "react"
import type { RecordNode } from "@/lib/types"
// import { mockRecordTree } from "@/lib/mock-data"
import { IoClose } from "react-icons/io5";
import { Button, Dropdown, Modal, Select } from "antd"
import { CiBoxList } from "react-icons/ci"
import { IoMdAdd } from "react-icons/io"
import { worksService } from "@/services/workService"
import { groupsService } from "@/services/groupService"
import { usersService } from "@/services/userService"
import { FaCheck, FaCloudUploadAlt, FaFolderPlus } from "react-icons/fa";
import { MdDeleteForever, MdEdit, MdOutlineDriveFolderUpload, MdOutlineFileDownload, MdOutlineFileUpload } from "react-icons/md"
import { documentsService } from "@/services/documentService"
import CustomFormData from "@/utils/CustomFormData"
import { foldersService } from "@/services/folderService"
interface TreeNodeProps {
  node: RecordNode
  level: number
  searchQuery: string
  onSelect: (node: RecordNode) => void
  onCreateFolder: (parentId: string) => void
  onDelete: (nodeId: string) => void
  onCopy: (node: RecordNode) => void
  onMove: (nodeId: string, targetParentId: string) => void
  clipboardNode: RecordNode | null
}

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
  handleUpload,
  setGroupID,
  groupID
  // clipboardNode,
}: any) {
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
        setGroupID(node?.id)
      }}>
        <CiBoxList />
        <span>Danh sách tài liệu</span>
        
      </div>
    ),
    key: '0',
  }
  ,
  {
    label: (
       <div className="cursor-pointer flex items-center" onClick={()=>{
        // onDelete(node.id)
        
        setGroupID(node?.id)
        handleUpload()
      }}>
        <IoMdAdd />
        <span>Thêm tài liệu</span>
        
      </div>
    ),
    key: '1',
  }
]}} trigger={['contextMenu']}>
  <div
        className={`flex items-center gap-2 px-2 py-2 ${node.id === groupID  ?'bg-blue-500/10':'hover:bg-blue-500/10'} rounded cursor-pointer group relative`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onContextMenu={(e)=>{e.preventDefault()}}
        onClick={() => {

          if (isFolder) setIsExpanded(!isExpanded)
          {
            onSelect(node)
          }
          
        }}
        onDoubleClick={() => {

          if (isFolder) setIsExpanded(!isExpanded)
          {
            setGroupID(node.id)
          }
          
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
          {groupID === node.id ?  <span className="text-lg">📂</span>: isFolder ? <span className="text-lg">📁</span> : <span className="text-lg">📄</span>}
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
              handleUpload={handleUpload}
              setFormData={setFormData}
              formData={formData}
              setGroupID={setGroupID}
              groupID={groupID}
              // clipboardNode={clipboardNode}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CreateFolderDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreateFolder: (name: string, description: string) => void
  parentFolderName: string
}

function CreateFolderDialog({ isOpen, onClose, onCreateFolder, parentFolderName }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("")
  const [folderDescription, setFolderDescription] = useState("")
 
  const handleSubmit = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName, folderDescription)
      setFolderName("")
      setFolderDescription("")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-blue-500/30 rounded-sm w-full max-w-md p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Tạo thư mục mới</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-500/10 rounded transition-colors text-muted-foreground"
          >
            ✕
          </button>
        </div>

        <div className="bg-blue-500/5 p-3 rounded border border-blue-500/20">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Vị trí</p>
          <p className="text-sm font-semibold text-foreground mt-1">{parentFolderName}</p>
        </div>

        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">
            Tên thư mục <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Nhập tên thư mục..."
            className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">Mô tả</label>
          <textarea
            value={folderDescription}
            onChange={(e) => setFolderDescription(e.target.value)}
            placeholder="Nhập mô tả (tùy chọn)..."
            className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 resize-none h-20"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-background border border-border rounded-sm text-foreground hover:bg-background/80 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={!folderName.trim()}
            className="flex-1 px-4 py-2 military-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tạo thư mục
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RecordsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const refUpload = useRef<any>(undefined)
  const [selectedRecord, setSelectedRecord] = useState<RecordNode | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  const [selectedParentName, setSelectedParentName] = useState("")
  const [recordTree, setRecordTree] = useState<any>([])
  const [departments, setDepartments] = useState<any>([])
  const [clipboardNode, setClipboardNode] = useState<RecordNode | null>(null) // added clipboard state
  const [statusBtn,setStatusBtn] = useState<boolean>(false)
      const [editId, setEditId] = useState<string>("")
      const [groupID, setGroupId] = useState<string >()
      const [folderID, setFolderID] = useState<string >()
      const [formData, setFormData] = useState({
        name: "",
        group: "",
        description: "",
        link: "",
        user:"",
        urgent:false
  
      })
      const [formDataFolder, setFormDataFolder] = useState({
        name: "",
        group: "",
        groups: [],
        urgent:false
  
      })
  const handleCreateFolder = (parentId: string | null) => {
    if (parentId) {
      const findParent = (nodes: RecordNode[]): RecordNode | null => {
        for (const node of nodes) {
          if (node.id === parentId) return node
          if (node.children) {
            const found = findParent(node.children)
            if (found) return found
          }
        }
        return null
      }

      const parent = findParent(recordTree)
      if (parent) {
        setSelectedParentId(parentId)
        setSelectedParentName(parent.name)
        setIsCreateDialogOpen(true)
      }
    }
  }

  const handleFolderCreated = (name: string, description: string) => {
    if (!selectedParentId) return

    const newFolder: RecordNode = {
      id: `folder-${Date.now()}`,
      name,
      type: "folder",
      children: [],
      description,
      createdAt: new Date(),
    }

    const updateTree = (nodes: RecordNode[]): RecordNode[] => {
      return nodes.map((node) => {
        if (node.id === selectedParentId) {
          return {
            ...node,
            children: [...(node.children || []), newFolder],
          }
        }
        if (node.children) {
          return {
            ...node,
            children: updateTree(node.children),
          }
        }
        return node
      })
    }

    setRecordTree(updateTree(recordTree))
    setSelectedParentId(null)
    setSelectedParentName("")
  }

  const handleDelete = (nodeId: string) => {
    const deleteNode = (nodes: RecordNode[]): RecordNode[] => {
      return nodes
        .filter((node) => node.id !== nodeId)
        .map((node) => ({
          ...node,
          children: node.children ? deleteNode(node.children) : undefined,
        }))
    }

    setRecordTree(deleteNode(recordTree))
    if (selectedRecord?.id === nodeId) {
      setSelectedRecord(null)
    }
  }

  const handleUpload = ()=>{
    refUpload?.current?.click()
  }

  const handleCopy = (node: RecordNode) => {
    setClipboardNode(node)
  }

  const handleMove = (nodeId: string, targetParentId: string) => {
    const moveNode = (nodes: RecordNode[]): RecordNode[] => {
      const result: RecordNode[] = []

      for (const node of nodes) {
        if (node.id === nodeId) {
          // Skip the node being moved at this level
          continue
        }

        if (node.id === targetParentId) {
          // Found target parent, add node to its children
          const nodeToMove = findNodeById(recordTree, nodeId)
          if (nodeToMove && node.type === "folder") {
            result.push({
              ...node,
              children: [...(node.children || []), { ...nodeToMove }],
            })
          } else {
            result.push(node)
          }
        } else {
          // Recursively process children
          result.push({
            ...node,
            children: node.children ? moveNode(node.children) : undefined,
          })
        }
      }

      return result
    }

    setRecordTree(moveNode(recordTree))
    setClipboardNode(null)
  }

  const findNodeById = (nodes: RecordNode[], id: string): RecordNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = findNodeById(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  const fetchData = async()=>{
          const res2 = await groupsService.getGroups()
           const res4 = await groupsService.getTreeGroup()
              if(res4?.statusCode === 200){
                setRecordTree(res4?.data)
              }
          // if(res?.statusCode === 200){
          //   setTasks(res?.data)
          // }
          if(res2?.statusCode === 200){
            setDepartments(res2?.data)
          }
          // if(res3?.statusCode === 200){
          //   setOptionsListUser(res3?.data)
          // }
  }

  useEffect(()=>{
    fetchData()
  },[])


  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [btnInput,setBtnInput] = useState<boolean>(false)
  const refInput = useRef<any>(undefined)

  const handleFileUpload = async(e:any) => {
    const uploaded = Array.from(e.target.files) as any;
    if(uploaded.length > 0){
      const res = await documentsService.createDocument(CustomFormData({links:uploaded,group:groupID,folder:folderID}))
      if(res?.statusCode === 201){
        fetchFiles()
      }
    }
    // setFiles((prev:any) => [...prev, ...uploaded]);
  };
  const handleAddFolder = async()=>{
    const res = await foldersService.createFolder({...formDataFolder,group:groupID})
    if(res?.statusCode === 201){
      fetchFolders()
      setBtnInput(false)
      setFormDataFolder({
        name: "",
        group: "",
        groups: [],
        urgent:false
      })
    }
  }
  const handleUpdateFolder = async()=>{
    const res = await foldersService.updateFolder(editId,{...formDataFolder})
    if(res?.statusCode === 200){
      fetchFolders()
      setEditId("")
      // setBtnInput(false)
      setFormDataFolder({
        name: "",
        group: "",
        groups: [],
        urgent:false
      })
    }
  }

  const removeFile = async(id:any) => {
    // setFiles((prev) => prev.filter((_, i) => i !== index));
    const res = await documentsService.deleteDocument(id)
    if(res?.statusCode === 200){
      fetchFiles()
    }
  };

   const removeFolder= async(id:any) => {
    // setFiles((prev) => prev.filter((_, i) => i !== index));
    const res = await foldersService.deleteFolder(id)
    if(res?.statusCode === 200){
      fetchFolders()
    }
  };

  const getFileIcon = (filename:any) => {
    const ext = filename.split(".").pop().toLowerCase();

    const icons = {
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      xls: "📊",
      xlsx: "📊",
      ppt: "📑",
      pptx: "📑",
      zip: "🗜️",
      rar: "🗜️",
    };

    return icons?.[ext as keyof typeof icons] || "📁";
  };
  const fetchFiles = async()=>{
     const res = await documentsService.getDocuments({folder:folderID})
     if(res?.statusCode === 200){
      setFiles(res?.data)
     }

  }

  const fetchFolders = async()=>{

     const res2 = await foldersService.getFolders({group:groupID})
     if(res2?.statusCode === 200){
      setFolders(res2?.data)
     }
  }

    useEffect(()=>{
      if(groupID){
        fetchFolders()
      }
    },[groupID])

    useEffect(()=>{
      if(folderID){
        fetchFiles()
      }
    },[folderID])

    useEffect(()=>{
      console.log(formDataFolder)
    },[formDataFolder])
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">Sổ sách</h1>
        {/* <button className="military-btn flex items-center gap-2" onClick={() => handleCreateFolder(null)}>
          <span>+</span>
          Thêm sổ sách
        </button> */}
      </div>

      <div className="relative">
        <span className="absolute left-3 top-3 text-muted-foreground">🔍</span>
        <input
          type="text"
          placeholder="Tìm kiếm sổ sách..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={` military-card p-4 ${folderID ?'lg:col-span-1': groupID?'lg:col-span-2':'lg:col-span-3'}`}>
          <div className="bg-background/50 rounded border border-border overflow-hidden">
            <div className="p-3 border-b border-border bg-blue-500/5">
              <h3 className="text-sm font-semibold text-foreground">Cây thư mục</h3>
            </div>
            <div className="overflow-y-auto max-h-[600px] p-2">
              {recordTree.map((node:any) => (
                <TreeNodeComponent
                  key={node.id}
                  node={node}
                  level={0}
                  searchQuery={searchQuery}
                  onSelect={setSelectedRecord}
                  onCreateFolder={handleCreateFolder}
                  onDelete={handleDelete}
                  onCopy={handleCopy}
                  onMove={handleMove}
                  setFormData={setFormData}
                  formData={formData}
                  handleUpload={handleUpload}
                  setGroupID={setGroupId}
                  groupID={groupID}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="military-card p-4" hidden={groupID?false:true}>
          <div className="bg-background/50 rounded border border-border">
      <div className="p-3 border-b border-border bg-blue-500/5">
      <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-foreground">Chi tiết danh sách</h3>
            <Button type="link" icon={<FaFolderPlus size={24}/>} onClick={()=>{
              // refUpload.current.click()
              // refInput.current.focus()
              setBtnInput(true)
            }} hidden={btnInput}/>

           
            {/* <div className="flex items-center bg-white overflow-hidden rounded-md p-1" hidden={!btnInput}>
              <input className="outline-hidden bg-transparent text-black" type="text" ref={refInput} value={inputFolder}
              onKeyDown={(e) => {
              if (e.key === "Enter") {
                // xử lý Enter ở đây
              }
            }}
               onChange={(e)=>{setInputFolder(e.target.value)}}/>
              <Button type="link" icon={<FaCheck />}/>
              <Button type="link" icon={<IoClose />} onClick={()=>{
                setBtnInput(false)
                setInputFolder("")
              }}/>
            </div> */}
            {/* <input
              ref={refUpload}
              hidden
              type="file"
              multiple
              className="
                block w-full text-sm text-foreground 
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
              "
              onChange={handleFileUpload}
            /> */}
      </div>
        
      </div>

      <div className="p-4 space-y-4">
        
        
        <div>

          <ul className="space-y-2 max-h-[600px] overflow-y-auto overflow-x-hidden">
            {folders.length === 0 && (
              <li className="text-sm text-muted-foreground">
                Chưa có tệp nào.
              </li>
            )}
          
            {/* {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 border rounded bg-background"
              
              >
                <div className="flex items-center gap-2">
                  <div className="text-lg">{getFileIcon(file.name)}</div>

                  <div>
                    <span className="text-sm cursor-pointer hover:underline w-72 block wrap-break-word" onClick={()=>{
                      const link = document.createElement("a");
                    link.href = file?.link;
                    link.click();
                    }}>{file.name}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                  icon={<MdOutlineFileDownload size={24} color="blue"/>}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = file?.link;
                    link.click();
                
                  }}
                  
                  type="link"
                  className="text-red-500 hover:text-red-700 text-sm"
                />
                
                 <Button
                  icon={<MdDeleteForever size={24} color="red"/>}
                  onClick={() => removeFile(file?.id)}
                  type="link"
                  className="text-red-500 hover:text-red-700 text-sm"
                />
                </div>
               
              </li>
            ))} */}
             {folders.map((file, index) => (
              <li
                key={index}
                className={`flex items-center justify-between p-2 border rounded ${file.id === folderID  ?'bg-blue-500/10':'hover:bg-blue-500/10 bg-background'}`}
              
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="text-lg"><span>📁</span></div>

                  <div>
                    <span className="text-sm w-72 block wrap-break-word" onClick={()=>{
                      setFolderID(file?.id)
                    //   const link = document.createElement("a");
                    // link.href = file?.link;
                    // link.click();
                    }}>{file.name}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                  icon={<MdEdit size={24} color="blue"/>}
                  onClick={() => {
                    
                    setFormDataFolder({...formDataFolder,name:file?.name,groups:file?.groups?.map((dt:any) => dt?.group?.id)})
                    // setBtnInput(true)
                    setEditId(file?.id)
                  }}
                  
                  type="link"
                  className="text-red-500 hover:text-red-700 text-sm"
                />
                
                 <Button
                  icon={<MdDeleteForever size={24} color="red"/>}
                  onClick={() => removeFolder(file?.id)}
                  type="link"
                  className="text-red-500 hover:text-red-700 text-sm"
                />
                </div>
               
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
        </div>
        <div className="military-card p-4" hidden={folderID?false:true}>
          <div className="bg-background/50 rounded border border-border">
      <div className="p-3 border-b border-border bg-blue-500/5">
      <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-foreground">Chi tiết tài liệu</h3>
            <Button type="link" icon={<MdOutlineFileUpload size={24}/>} onClick={()=>{
              refUpload.current.click()
              // refInput.current.focus()
              // setBtnInput(true)
            }} hidden={btnInput}/>

           
            {/* <div className="flex items-center bg-white overflow-hidden rounded-md p-1" hidden={!btnInput}>
              <input className="outline-hidden bg-transparent text-black" type="text" ref={refInput} value={inputFolder}
              onKeyDown={(e) => {
              if (e.key === "Enter") {
                // xử lý Enter ở đây
              }
            }}
               onChange={(e)=>{setInputFolder(e.target.value)}}/>
              <Button type="link" icon={<FaCheck />}/>
              <Button type="link" icon={<IoClose />} onClick={()=>{
                setBtnInput(false)
                setInputFolder("")
              }}/>
            </div> */}
            <input
              ref={refUpload}
              hidden
              type="file"
              multiple
              className="
                block w-full text-sm text-foreground 
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
              "
              onChange={handleFileUpload}
            />
      </div>
        
      </div>

      <div className="p-4 space-y-4">
        
        
        <div>

          <ul className="space-y-2 max-h-[600px] overflow-y-auto overflow-x-hidden">
            {folders.length === 0 && (
              <li className="text-sm text-muted-foreground">
                Chưa có tài liệu nào.
              </li>
            )}
          
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 border rounded bg-background"
              
              >
                <div className="flex items-center gap-2">
                  <div className="text-lg">{getFileIcon(file.name)}</div>

                  <div>
                    <span className="text-sm cursor-pointer hover:underline w-72 block wrap-break-word" onClick={()=>{
                      const link = document.createElement("a");
                    link.href = file?.link;
                    link.click();
                    }}>{file.name}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                  icon={<MdOutlineFileDownload size={24} color="blue"/>}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = file?.link;
                    link.click();
                
                  }}
                  
                  type="link"
                  className="text-red-500 hover:text-red-700 text-sm"
                />
                
                 <Button
                  icon={<MdDeleteForever size={24} color="red"/>}
                  onClick={() => removeFile(file?.id)}
                  type="link"
                  className="text-red-500 hover:text-red-700 text-sm"
                />
                </div>
               
              </li>
            ))}
            
          </ul>
        </div>
      </div>
    </div>
        </div>
      </div>

      <CreateFolderDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false)
          setSelectedParentId(null)
          setSelectedParentName("")
        }}
        onCreateFolder={handleFolderCreated}
        parentFolderName={selectedParentName}
      />
       <Modal
              title="Thêm tệp"
              closable={{ 'aria-label': 'Custom Close Button' }}
              open={btnInput}
              onOk={handleAddFolder}
              onCancel={()=>{setBtnInput(false)
              }}
            >
              <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên công việc</label>
              <input
                type="text"
                value={formDataFolder.name}
                onChange={(e) => setFormDataFolder({ ...formDataFolder, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-sm"
                required
              />
            </div>
            {/* <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phòng ban</label>
                <Select
                  className="w-full min-h-9"
                  placeholder="Chọn ban"
                  showSearch
                  onChange={(e)=>{
                    setFormDataFolder({...formDataFolder,group:e})
                  }}
                  value={formDataFolder.group}
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                   {departments?.map((dt:any) => (
                    <Select.Option key={dt.id} value={dt.id}>
                      {dt.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div> */}
            <div>
              <label className="block text-sm font-medium mb-2">Ban theo dõi</label>
              <Select
                    mode="multiple"
                    allowClear
                    maxTagCount={"responsive"}
                    style={{ width: "320px" }}
                    value={formDataFolder.groups}
                    placeholder="Vui lòng chọn danh sách"
                    onChange={(e) => {
                      console.log(e)
                      setFormDataFolder({...formDataFolder,groups:e});
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
            
          
          </form>
            </Modal>
            <Modal
              title="Chỉnh sửa tệp"
              closable={{ 'aria-label': 'Custom Close Button' }}
              open={!(editId === "")}
              onOk={handleUpdateFolder}
              onCancel={()=>{setEditId("")
              }}
            >
              <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên tệp</label>
              <input
                type="text"
                value={formDataFolder.name}
                onChange={(e) => setFormDataFolder({ ...formDataFolder, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-sm"
                required
              />
            </div>
        
            <div>
              <label className="block text-sm font-medium mb-2">Ban theo dõi</label>
              <Select
                    mode="multiple"
                    allowClear
                    maxTagCount={"responsive"}
                    style={{ width: "320px" }}
                    value={formDataFolder.groups}
                    placeholder="Vui lòng chọn danh sách"
                    onChange={(e) => {
                      setFormDataFolder({...formDataFolder,groups:e});
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
            
          
          </form>
            </Modal>
    </div>
  )
}
