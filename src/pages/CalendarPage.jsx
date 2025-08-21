import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/DashboardLayout"
import { supabase } from "@/lib/supabase"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react'

// Event type configuration
const EVENT_TYPES = {
  training: {
    label: 'Training Sessions',
    color: 'bg-green-500',
    textColor: 'text-white',
    icon: '📚'
  },
  meeting: {
    label: 'Cluster Meetings', 
    color: 'bg-red-500',
    textColor: 'text-white',
    icon: '👥'
  },
  general: {
    label: 'General Events',
    color: 'bg-blue-500', 
    textColor: 'text-white',
    icon: '📅'
  },
  deadline: {
    label: 'Deadlines',
    color: 'bg-yellow-400',
    textColor: 'text-black',
    icon: '⏰'
  },
  inspection: {
    label: 'Field Inspections',
    color: 'bg-purple-500',
    textColor: 'text-white', 
    icon: '🔍'
  }
}

function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('Month') // Month, Week, Day
  
  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      
      // Get events for the current month
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', monthStart.toISOString())
        .lte('start_date', monthEnd.toISOString())
        .order('start_date', { ascending: true })

      if (error) {
        console.error("❌ Error fetching events:", error)
        return
      }

      console.log("✅ Events fetched:", data)
      setEvents(data || [])
      
    } catch (err) {
      console.error("❌ Fetch events error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start_date), date)
    )
  }

  // Get upcoming events (next 5)
  const getUpcomingEvents = () => {
    const now = new Date()
    return events
      .filter(event => new Date(event.start_date) >= now)
      .slice(0, 5)
  }

  // Navigate months
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  // Generate calendar days
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    
    // Get first day of week for month start
    const calendarStart = new Date(monthStart)
    calendarStart.setDate(calendarStart.getDate() - monthStart.getDay())
    
    // Get last day of week for month end  
    const calendarEnd = new Date(monthEnd)
    calendarEnd.setDate(calendarEnd.getDate() + (6 - monthEnd.getDay()))
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }

  const calendarDays = generateCalendarDays()
  const upcomingEvents = getUpcomingEvents()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <CalendarIcon className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Calendar</h1>
                <p className="text-gray-600">View and manage TFT events</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="bg-gray-100 rounded-lg p-1 flex">
                {['Month', 'Week', 'Day'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === mode
                        ? 'bg-green-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Calendar Navigation */}
              <div className="bg-green-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <h2 className="text-xl font-semibold">
                    {format(currentDate, 'MMMM yyyy')}
                  </h2>
                  
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-4">
                {/* Week headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                    <div key={day} className="p-3 text-center font-medium text-gray-600 text-sm">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const dayEvents = getEventsForDate(day)
                    const isCurrentMonth = isSameMonth(day, currentDate)
                    const isToday = isSameDay(day, new Date())
                    
                    return (
                      <div
                        key={index}
                        className={`min-h-[100px] p-2 border border-gray-200 hover:bg-gray-50 transition-colors ${
                          !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
                        } ${isToday ? 'ring-2 ring-green-500' : ''}`}
                      >
                        <div className={`text-sm font-medium mb-1 ${isToday ? 'text-green-600' : ''}`}>
                          {format(day, 'd')}
                        </div>
                        
                        {/* Events for this day */}
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event) => {
                            const eventType = EVENT_TYPES[event.event_type] || EVENT_TYPES.general
                            return (
                              <div
                                key={event.id}
                                className={`text-xs p-1 rounded truncate ${eventType.color} ${eventType.textColor}`}
                                title={event.title}
                              >
                                {event.title}
                              </div>
                            )
                          })}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Loading events...</div>
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">No upcoming events</div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => {
                    const eventType = EVENT_TYPES[event.event_type] || EVENT_TYPES.general
                    const eventDate = new Date(event.start_date)
                    
                    return (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="text-sm">
                              <div className="font-bold text-red-600">{format(eventDate, 'MMM')}</div>
                              <div className="text-center text-lg font-bold">{format(eventDate, 'd')}</div>
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${eventType.color} ${eventType.textColor} mb-2`}>
                              <span className="mr-1">{eventType.icon}</span>
                              {eventType.label}
                            </div>
                            
                            <h4 className="text-sm font-medium text-gray-900 mb-1">{event.title}</h4>
                            
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>{format(eventDate, 'h:mm a')} | {event.organizer || 'TFT Team'}</div>
                              {event.location && <div>📍 {event.location}</div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Event Types Legend */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Types</h3>
              <div className="space-y-3">
                {Object.entries(EVENT_TYPES).map(([key, type]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${type.color}`}></div>
                    <span className="text-sm text-gray-700">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CalendarPage