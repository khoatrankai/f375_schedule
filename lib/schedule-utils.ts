import type { WeekInfo } from "./types"

export function getWeekInfo(date: Date): WeekInfo {
  const currentDate = new Date(date)

  // Get the Monday of the current week
  const day = currentDate.getDay()
  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(currentDate.setDate(diff))
  monday.setHours(0, 0, 0, 0)

  // Calculate week number
  const startOfYear = new Date(monday.getFullYear(), 0, 1)
  const days = Math.floor((monday.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)
if (isNaN(monday.getTime())) {
    console.error("Invalid date passed to getWeekInfo:", date)
    return {
      weekNumber: 0,
      month: 0,
      year: 0,
      weekStart: "",
    }
  }
  return {
    weekNumber,
    month: monday.getMonth() + 1,
    year: monday.getFullYear(),
    weekStart: monday.toISOString(),
  }
}

export function getWeekDates(weekStart: string): Date[] {
  console.log(weekStart)
  const monday = new Date(weekStart)
  const dates: Date[] = []

  // Start from Sunday (day before Monday)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() - 1)

  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday)
    date.setDate(sunday.getDate() + i)
    dates.push(date)
  }

  return dates
}

export function formatDate(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}`
}

export function getDayName(dayIndex: number): string {
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]
  return days[dayIndex]
}

export function getScheduleTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    individual: "Cá nhân",
    group: "Nhóm",
    all: "Tất cả",
  }
  return labels[type] || type
}
