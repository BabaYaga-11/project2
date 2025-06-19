import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  Check,
  X,
  UserPlus,
  MessageCircle,
  Calendar,
  Trophy,
  BookOpen,
} from "lucide-react";

interface Notification {
  id: number;
  type: "friend_request" | "message" | "study_group" | "achievement" | "event";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  data?: any;
}

interface NotificationCenterProps {
  onFriendRequestAccept?: (notificationId: number, userId: number) => void;
  onFriendRequestReject?: (notificationId: number, userId: number) => void;
}

export function NotificationCenter({
  onFriendRequestAccept,
  onFriendRequestReject,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "friend_request",
      title: "Friend Request",
      description: "Priya Sharma wants to connect with you",
      timestamp: "2 minutes ago",
      isRead: false,
      data: {
        userId: 101,
        userName: "Priya Sharma",
        userAvatar: "/api/placeholder/40/40",
        course: "B.Tech CSE",
      },
    },
    {
      id: 2,
      type: "friend_request",
      title: "Friend Request",
      description: "Arjun Patel wants to connect with you",
      timestamp: "5 minutes ago",
      isRead: false,
      data: {
        userId: 102,
        userName: "Arjun Patel",
        userAvatar: "/api/placeholder/40/40",
        course: "B.Tech EE",
      },
    },
    {
      id: 3,
      type: "study_group",
      title: "Study Group Invitation",
      description: "You've been invited to join 'DSA Marathon'",
      timestamp: "10 minutes ago",
      isRead: false,
      data: {
        groupId: 1,
        groupName: "DSA Marathon",
        invitedBy: "Rahul Kumar",
      },
    },
    {
      id: 4,
      type: "achievement",
      title: "Achievement Unlocked!",
      description: "You've completed 7 days study streak",
      timestamp: "1 hour ago",
      isRead: true,
      data: {
        achievement: "Study Streak",
        points: 100,
      },
    },
    {
      id: 5,
      type: "message",
      title: "New Message",
      description: "Sneha Roy sent you a message",
      timestamp: "2 hours ago",
      isRead: true,
      data: {
        userId: 103,
        userName: "Sneha Roy",
        preview: "Hey! Want to study together for tomorrow's exam?",
      },
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleFriendRequestAccept = (
    notificationId: number,
    userId: number,
  ) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
    );
    onFriendRequestAccept?.(notificationId, userId);
  };

  const handleFriendRequestReject = (
    notificationId: number,
    userId: number,
  ) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    onFriendRequestReject?.(notificationId, userId);
  };

  const markAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
    );
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "friend_request":
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case "message":
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      case "study_group":
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case "achievement":
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case "event":
        return <Calendar className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs bg-red-500 hover:bg-red-600">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} new</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${!notification.isRead ? "bg-blue-50 dark:bg-blue-950/30" : ""}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {notification.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.timestamp}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </div>

                        {/* Friend Request Actions */}
                        {notification.type === "friend_request" &&
                          !notification.isRead && (
                            <div className="flex items-center space-x-2 mt-3">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage
                                    src={notification.data?.userAvatar}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {notification.data?.userName
                                      ?.split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-600">
                                  {notification.data?.course}
                                </span>
                              </div>
                              <div className="flex space-x-1 ml-auto">
                                <Button
                                  size="sm"
                                  className="h-6 px-2 text-xs bg-green-500 hover:bg-green-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFriendRequestAccept(
                                      notification.id,
                                      notification.data?.userId,
                                    );
                                  }}
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs border-red-300 text-red-600 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFriendRequestReject(
                                      notification.id,
                                      notification.data?.userId,
                                    );
                                  }}
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}

                        {/* Study Group Invitation Actions */}
                        {notification.type === "study_group" &&
                          !notification.isRead && (
                            <div className="flex space-x-2 mt-3">
                              <Button
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Join Group
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                Decline
                              </Button>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
