"use client"
import { RiCalendarScheduleLine } from "react-icons/ri";
import { mockSchedule } from "@/lib/mock-data"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button, DatePicker, Input, Select } from "antd"
import { MapPin, Clock, Plus, Edit2, Trash2, ChevronLeftIcon, CalendarIcon, ChevronRightIcon } from "lucide-react"
import { CiBoxList } from "react-icons/ci"
import { useEffect, useState } from "react";
import { groupsService } from "@/services/groupService";
import dayjs from "dayjs";
import { schedulesService } from "@/services/scheduleService";
import { usersService } from "@/services/userService";
import { ScheduleTable } from "@/components/schedule/schedule-table";
import { ButtonUI } from "@/components/ui/buttonUI";
import { getWeekInfo } from "@/lib/schedule-utils";
export default function SchedulePage() {
   const [departments, setDepartments] = useState<any[]>([])
   const [currentDate, setCurrentDate] = useState(new Date())
   const [weekStart, setWeekStart] = useState("")
   const [showWeekPicker, setShowWeekPicker] = useState(false)
   const [optionsListUser,setOptionsListUser] = useState<any[]>([])
   const [selectedWeekDate, setSelectedWeekDate] = useState("")
   const [schedules, setSchedules] = useState<any[]>([])
  const [statusBtn,setStatusBtn] = useState<boolean>(false)
  const [showForm, setShowForm] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [groupID, setGroupId] = useState<string >()
    const [formData, setFormData] = useState({
      name: "",
      group: "",
      description: "",
      location: "",
      users:[],
       time_start:new Date(),
      time_end:new Date(),
      time:""

    })

    useEffect(() => {
    const weekInfo = getWeekInfo(currentDate)
    setWeekStart(weekInfo.weekStart)
  }, [currentDate])

    const weekInfo = getWeekInfo(currentDate)
  const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault()
      if (editId) {
        // setDepartments(departments.map((d) => (d.id === editId ? { ...d, ...formData } : d)))
        await schedulesService.updateSchedule(editId,formData)
        setEditId(null)
      } else {
        // setDepartments([
        //   ...departments,
        //   {
        //     id: Date.now().toString(),
        //     ...formData,
        //   },
        // ])
        await schedulesService.createSchedule(formData)
      }
      fetchData()
      setFormData({ 
        name: "",
      group: "",
      location: "",
      description: "",
      users:[],
       time_start:new Date(),
      time_end:new Date(),
      time:""
      })
      setShowForm(false)
    }
  
  
    const handleEdit = (dept: any) => {
      setFormData({
        name: dept.name,
        description: dept.description,
        location: dept.location,
        group:dept?.group?.id,
        time:dept?.time,
        time_start:new Date(dept?.time_start),
        time_end:new Date(dept?.time_end),
        users:dept?.users?.map((dt:any)=>dt?.user?.id) ?? [],
      })
      setEditId(dept.id)
      setShowForm(true)
    }
    const handlePreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }
   const handleSelectWeek = () => {
    if (selectedWeekDate) {
      const date = new Date(selectedWeekDate)
      setCurrentDate(date)
      setShowWeekPicker(false)
    }
  }

   const handleDeleteSchedule = async(id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa lịch trình này?")) {
      // deleteSchedule(id)
      // setSchedules(getSchedulesByWeek(weekStart))-
      await schedulesService.deleteSchedule(id)
      fetchData()
    }
  }

  const handleNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }
  const handleToday = () => {
    setCurrentDate(new Date())
  }
  
    const handleDelete = async(id: string) => {
      // setDepartments(departments.filter((d) => d.id !== id))
      console.log("goi")
      await schedulesService.deleteSchedule(id)
      fetchData()
    }
  
    const fetchData = async()=>{
      const res = await groupsService.getGroups()
    
      if(res?.statusCode === 200){
        setDepartments(res?.data)
      }

       const res2 = await schedulesService.getSchedules()
    
      if(res2?.statusCode === 200){
        setSchedules(res2?.data)
      }

      const res3 = await usersService.getUsers()

            if(res3?.statusCode === 200){
              setOptionsListUser(res3?.data)
            }
     
    }
  
    useEffect(()=>{
      fetchData()
    },[])
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">

        <h1 className="text-2xl font-bold text-primary">Lịch công tác</h1>
         <div className="flex gap-2 items-center">
            <Button
        className={`flex-1 bg-transparent h-12  items-center`}
        style={{color:`${statusBtn ?'white':'blue'}`}}
        type="text"
        onClick={() => {setStatusBtn(false)
          // setGroupID(undefined)
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
          // setGroupID(undefined)
        }}
      >
        <RiCalendarScheduleLine size={16}/>
        Lịch trình
      </Button>
          </div>
        </div>
        <button className="military-btn flex items-center gap-2"
        onClick={()=>{
          setShowForm(true)
        }}
        >
          <Plus size={20} />
          Thêm lịch trình
        </button>
      </div>
        {showForm && (
                <div className="military-card p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Tên lịch trình</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground"
                        required
                      />
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Địa điểm</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground"
                        required
                      />
                    </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                                  <div className="w-full">
                      <label className="block text-sm font-medium text-foreground mb-2">Phòng ban/Đơn vị</label>
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
                            <Select.Option key={dt.id} value={dt.id}>
                              {dt.name}
                            </Select.Option>
                          ))}
                        </Select>
                    </div>
                                  <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Thời gian</label>
                      <Input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground"
                        required
                      />
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
                          setFormData({
                            name: "",
                            group: "",
                            location: "",
                            description: "",
                            users:[],
                            time_start:new Date(),
                            time_end:new Date(),
                            time:""
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
      <div className="space-y-4">
        {
          statusBtn ? <>
            <div className="bg-card border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <ButtonUI variant="outline" onClick={handlePreviousWeek}>
              <ChevronLeftIcon />
              <span className="ml-2">Tuần trước</span>
            </ButtonUI>

            <div className="text-center">
              <div className="text-lg font-semibold">
                Tuần {weekInfo.weekNumber} - Tháng {weekInfo.month}/{weekInfo.year}
              </div>
              <div className="flex gap-2 justify-center mt-2">
                <ButtonUI variant="ghost" size="sm" onClick={handleToday}>
                  <CalendarIcon />
                  <span className="ml-2">Hôm nay</span>
                </ButtonUI>
                <ButtonUI variant="ghost" size="sm" onClick={() => setShowWeekPicker(true)}>
                  <CalendarIcon />
                  <span className="ml-2">Chọn tuần</span>
                </ButtonUI>
              </div>
            </div>

            <ButtonUI variant="outline" onClick={handleNextWeek}>
              <span className="mr-2">Tuần sau</span>
              <ChevronRightIcon />
            </ButtonUI>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-card border rounded-lg p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Lọc theo loại:</span>
              

          

           
                <div className="flex items-center gap-2">
                  <label htmlFor="filter-group" className="text-sm font-medium whitespace-nowrap">
                    Chọn nhóm:
                  </label>
                  <Select
                                    className="w-64"
                                    placeholder="Chọn ban"
                                    showSearch
                                    allowClear
                                    onChange={(e)=>{
                                      setGroupId(e)
                                    }}
                                    value={groupID}
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


              <div className="ml-auto text-sm text-muted-foreground">
                Hiển thị {schedules.length} / {schedules.length} lịch trình
              </div>
            </div>
          </div>
        </div>



        {/* Schedule Table */}
        <div className="bg-card border rounded-lg p-4">
          <ScheduleTable
            weekStart={weekStart}
            schedules={schedules}
            onEdit={handleEdit}
            onDelete={handleDeleteSchedule}
          />
        </div>
          </>:
          <>
             {schedules?.filter(dt => (dt?.group?.id === groupID || groupID === undefined)).map((event) => (
          <div key={event.id} className="military-card p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-primary">{event.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-sm">
                {new Date(event.time_start).toLocaleDateString("vi-VN")}
              </span>
                 <div className="flex gap-2">
              <button
                onClick={() => handleEdit(event)}
                className="p-2 hover:bg-primary/20 text-primary rounded transition"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="p-2 hover:bg-destructive/20 text-destructive rounded transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
              </div>
              
            </div>

            <p className="text-muted-foreground mb-4">{event.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-primary" />
                <span className="text-foreground">{event.time.substring(0, 5)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-primary" />
                <span className="text-foreground">{event?.location}</span>
              </div>
              <div className="text-sm text-muted-foreground">Phòng ban: {event?.group?.name}</div>
            </div>
          </div>
        ))}
          </>
        }
        <Dialog open={showWeekPicker} onOpenChange={setShowWeekPicker}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chọn tuần</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="week-date">Chọn ngày trong tuần</label>
                <Input
                  id="week-date"
                  type="date"
                  value={selectedWeekDate}
                  onChange={(e) => setSelectedWeekDate(e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">Chọn bất kỳ ngày nào trong tuần bạn muốn xem</p>
              </div>
              <div className="flex gap-2 justify-end">
                <ButtonUI variant="outline" onClick={() => setShowWeekPicker(false)}>
                  Hủy
                </ButtonUI>
                <Button onClick={handleSelectWeek}>Xác nhận</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
