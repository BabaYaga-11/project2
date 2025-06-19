import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Heart,
  Users,
  MessageCircle,
  Play,
  Pause,
  Square,
  Timer,
  Trophy,
  Crown,
  Send,
  Clock,
  Target,
  Zap,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";

const StudyRoom = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer states
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [timerType, setTimerType] = useState<
    "pomodoro" | "deep-focus" | "sprint"
  >("pomodoro");
  const [isStudying, setIsStudying] = useState(false);
  const [studyTimeToday, setStudyTimeToday] = useState(0);

  // Chat states
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Rahul Kumar",
      content: "Welcome everyone! Let's focus on dynamic programming today.",
      timestamp: "10:30 AM",
      isAdmin: true,
    },
    {
      id: 2,
      sender: "Priya Sharma",
      content: "Sounds great! I've been struggling with DP problems.",
      timestamp: "10:32 AM",
      isAdmin: false,
    },
    {
      id: 3,
      sender: "System",
      content: "Arjun Patel joined the study session",
      timestamp: "10:35 AM",
      isSystem: true,
    },
    {
      id: 4,
      sender: "Arjun Patel",
      content: "Hey everyone! Ready to solve some problems 💪",
      timestamp: "10:36 AM",
      isAdmin: false,
    },
  ]);

  // Mock group data
  const groupData = {
    id: groupId,
    name: "DSA Marathon",
    subject: "Data Structures & Algorithms",
    admin: {
      name: "Rahul Kumar",
      avatar: "/api/placeholder/40/40",
    },
    participants: [
      {
        id: 1,
        name: "Rahul Kumar",
        avatar: "/api/placeholder/40/40",
        isStudying: true,
        studyTime: 145,
        rank: 1,
        isAdmin: true,
      },
      {
        id: 2,
        name: "Priya Sharma",
        avatar: "/api/placeholder/40/40",
        isStudying: true,
        studyTime: 132,
        rank: 2,
        isAdmin: false,
      },
      {
        id: 3,
        name: "Arjun Patel",
        avatar: "/api/placeholder/40/40",
        isStudying: false,
        studyTime: 98,
        rank: 3,
        isAdmin: false,
      },
      {
        id: 4,
        name: "You",
        avatar: "/api/placeholder/40/40",
        isStudying: isStudying,
        studyTime: studyTimeToday,
        rank: 4,
        isAdmin: false,
      },
    ],
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setIsStudying(false);
            // Timer completed notification
            new Notification("Study session completed!", {
              body: "Great job! Take a break.",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = (type: "pomodoro" | "deep-focus" | "sprint") => {
    const durations = {
      pomodoro: 25 * 60,
      "deep-focus": 50 * 60,
      sprint: 15 * 60,
    };

    setTimerType(type);
    setTimeRemaining(durations[type]);
    setTimerActive(true);
    setIsStudying(true);

    // Add system message
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "System",
        content: `You started a ${type} session (${durations[type] / 60} minutes)`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSystem: true,
      },
    ]);
  };

  const stopTimer = () => {
    setTimerActive(false);
    setIsStudying(false);

    // Add study time to total
    const studiedMinutes = Math.floor((25 * 60 - timeRemaining) / 60);
    setStudyTimeToday((prev) => prev + studiedMinutes);

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "System",
        content: `You stopped studying. Total: ${studiedMinutes} minutes`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSystem: true,
      },
    ]);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      content: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isAdmin: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const activeParticipants = groupData.participants.filter((p) => p.isStudying);
  const sortedParticipants = [...groupData.participants].sort(
    (a, b) => b.studyTime - a.studyTime,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/community")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 bg-kiit-gradient rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold gradient-text">
                  {groupData.name}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {groupData.subject}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500 text-white">
                <Users className="w-3 h-3 mr-1" />
                {activeParticipants.length} studying
              </Badge>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Study Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="timer" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="timer">Study Live</TabsTrigger>
                <TabsTrigger value="chat">Group Chat</TabsTrigger>
              </TabsList>

              {/* Timer Tab */}
              <TabsContent value="timer" className="space-y-6">
                <Card className="bg-gradient-to-r from-kiit-500 to-connect-500 text-white border-0">
                  <CardContent className="p-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Focus Timer</h2>
                    <div className="text-6xl font-bold mb-6">
                      {formatTime(timeRemaining)}
                    </div>

                    <div className="mb-6">
                      <Progress
                        value={
                          timerActive
                            ? ((25 * 60 - timeRemaining) / (25 * 60)) * 100
                            : 0
                        }
                        className="h-3 bg-white/20"
                      />
                    </div>

                    <div className="flex justify-center space-x-4 mb-6">
                      <Button
                        onClick={() => startTimer("pomodoro")}
                        variant="secondary"
                        className="bg-white text-kiit-600"
                        disabled={timerActive}
                      >
                        25min Pomodoro
                      </Button>
                      <Button
                        onClick={() => startTimer("deep-focus")}
                        variant="secondary"
                        className="bg-white text-kiit-600"
                        disabled={timerActive}
                      >
                        50min Deep Focus
                      </Button>
                      <Button
                        onClick={() => startTimer("sprint")}
                        variant="secondary"
                        className="bg-white text-kiit-600"
                        disabled={timerActive}
                      >
                        15min Sprint
                      </Button>
                    </div>

                    <div className="flex justify-center space-x-4">
                      {timerActive ? (
                        <Button
                          onClick={stopTimer}
                          variant="secondary"
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Stop Studying
                        </Button>
                      ) : (
                        <div className="text-blue-100">
                          Click a timer above to start studying
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Study Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Study Progress Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-kiit-600">
                          {studyTimeToday}m
                        </div>
                        <div className="text-sm text-gray-600">
                          Minutes Studied
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {isStudying ? "Active" : "Break"}
                        </div>
                        <div className="text-sm text-gray-600">Status</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          #
                          {
                            groupData.participants.find((p) => p.name === "You")
                              ?.rank
                          }
                        </div>
                        <div className="text-sm text-gray-600">Group Rank</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Chat Tab */}
              <TabsContent value="chat" className="space-y-6">
                <Card className="h-96">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5" />
                      <span>Group Chat</span>
                      <Badge variant="secondary" className="ml-2">
                        {groupData.participants.length} members
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-full flex flex-col">
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex space-x-3 ${msg.isSystem ? "justify-center" : ""}`}
                          >
                            {!msg.isSystem && (
                              <Avatar className="w-8 h-8">
                                <AvatarImage src="/api/placeholder/40/40" />
                                <AvatarFallback className="text-xs">
                                  {msg.sender
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`flex-1 ${msg.isSystem ? "text-center" : ""}`}
                            >
                              {msg.isSystem ? (
                                <div className="text-sm text-gray-500 italic bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1 inline-block">
                                  {msg.content}
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-sm font-medium">
                                      {msg.sender}
                                    </span>
                                    {msg.isAdmin && (
                                      <Crown className="w-3 h-3 text-yellow-500" />
                                    )}
                                    <span className="text-xs text-gray-500">
                                      {msg.timestamp}
                                    </span>
                                  </div>
                                  <div className="text-sm bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                                    {msg.content}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    <div className="flex space-x-2 mt-4 pt-4 border-t">
                      <Input
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} disabled={!message.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Participants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Live Participants</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedParticipants.map((participant, index) => (
                    <div
                      key={participant.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        participant.isStudying
                          ? "bg-green-50 dark:bg-green-900/20 border border-green-200"
                          : "bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>
                            {participant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {participant.isAdmin && (
                          <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
                        )}
                        {participant.isStudying && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">
                            {participant.name}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            #{participant.rank}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {participant.studyTime}min today •{" "}
                          {participant.isStudying ? "Studying" : "Break"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Group Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Group Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-kiit-600 mb-1">
                    {groupData.participants.reduce(
                      (acc, p) => acc + p.studyTime,
                      0,
                    )}
                    min
                  </div>
                  <p className="text-sm text-gray-600">
                    Total Study Time Today
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {activeParticipants.length}
                    </div>
                    <div className="text-xs text-gray-500">Active Now</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {groupData.participants.length}
                    </div>
                    <div className="text-xs text-gray-500">Total Members</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" size="sm">
                  <Target className="w-4 h-4 mr-2" />
                  Set Study Goal
                </Button>
                <Button
                  className="w-full justify-start"
                  size="sm"
                  variant="outline"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  View Schedule
                </Button>
                <Button
                  className="w-full justify-start"
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/community")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
