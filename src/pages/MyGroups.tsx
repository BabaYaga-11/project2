import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudyGroup } from "@/lib/studyGroups";
import { KIITUser } from "@/lib/auth";
import {
  Users,
  Clock,
  MessageCircle,
  Trophy,
  Settings,
  BookOpen,
  Play,
  Pause,
  Target,
  Crown,
} from "lucide-react";

interface MyGroupsProps {
  currentUser: KIITUser | null;
}

export default function MyGroups({ currentUser }: MyGroupsProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedGroupId = searchParams.get("group");
  const activeTab = searchParams.get("tab") || "overview";

  useEffect(() => {
    // Mock data for groups user has joined
    const mockMyGroups: StudyGroup[] = [
      {
        id: "my-group-1",
        name: "DSA Marathon",
        subject: "Data Structures & Algorithms",
        description: "Intensive problem-solving session",
        adminId: "demo-admin-1",
        participants: [
          {
            uid: currentUser?.uid || "current-user",
            name: currentUser?.name || "You",
            email: currentUser?.email || "you@kiit.ac.in",
            avatar: "/api/placeholder/40/40",
            course: currentUser?.course || "B.Tech CSE",
            isStudying: true,
            studyTime: 245,
            joinedAt: new Date(),
            role: "member",
          },
          {
            uid: "user-2",
            name: "Priya Sharma",
            email: "priya@kiit.ac.in",
            avatar: "/api/placeholder/40/40",
            course: "B.Tech CSE",
            isStudying: true,
            studyTime: 320,
            joinedAt: new Date(),
            role: "admin",
          },
          {
            uid: "user-3",
            name: "Arjun Patel",
            email: "arjun@kiit.ac.in",
            avatar: "/api/placeholder/40/40",
            course: "B.Tech EE",
            isStudying: false,
            studyTime: 180,
            joinedAt: new Date(),
            role: "member",
          },
        ],
        pendingRequests: [],
        timer: {
          duration: 50,
          startTime: new Date(),
          isActive: true,
          type: "deep-focus",
        },
        settings: {
          isPrivate: false,
          requireApproval: false,
          maxParticipants: 20,
          allowChat: true,
        },
        stats: {
          totalSessions: 15,
          totalHours: 47,
          averageParticipants: 8,
        },
        createdAt: new Date(),
        lastActive: new Date(),
      },
      {
        id: "my-group-2",
        name: "Physics Lab Discussion",
        subject: "Physics",
        description: "Weekly physics lab discussions",
        adminId: currentUser?.uid || "current-user",
        participants: [
          {
            uid: currentUser?.uid || "current-user",
            name: currentUser?.name || "You",
            email: currentUser?.email || "you@kiit.ac.in",
            avatar: "/api/placeholder/40/40",
            course: currentUser?.course || "B.Tech CSE",
            isStudying: false,
            studyTime: 120,
            joinedAt: new Date(),
            role: "admin",
          },
          {
            uid: "user-4",
            name: "Sneha Roy",
            email: "sneha@kiit.ac.in",
            avatar: "/api/placeholder/40/40",
            course: "B.Tech ME",
            isStudying: false,
            studyTime: 95,
            joinedAt: new Date(),
            role: "member",
          },
        ],
        pendingRequests: [],
        timer: {
          duration: 25,
          startTime: new Date(),
          isActive: false,
          type: "pomodoro",
        },
        settings: {
          isPrivate: false,
          requireApproval: false,
          maxParticipants: 15,
          allowChat: true,
        },
        stats: {
          totalSessions: 8,
          totalHours: 23,
          averageParticipants: 6,
        },
        createdAt: new Date(),
        lastActive: new Date(),
      },
    ];

    setTimeout(() => {
      setMyGroups(mockMyGroups);
      setLoading(false);
    }, 500);
  }, [currentUser]);

  const handleSelectGroup = (groupId: string, tab: string = "overview") => {
    const params = new URLSearchParams();
    params.set("group", groupId);
    params.set("tab", tab);
    navigate(`/my-groups?${params.toString()}`);
  };

  const selectedGroup = myGroups.find((g) => g.id === selectedGroupId);
  const isAdmin = selectedGroup?.adminId === currentUser?.uid;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-kiit-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Users className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium">Loading your groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex h-full">
        {/* Groups Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-900 border-r dark:border-gray-800 overflow-y-auto">
          <div className="p-6 border-b dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              My Groups
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {myGroups.length} groups joined
            </p>
          </div>

          <div className="p-4 space-y-3">
            {myGroups.map((group) => (
              <Card
                key={group.id}
                className={`cursor-pointer transition-all ${
                  selectedGroupId === group.id
                    ? "ring-2 ring-kiit-500 bg-kiit-50 dark:bg-kiit-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleSelectGroup(group.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{group.name}</h3>
                    <div className="flex items-center space-x-1">
                      {group.adminId === currentUser?.uid && (
                        <Crown className="w-3 h-3 text-yellow-500" />
                      )}
                      {group.timer.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {group.subject}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center text-gray-500">
                      <Users className="w-3 h-3 mr-1" />
                      {group.participants.length}
                    </span>
                    <Badge
                      variant={group.timer.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {group.timer.isActive ? "Active" : "Offline"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            {myGroups.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No groups joined yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate("/browse-groups")}
                >
                  Browse Groups
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Group Details */}
        <div className="flex-1 overflow-y-auto">
          {selectedGroup ? (
            <div className="h-full">
              {/* Group Header */}
              <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      {selectedGroup.name}
                      {isAdmin && (
                        <Crown className="w-6 h-6 text-yellow-500 ml-2" />
                      )}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {selectedGroup.subject} •{" "}
                      {selectedGroup.participants.length} members
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        selectedGroup.timer.isActive ? "default" : "secondary"
                      }
                      className="flex items-center"
                    >
                      {selectedGroup.timer.isActive ? (
                        <Play className="w-3 h-3 mr-1" />
                      ) : (
                        <Pause className="w-3 h-3 mr-1" />
                      )}
                      {selectedGroup.timer.isActive
                        ? "Live Session"
                        : "Offline"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Group Tabs */}
              <div className="p-6">
                <Tabs
                  value={activeTab}
                  onValueChange={(tab) =>
                    handleSelectGroup(selectedGroup.id, tab)
                  }
                >
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview" className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Study Room
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger
                      value="leaderboard"
                      className="flex items-center"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Leaderboard
                    </TabsTrigger>
                    {isAdmin && (
                      <TabsTrigger value="admin" className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin
                      </TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">
                        Study Room content will be implemented
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() =>
                          navigate(`/study-room/${selectedGroup.id}`)
                        }
                      >
                        Enter Study Room
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="chat" className="mt-6">
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-kiit-500 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Group Chat
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Join the conversation with your study group
                      </p>
                      <Button
                        onClick={() =>
                          navigate(`/group/${selectedGroup.id}/chat`)
                        }
                        className="bg-kiit-gradient text-white"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Open Chat
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="leaderboard" className="mt-6">
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">
                        Leaderboard will be implemented
                      </p>
                    </div>
                  </TabsContent>

                  {isAdmin && (
                    <TabsContent value="admin" className="mt-6">
                      <div className="text-center py-8">
                        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">
                          Admin panel will be implemented
                        </p>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select a Group
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a group from the sidebar to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
