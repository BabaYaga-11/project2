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
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Plus,
  Trophy,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  Trash2,
} from "lucide-react";

interface GoalsProps {
  currentUser: KIITUser | null;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: "study" | "exam" | "skill" | "project";
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: "active" | "completed" | "paused";
  createdAt: string;
}

export default function Goals({ currentUser }: GoalsProps) {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Complete 100 DSA Problems",
      description: "Practice data structures and algorithms problems daily",
      category: "study",
      targetValue: 100,
      currentValue: 67,
      unit: "problems",
      deadline: "2024-02-15",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      title: "Study 50 Hours This Month",
      description: "Focused study sessions across all subjects",
      category: "study",
      targetValue: 50,
      currentValue: 32,
      unit: "hours",
      deadline: "2024-01-31",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: "3",
      title: "Master React Development",
      description: "Build 3 complete React projects",
      category: "skill",
      targetValue: 3,
      currentValue: 3,
      unit: "projects",
      deadline: "2024-01-20",
      status: "completed",
      createdAt: "2023-12-01",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    category: "study",
    status: "active",
  });

  const handleAddGoal = () => {
    if (
      newGoal.title &&
      newGoal.targetValue &&
      newGoal.unit &&
      newGoal.deadline
    ) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description || "",
        category: newGoal.category as "study" | "exam" | "skill" | "project",
        targetValue: newGoal.targetValue,
        currentValue: 0,
        unit: newGoal.unit,
        deadline: newGoal.deadline,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };

      setGoals([...goals, goal]);
      setNewGoal({ category: "study", status: "active" });
      setShowAddForm(false);
      alert("Goal created successfully! 🎯");
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handleUpdateProgress = (goalId: string, newValue: number) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const updatedGoal = { ...goal, currentValue: newValue };
          if (newValue >= goal.targetValue) {
            updatedGoal.status = "completed";
          }
          return updatedGoal;
        }
        return goal;
      }),
    );
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
    alert("Goal removed");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "study":
        return "bg-blue-500";
      case "exam":
        return "bg-red-500";
      case "skill":
        return "bg-green-500";
      case "project":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Study Goals
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Set targets and track your learning progress
              </p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-kiit-gradient text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="text-center p-6">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {activeGoals.length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Active Goals
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {completedGoals.length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(
                  (completedGoals.length / (goals.length || 1)) * 100,
                )}
                %
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Success Rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add Goal Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">
                    Goal Title *
                  </label>
                  <Input
                    placeholder="e.g., Complete 50 Math Problems"
                    value={newGoal.title || ""}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <Select
                    value={newGoal.category || "study"}
                    onValueChange={(value) =>
                      setNewGoal({ ...newGoal, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="study">Study</SelectItem>
                      <SelectItem value="exam">Exam Prep</SelectItem>
                      <SelectItem value="skill">Skill Building</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Target Value *
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 50"
                    value={newGoal.targetValue || ""}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        targetValue: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Unit *
                  </label>
                  <Input
                    placeholder="e.g., hours, problems, pages"
                    value={newGoal.unit || ""}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, unit: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Deadline *
                  </label>
                  <Input
                    type="date"
                    value={newGoal.deadline || ""}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, deadline: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description
                </label>
                <Textarea
                  placeholder="Describe your goal and motivation..."
                  value={newGoal.description || ""}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, description: e.target.value })
                  }
                />
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleAddGoal} className="flex-1">
                  Create Goal
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

        {/* Active Goals */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            Active Goals ({activeGoals.length})
          </h2>

          {activeGoals.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No active goals
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Set your first goal to start tracking progress
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-kiit-gradient text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeGoals.map((goal) => {
                const progress = (goal.currentValue / goal.targetValue) * 100;
                const daysLeft = Math.ceil(
                  (new Date(goal.deadline).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24),
                );

                return (
                  <Card
                    key={goal.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Badge
                            className={`${getCategoryColor(goal.category)} text-white capitalize`}
                          >
                            {goal.category}
                          </Badge>
                          <h3 className="font-semibold text-lg">
                            {goal.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          {daysLeft > 0 ? (
                            <Badge variant="outline">
                              {daysLeft} days left
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500 text-white">
                              Overdue
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {goal.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {goal.description}
                        </p>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-gray-600">
                            {goal.currentValue} / {goal.targetValue} {goal.unit}
                          </span>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <div className="text-center">
                          <span className="text-2xl font-bold text-kiit-600">
                            {Math.round(progress)}%
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            complete
                          </span>
                        </div>

                        {/* Update Progress */}
                        <div className="flex items-center space-x-2 pt-2">
                          <Input
                            type="number"
                            placeholder={`Current ${goal.unit}`}
                            value={goal.currentValue}
                            onChange={(e) =>
                              handleUpdateProgress(
                                goal.id,
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500">
                            {goal.unit}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-green-500" />
              Completed Goals ({completedGoals.length})
            </h2>

            <div className="space-y-4">
              {completedGoals.map((goal) => (
                <Card
                  key={goal.id}
                  className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <div>
                          <h3 className="font-semibold text-lg">
                            {goal.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Completed {goal.targetValue} {goal.unit}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        <Trophy className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
