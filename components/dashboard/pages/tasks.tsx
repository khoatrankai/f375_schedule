"use client"

import { useEffect, useState } from "react"
import { mockTasks } from "@/lib/mock-data"
import type { RecordNode, Task } from "@/lib/types"
import { Plus, CheckCircle2, Circle, Edit2, Trash2 } from "lucide-react"
import { Button, DatePicker, Dropdown, Radio, Select } from "antd"
import { groupsService } from "@/services/groupService"
import { usersService } from "@/services/userService"
import { Option } from "antd/es/mentions"
import dayjs from "dayjs";
import moment from "moment";
import { worksService } from "@/services/workService"
import { MdDelete } from "react-icons/md"
import { IoMdAdd } from "react-icons/io"
import { CiBoxList } from "react-icons/ci"
import { GrTreeOption } from "react-icons/gr"
const {RangePicker} = DatePicker
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
  setShowForm,
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
        <span>Danh sách công việc</span>
        
      </div>
    ),
    key: '0',
  }
  ,
  {
    label: (
       <div className="cursor-pointer flex items-center" onClick={()=>{
        // onDelete(node.id)
        setShowForm(true)
      }}>
        <IoMdAdd />
        <span>Thêm công việc</span>
        
      </div>
    ),
    key: '1',
  }
]}} trigger={['contextMenu']}>
  <div
        className={`flex items-center gap-2 px-2 py-2 ${node.id === groupID ?'bg-blue-500/10':'hover:bg-blue-500/10'} rounded cursor-pointer group relative`}
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
              setShowForm={setShowForm}
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
export default function TaskPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFirst, setTimeFirst] = useState<number | undefined>(
    new Date("2024-12-01").getTime()
  );
  const [timeEnd, setTimeEnd] = useState<number | undefined>(
    new Date("2024-12-31").getTime()
  );
  const [typeTime, setTypeTime] = useState< "date"|"week" | "month"|"quarter" | "year">("year");
  const [groupID,setGroupID] = useState<string>()
  const [recordTree,setRecordTree] = useState<RecordNode[]>([])
  const [statusBtn,setStatusBtn] = useState<boolean>(false)
  const [optionsListUser,setOptionsListUser] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [filter, setFilter] = useState<"all" | "waitting" | "process" | "completed">("all")
    const [showForm, setShowForm] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
      name: "",
      commandant: "",
      description: "",
      group:"",
      status:"waitting",
      urgent:false,
      time_start:new Date(),
      time_end:new Date(),
      users:[]

    })

  const filteredTasks = tasks.filter((task) => filter === "all" || task.status === filter)

  const toggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const statuses: Array<Task["status"]> = ["pending", "in-progress", "completed"]
          const current = statuses.indexOf(task.status)
          const next = statuses[(current + 1) % statuses.length]
          return { ...task, status: next }
        }
        return task
      }),
    )
  }
  const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault()
      if (editId) {
        // setDepartments(departments.map((d) => (d.id === editId ? { ...d, ...formData } : d)))
        await worksService.updateWork(editId,formData)
        setEditId(null)
      } else {
        // setDepartments([
        //   ...departments,
        //   {
        //     id: Date.now().toString(),
        //     ...formData,
        //   },
        // ])
        await worksService.createWork(formData)
      }
      fetchData()
      setFormData({  name: "",
      commandant: "",
      description: "",
      group:"",
      status:"waitting",
      urgent:false,
      time_start:new Date(),
      time_end:new Date(),
      users:[]})
      setShowForm(false)
    }
  
  
    // const handleEdit = (dept: any) => {
    //   setFormData({
    //     name: dept.name,
    //     code: dept.code,
    //     commandant: dept.commandant,
    //     description: dept.description,
    //     parent:dept?.parent?.id
    //   })
    //   setEditId(dept.id)
    //   setShowForm(true)
    // }

  const handleEdit = (dept: any) => {
      setFormData({
        name: dept.name,
        group:dept?.group?.id,
        status:dept?.status,
        time_start:new Date(dept?.time_start),
        time_end:new Date(dept?.time_end),
        urgent:dept?.urgent,
        users:dept?.users?.map((dt:any)=>dt?.user?.id) ?? [],
        commandant: dept.commandant,
        description: dept.description
      })
      setEditId(dept.id)
      setShowForm(true)
    }
  
    const handleDelete = async(id: string) => {
      // setDepartments(departments.filter((d) => d.id !== id))
      await worksService.deleteWork(id)
      fetchData()
    }

  const fetchData = async()=>{
      const res = await worksService.getWorks({group:groupID})
      const res2 = await groupsService.getGroups()
      const res3 = await usersService.getUsers()
       const res4 = await groupsService.getTreeGroup()
          if(res4?.statusCode === 200){
            setRecordTree(res4?.data)
          }
      if(res?.statusCode === 200){
        setTasks(res?.data)
      }
      if(res2?.statusCode === 200){
        setDepartments(res2?.data)
      }
      if(res3?.statusCode === 200){
        setOptionsListUser(res3?.data)
      }
    }

  useEffect(()=>{
      fetchData()
    },[groupID])
useEffect(()=>{
      console.log(timeFirst,timeEnd)
    },[timeFirst,timeEnd])
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">

        <h1 className="text-2xl font-bold text-primary">Quản lý Công việc</h1>
         <div className="flex gap-2 items-center">
            <Button
        className={`flex-1 bg-transparent h-12  items-center`}
        style={{color:`${statusBtn ?'white':'blue'}`}}
        type="text"
        onClick={() => {setStatusBtn(false)
          setGroupID(undefined)
        }}
      >
        <CiBoxList size={16}/>
        Danh sách
      </Button>

       <Button
        className={`flex-1 bg-transparent h-12 items-center`}
         style={{color:`${statusBtn ?'blue':'white'}`}}
        type="text"
        onClick={() => {setStatusBtn(true) 
          setGroupID(undefined)}}
      >
        <GrTreeOption size={16}/>
        Cây
      </Button>
          </div>
        </div>
        <button className="military-btn flex items-center gap-2"
        onClick={()=>{
          setShowForm(true)
        }}
        >
          <Plus size={20} />
          Thêm công việc
        </button>
      </div>
       {showForm && (
        <div className="military-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tên công việc</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phòng ban</label>
                <Select
                  className="w-full min-h-9"
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
                    <Select.Option key={dt.id} value={dt.id}>
                      {dt.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Trạng thái</label>
                <Select
                  className="w-full min-h-9"
                  placeholder="Chọn trạng thái"
                  showSearch
                  onChange={(e)=>{
                    setFormData({...formData,status:e})
                  }}
                  value={formData.status}
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                 
                    <Option key={'waitting'} value={'waitting'}>
                      Đang chờ
                    </Option>
                 <Option key={'process'} value={'process'}>
                      Đang thực hiện
                    </Option>
                    <Option key={'delete'} value={'delete'}>
                      Đã xóa
                    </Option>
                    <Option key={'completed'} value={'completed'}>
                      Hoàn thành
                    </Option>
                </Select>
              </div>
            </div>
                  <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ngày bắt đầu</label>
                <DatePicker
                  value={formData?.time_start ? dayjs(formData.time_start) : undefined}
  onChange={(val) => setFormData({...formData, time_start: new Date(val?.toISOString())})}
                  placeholder="Chọn ngày bắt đầu"
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ngày kết thúc</label>
                 <DatePicker
                  value={formData?.time_end ? dayjs(formData.time_end) : undefined}
  onChange={(val) => setFormData({...formData, time_end: new Date(val?.toISOString())})}
                  placeholder="Chọn ngày kết thúc"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Người thực hiện</label>
              <Select
                    mode="multiple"
                    allowClear
                    maxTagCount={"responsive"}
                    style={{ width: "320px" }}
                    value={formData.users}
                    placeholder="Vui lòng chọn danh sách"
                    onChange={(e) => {
                      setFormData({...formData,users:e});
                    }}
                    options={optionsListUser?.map((user) => ({
                      label: (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div>
                            <strong>{user.name}</strong>
                            <div style={{ fontSize: "12px", color: "gray" }}>{user?.group?.code}</div>
                          </div>
                        </div>
                      ),
                      value: user.id,
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
                  // setFormData({ name: "", code: "", commandant: "", description: "",group:"" })
                }}
                className="military-btn-secondary"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="flex w-full items-center justify-between">

      <div className="flex gap-2 flex-wrap">
        {["all", "waitting", "process", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as "all" | "waitting" | "process" | "completed")}
            className={`px-4 py-2 rounded-sm transition-colors ${
              filter === status
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {status === "all"
              ? "Tất cả"
              : status === "waitting"
                ? "Chờ xử lý"
                : status === "process"
                  ? "Đang làm"
                  : "Hoàn thành"}
          </button>
        ))}
      </div>
      <div className="flex gap-2 items-center flex-wrap">
          <div className="bg-black">
            <Radio.Group
              className="bg-black"
              optionType="button"
              value={typeTime}
              buttonStyle="solid"
              onChange={(e) => {
                setTypeTime(e.target.value);
              }}
            >
              <Radio.Button value="date">Ngày</Radio.Button>
              <Radio.Button value="week">Tuần</Radio.Button>
              <Radio.Button value="month">Tháng</Radio.Button>
              <Radio.Button value="quarter">Quý</Radio.Button>
              <Radio.Button value="year">Năm</Radio.Button>
            </Radio.Group>
          </div>
           <RangePicker
            className="sm:w-auto w-full"
            picker={typeTime}
            value={[
              timeFirst ? dayjs(timeFirst) : undefined,
              timeEnd ? dayjs(timeEnd) : undefined,
            ]}
            onChange={(e, values) => {
              if (values[0] === "" || values[1] === "") {
                setTimeEnd(undefined);
                setTimeFirst(undefined);
              } else {
                if (typeTime === "year") {
                  setTimeFirst(new Date(values[0]).getTime());
                  setTimeEnd(new Date(`${values[1]}-12-31`).getTime());
                }
                if (typeTime === "month") {
                  setTimeFirst(new Date(`${values[0]}-01`).getTime());
                  setTimeEnd(
                    new Date(
                      `${moment(
                        new Date(
                          `${e?.[1]?.year()}-${(e?.[1]?.month() ?? 0) + 2}-01`
                        )
                      )
                        .clone()
                        .subtract(1, "days")}`
                    ).getTime()
                  );
                }
                if (typeTime === "quarter") {
                  if (values[0] !== "") {
                    const dataStart = values[0].replace("Q", "").split("-");
                    const dataEnd = values[1].replace("Q", "").split("-");
                    const startQuarter = new Date(
                      Number(dataStart[0]),
                      (Number(dataStart[1]) - 1) * 3,
                      1
                    );
                    const endQuarter = new Date(
                      Number(dataEnd[0]),
                      (Number(dataEnd[1]) - 1) * 3 + 3,
                      0,
                      23,
                      59,
                      59,
                      59
                    );
                    setTimeFirst(startQuarter.getTime());
                    setTimeEnd(endQuarter.getTime());
                  }
                }
                if (typeTime === "date") {
      setTimeFirst(new Date(values[0]).getTime());
      setTimeEnd(new Date(values[1]).getTime());
                }
                if (typeTime === "week") {
  if (e?.[0] && e?.[1]) {
    const weekStart = e[0].startOf("week").toDate().getTime();
    const weekEnd = e[1].endOf("week").toDate().getTime();

    setTimeFirst(weekStart);
    setTimeEnd(weekEnd);
  }
}
              }
            }}
            // value={}
          />
         
        </div>
      </div>
        {
          statusBtn ?
          <>
          <div className="relative">
        <span className="absolute left-3 top-3 text-muted-foreground">🔍</span>
        <input
          type="text"
          placeholder="Tìm kiếm phòng ban..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={` military-card p-4 ${groupID?'lg:col-span-2':'lg:col-span-3'}`}>
          <div className="bg-background/50 rounded border border-border overflow-hidden">
            <div className="p-3 border-b border-border bg-blue-500/5">
              <h3 className="text-sm font-semibold text-foreground">Cây thư mục</h3>
            </div>
            <div className="overflow-y-auto max-h-[600px] p-2">
              {recordTree.map((node) => (
                <TreeNodeComponent
                  key={node.id}
                  node={node}
                  level={0}
                  searchQuery={searchQuery}
                  onSelect={()=>{}}
                  onCreateFolder={()=>{}}
                  onDelete={handleDelete}
                  onCopy={()=>{}}
                  onMove={()=>{}}
                  setFormData={setFormData}
                  setShowForm={setShowForm}
                  formData={formData}
                  setGroupID={setGroupID}
                  groupID={groupID}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="military-card p-4" hidden={groupID?false:true}>
          <div className="bg-background/50 rounded border border-border">
            <div className="p-3 border-b border-border bg-blue-500/5">
              <h3 className="text-sm font-semibold text-foreground">Công việc phòng ban</h3>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto max-h-[600px]">
              {
                filteredTasks?.length > 0 ? 
                <>
                {filteredTasks.map((task) => (
          <div key={task.id} className="military-card p-4 flex items-start gap-4">

            <div className="flex-1">
              <h3
                className={`font-semibold ${
                  task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"
                }`}
              >
                {task.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              <div className="flex gap-3 mt-3 flex-wrap">
                <span className="text-xs text-muted-foreground">Hạn: {new Date(task.time_end).toLocaleDateString("vi-VN")}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-sm ${
                    task.urgent
                      ? "bg-destructive/20 text-destructive"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {task.urgent ? "Cao" : "Thấp"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(task)}
                className="p-2 hover:bg-primary/20 text-primary rounded transition"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="p-2 hover:bg-destructive/20 text-destructive rounded transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
     
          </div>
        ))}
                </>:
                <div className="text-center py-8">
                  <div className="p-3 bg-blue-500/10 rounded-full w-fit mx-auto mb-3">
                    <span className="text-3xl">📚</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Không có công việc</p>
                </div>
              }
               
            </div>
          </div>
        </div>
      </div>

          </>
      :
 <div className="space-y-3 overflow-y-auto max-h-[700px]">
        {filteredTasks.map((task) => (
          <div key={task.id} className="military-card p-4 flex items-start gap-4">

            <div className="flex-1">
              <h3
                className={`font-semibold ${
                  task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"
                }`}
              >
                {task.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              <div className="flex gap-3 mt-3 flex-wrap">
                <span className="text-xs text-muted-foreground">Hạn: {new Date(task.time_end).toLocaleDateString("vi-VN")}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-sm ${
                    task.urgent
                      ? "bg-destructive/20 text-destructive"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {task.urgent ? "Cao" : "Thấp"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(task)}
                className="p-2 hover:bg-primary/20 text-primary rounded transition"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="p-2 hover:bg-destructive/20 text-destructive rounded transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
     
          </div>
        ))}
      </div>
        }
     
    </div>
  )
}
