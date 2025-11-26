"use client"

import type { ScheduleEntry } from "@/lib/types"
import { getDayName, formatDate, getWeekDates } from "@/lib/schedule-utils"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store/store"

const PencilIcon = () => (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
)

const Trash2Icon = () => (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

interface ScheduleTableProps {
  weekStart: string
  schedules: ScheduleEntry[]
  onEdit: (schedule: ScheduleEntry) => void
  onDelete: (id: string) => void
}

export function ScheduleTable({ weekStart, schedules, onEdit, onDelete }: ScheduleTableProps) {
  const weekDates = getWeekDates(weekStart)
  console.log(weekDates)
  const getSchedulesForDay = (dayIndex: number, period: "morning" | "afternoon") => {
    return schedules
      .filter((s) => {
        if (new Date(s.time_start).getDay() !== dayIndex) return false
        const hour = Number.parseInt(s.time.split(":")[0])
        if (period === "morning") {
          return hour < 12
        } else {
          return hour >= 12
        }
      })
      .sort((a, b) => a.time.localeCompare(b.time))
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-border">
        <thead>
          <tr className="bg-muted">
            {weekDates.map((date, index) => (
              <th key={index} className="border border-border p-3 text-center font-semibold min-w-[140px]">
                <div className="text-sm">{getDayName(index)}</div>
                <div className="text-xs text-muted-foreground mt-1">{formatDate(date)}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7} className="bg-primary/10 border border-border p-2 text-center font-semibold text-sm">
              Buổi sáng (Trước 12:00)
            </td>
          </tr>
          <tr>
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
              const daySchedules = getSchedulesForDay(dayIndex, "morning")
              return (
                <td key={dayIndex} className="border border-border p-2 align-top min-h-[150px] bg-background">
                  <div className="space-y-2">
                    {daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="group relative p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors text-sm"
                      >
                        <div className="font-semibold text-primary mb-1">{schedule.time.substring(0, 5)}</div>
                        <div className="text-xs whitespace-pre-wrap leading-relaxed">{schedule.description}</div>
                    
                          <div className="text-xs text-muted-foreground mt-1 italic">👥{schedule?.group?.name}</div>
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onEdit(schedule)}>
                            <PencilIcon />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => onDelete(schedule.id ?? "")}
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              )
            })}
          </tr>
          <tr>
            <td colSpan={7} className="bg-primary/10 border border-border p-2 text-center font-semibold text-sm">
              Buổi chiều (Từ 12:00)
            </td>
          </tr>
          <tr>
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
              const daySchedules = getSchedulesForDay(dayIndex, "afternoon")
              return (
                <td key={dayIndex} className="border border-border p-2 align-top min-h-[150px] bg-background">
                  <div className="space-y-2">
                    {daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="group relative p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors text-sm"
                      >
                        <div className="font-semibold text-primary mb-1">{schedule.time.substring(0, 5)}</div>
                        <div className="text-xs whitespace-pre-wrap leading-relaxed">{schedule.description}</div>
                        <div className="text-xs text-muted-foreground mt-1 italic">📍{schedule?.location}</div>
                        <div className="text-xs text-muted-foreground mt-1 italic">👥{schedule?.group?.name}</div>
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onEdit(schedule)}>
                            <PencilIcon />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => onDelete(schedule.id ?? "")}
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
