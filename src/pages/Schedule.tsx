import { useState } from "react";
import { KIITUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Target,
} from "lucide-react";

interface ScheduleProps {
  currentUser: KIITUser | null;
}

interface ScheduleItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  type: "study" | "exam" | "assignment" | "group";
  description: string;
}

export default function Schedule({ currentUser }: ScheduleProps) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    {
      id: "1",
      title: "DSA Practice Session",
      subject: "Data Structures",
      date: "2024-01-15",
      time: "14:00",
      duration: "2 hours",
      type: "study",
      description: "Tree and graph problems practice",
    },
    {
      id: "2",
      title: "Physics Lab Exam",
      subject: "Physics",
      date: "2024-01-16",
      time: "10:00",
      duration: "3 hours",
      type: "exam",
      description: "Practical examination on wave optics",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<ScheduleItem>>({
    type: "study",
  });

  const handleAddSchedule = () => {
    if (
      newSchedule.title &&
      newSchedule.subject &&
      newSchedule.date &&
      newSchedule.time
    ) {
      const schedule: ScheduleItem = {
        id: Date.now().toString(),
        title: newSchedule.title,
        subject: newSchedule.subject,
        date: newSchedule.date,
        time: newSchedule.time,
        duration: newSchedule.duration || "1 hour",
        type: newSchedule.type as "study" | "exam" | "assignment" | "group",
        description: newSchedule.description || "",
      };

      setSchedules([...schedules, schedule]);
      setNewSchedule({ type: "study" });
      setShowAddForm(false);
      alert("Schedule added successfully! 📅");
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
    alert("Schedule removed");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "study":
        return "bg-blue-500";
      case "exam":
        return "bg-red-500";
      case "assignment":
        return "bg-yellow-500";
      case "group":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "study":
        return BookOpen;
      case "exam":
        return Target;
      case "assignment":
        return Edit;
      case "group":
        return Calendar;
      default:
        return BookOpen;
    }
  };

  const upcomingSchedules = schedules
    .filter((s) => new Date(s.date + " " + s.time) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.date + " " + a.time).getTime() -
        new Date(b.date + " " + b.time).getTime(),
    );

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Study Schedule
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Plan and organize your study sessions
              </p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-kiit-gradient text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Add Schedule Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add New Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Title *
                  </label>
                  <Input
                    placeholder="e.g., Math Study Session"
                    value={newSchedule.title || ""}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Subject *
                  </label>
                  <Input
                    placeholder="e.g., Mathematics"
                    value={newSchedule.subject || ""}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        subject: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Date *
                  </label>
                  <Input
                    type="date"
                    value={newSchedule.date || ""}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Time *
                  </label>
                  <Input
                    type="time"
                    value={newSchedule.time || ""}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, time: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Duration
                  </label>
                  <Select
                    value={newSchedule.duration || "1 hour"}
                    onValueChange={(value) =>
                      setNewSchedule({ ...newSchedule, duration: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30 minutes">30 minutes</SelectItem>
                      <SelectItem value="1 hour">1 hour</SelectItem>
                      <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                      <SelectItem value="2 hours">2 hours</SelectItem>
                      <SelectItem value="3 hours">3 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select
                    value={newSchedule.type || "study"}
                    onValueChange={(value) =>
                      setNewSchedule({ ...newSchedule, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="study">Study Session</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="group">Group Study</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description
                </label>
                <Textarea
                  placeholder="Add details about your study session..."
                  value={newSchedule.description || ""}
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleAddSchedule} className="flex-1">
                  Add Schedule
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Schedules */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-kiit-500" />
            Upcoming Schedule ({upcomingSchedules.length})
          </h2>

          {upcomingSchedules.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No upcoming schedules
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start by adding your first study session
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-kiit-gradient text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Schedule
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingSchedules.map((schedule) => {
                const TypeIcon = getTypeIcon(schedule.type);
                const scheduleDate = new Date(
                  schedule.date + " " + schedule.time,
                );
                const isToday =
                  scheduleDate.toDateString() === new Date().toDateString();
                const isTomorrow =
                  scheduleDate.toDateString() ===
                  new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();

                return (
                  <Card
                    key={schedule.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 ${getTypeColor(schedule.type)} rounded-xl flex items-center justify-center`}
                          >
                            <TypeIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {schedule.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {schedule.subject}
                            </p>
                            {schedule.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {schedule.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={`${getTypeColor(schedule.type)} text-white capitalize`}
                            >
                              {schedule.type}
                            </Badge>
                            {isToday && (
                              <Badge className="bg-green-500 text-white">
                                Today
                              </Badge>
                            )}
                            {isTomorrow && (
                              <Badge className="bg-blue-500 text-white">
                                Tomorrow
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(schedule.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            {schedule.time} • {schedule.duration}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
