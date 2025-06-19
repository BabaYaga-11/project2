import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { signUpWithKIIT, signInWithKIIT } from "@/lib/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Mail,
  Lock,
  User,
  School,
  AlertCircle,
  CheckCircle,
  Sun,
  Moon,
  Heart,
  Shield,
  Users,
  Sparkles,
  GraduationCap,
  BookOpen,
  Clock,
  Trophy,
} from "lucide-react";

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    rollNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated, navigating to dashboard");
        navigate("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await signInWithKIIT(loginData.email, loginData.password);
      console.log("Login successful, user:", user);
      setSuccess("Login successful! Welcome to KIITConnect");

      // Store user data in localStorage for demo mode
      localStorage.setItem("kiit_user", JSON.stringify(user));
      localStorage.setItem("kiit_auth", "true");

      // Navigate immediately for demo mode, or after short delay for real Firebase
      const isDemoMode =
        !import.meta.env.VITE_FIREBASE_API_KEY ||
        import.meta.env.VITE_FIREBASE_API_KEY === "demo-api-key";

      if (isDemoMode) {
        // Immediate navigation for demo mode
        navigate("/dashboard", { replace: true });
      } else {
        // Short delay for real Firebase to let auth state update
        setTimeout(() => navigate("/dashboard", { replace: true }), 500);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (signupData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const user = await signUpWithKIIT(
        signupData.email,
        signupData.password,
        signupData.name,
        signupData.rollNumber,
      );
      console.log("Signup successful, user:", user);
      setSuccess("Account created successfully! You can now login.");

      // Clear form and switch to login tab
      setSignupData({
        name: "",
        rollNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => setActiveTab("login"), 1500);
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { number: "1,500+", label: "KIIT Students", icon: Users },
    { number: "3,200+", label: "Study Hours", icon: Clock },
    { number: "150+", label: "Study Groups", icon: BookOpen },
    { number: "98%", label: "Success Rate", icon: Trophy },
  ];

  const features = [
    {
      icon: Shield,
      title: "KIIT Verified Only",
      description:
        "Exclusive platform for KIIT University students with verified roll numbers and email addresses.",
    },
    {
      icon: Users,
      title: "Study Groups",
      description:
        "Join live study sessions, compete with peers, and achieve academic excellence together.",
    },
    {
      icon: Heart,
      title: "Connect & Learn",
      description:
        "Make friends, share knowledge, and build lasting academic relationships within KIIT community.",
    },
  ];

  return (
    <div
      className={`min-h-screen theme-transition ${theme === "dark" ? "dark-gradient" : "light-gradient"}`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kiit-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-connect-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-kiit-400/5 to-connect-400/5 rounded-full blur-2xl"></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="icon"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full glass-effect border-0 hover:scale-110 transition-all duration-300"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-kiit-gradient rounded-2xl flex items-center justify-center shadow-kiit">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">KIITConnect</h1>
            </div>
            <p className="text-lg text-muted-foreground px-4">
              Exclusive study platform for KIIT University students
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:block space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-kiit-gradient rounded-2xl flex items-center justify-center shadow-kiit">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold gradient-text">
                  KIITConnect
                </h1>
              </div>

              <div className="space-y-6">
                <h2 className="text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                  Connect with Your
                  <span className="gradient-text block">KIIT Community</span>
                </h2>

                <p className="text-xl text-muted-foreground max-w-lg">
                  The exclusive study platform for KIIT University students.
                  Study together, compete, and achieve academic excellence.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="w-12 h-12 bg-kiit-100 dark:bg-kiit-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-kiit-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  >
                    <div className="flex justify-center mb-2">
                      <stat.icon className="w-6 h-6 text-kiit-600" />
                    </div>
                    <div className="text-2xl font-bold gradient-text mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md login-card border-0">
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-kiit-gradient rounded-xl flex items-center justify-center shadow-kiit">
                      <GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-bold text-foreground">
                    KIIT Students Only
                  </CardTitle>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Verify your KIIT credentials to continue
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {error && (
                    <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <AlertDescription className="text-red-700 dark:text-red-300 text-sm">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertDescription className="text-green-700 dark:text-green-300 text-sm">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login" className="text-sm">
                        Login
                      </TabsTrigger>
                      <TabsTrigger value="signup" className="text-sm">
                        Sign Up
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-4 mt-6">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="login-email"
                            className="text-sm font-medium"
                          >
                            KIIT Email
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="login-email"
                              type="email"
                              placeholder="your.name@kiit.ac.in"
                              value={loginData.email}
                              onChange={(e) =>
                                setLoginData((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              className="pl-10 h-11 md:h-12 theme-transition"
                              required
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Only @kiit.ac.in emails are allowed
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="login-password"
                            className="text-sm font-medium"
                          >
                            Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="login-password"
                              type="password"
                              placeholder="Enter your password"
                              value={loginData.password}
                              onChange={(e) =>
                                setLoginData((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              className="pl-10 h-11 md:h-12 theme-transition"
                              required
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-11 md:h-12 bg-kiit-gradient hover:shadow-kiit transition-all duration-300 font-medium"
                          disabled={isLoading}
                        >
                          {isLoading ? "Verifying..." : "Sign In"}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4 mt-6">
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-name"
                            className="text-sm font-medium"
                          >
                            Full Name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-name"
                              type="text"
                              placeholder="Your full name"
                              value={signupData.name}
                              onChange={(e) =>
                                setSignupData((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              className="pl-10 h-11 md:h-12 theme-transition"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-roll"
                            className="text-sm font-medium"
                          >
                            KIIT Roll Number
                          </Label>
                          <div className="relative">
                            <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-roll"
                              type="text"
                              placeholder="e.g., 2405099"
                              value={signupData.rollNumber}
                              onChange={(e) =>
                                setSignupData((prev) => ({
                                  ...prev,
                                  rollNumber: e.target.value,
                                }))
                              }
                              className="pl-10 h-11 md:h-12 theme-transition"
                              required
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Your official KIIT roll number is required
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-email"
                            className="text-sm font-medium"
                          >
                            KIIT Email
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-email"
                              type="email"
                              placeholder="your.name@kiit.ac.in"
                              value={signupData.email}
                              onChange={(e) =>
                                setSignupData((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              className="pl-10 h-11 md:h-12 theme-transition"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-password"
                            className="text-sm font-medium"
                          >
                            Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-password"
                              type="password"
                              placeholder="Create a strong password"
                              value={signupData.password}
                              onChange={(e) =>
                                setSignupData((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              className="pl-10 h-11 md:h-12 theme-transition"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-confirm"
                            className="text-sm font-medium"
                          >
                            Confirm Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-confirm"
                              type="password"
                              placeholder="Confirm your password"
                              value={signupData.confirmPassword}
                              onChange={(e) =>
                                setSignupData((prev) => ({
                                  ...prev,
                                  confirmPassword: e.target.value,
                                }))
                              }
                              className="pl-10 h-11 md:h-12 theme-transition"
                              required
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-11 md:h-12 bg-connect-gradient hover:shadow-connect transition-all duration-300 font-medium"
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating Account..." : "Create Account"}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  <div className="text-center pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      By continuing, you agree to our Terms of Service and
                      Privacy Policy
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="lg:hidden mt-8">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-5 h-5 text-kiit-600" />
                  </div>
                  <div className="text-lg font-bold gradient-text mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
