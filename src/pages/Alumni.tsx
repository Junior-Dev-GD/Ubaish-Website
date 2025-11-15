import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Download, Heart, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { registerAlumni, loginAlumni, getStoredUser } from "@/api";

const Alumni = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(getStoredUser());
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate("/alumni/dashboard");
    }
  }, [user, navigate]);

  // Form state for registration
  const [regData, setRegData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    student_id: "",
    graduation_year: "",
    phone_number: "",
  });

  // Form state for login
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await registerAlumni({
        username: regData.username,
        email: regData.email,
        password: regData.password,
        password_confirm: regData.password_confirm,
        first_name: regData.first_name,
        last_name: regData.last_name,
        student_id: regData.student_id,
        graduation_year: parseInt(regData.graduation_year) || undefined,
        phone_number: regData.phone_number,
        role: "ALUMNI",
      });
      
      setUser(response.user);
      toast({
        title: "Registration Successful!",
        description: `Welcome ${response.user.username}! Redirecting to dashboard...`,
      });
      // Navigate to dashboard after successful registration
      setTimeout(() => {
        navigate("/alumni/dashboard");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await loginAlumni(loginData.username, loginData.password);
      setUser(response.user);
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${response.user.username}! Redirecting to dashboard...`,
      });
      // Navigate to dashboard after successful login
      setTimeout(() => {
        navigate("/alumni/dashboard");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (isLogin) {
      handleLogin(e);
    } else {
      handleRegister(e);
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold mb-4 text-primary">Alumni Portal</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay connected with your alma mater and fellow graduates
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Benefits */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h2 className="font-serif text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Benefits
                </h2>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Download className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>Download transcripts and testimonials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>Connect with fellow alumni</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>Support current students</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Login/Register Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant">
              <CardContent className="p-8">
                <div className="flex gap-4 mb-6 border-b border-border">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`pb-3 px-4 font-semibold transition-all ${
                      isLogin
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`pb-3 px-4 font-semibold transition-all ${
                      !isLogin
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Register
                  </button>
                </div>

                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600 mb-4">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-semibold">Logged in as {user.username}</span>
                    </div>
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Role:</strong> {user.role}</div>
                        {user.student_id && <div><strong>Student ID:</strong> {user.student_id}</div>}
                        {user.graduation_year && <div><strong>Graduation Year:</strong> {user.graduation_year}</div>}
                        {user.owes_fees && (
                          <div className="text-red-600 font-semibold">
                            ⚠️ You have outstanding fees. Please clear them to download documents.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <div className="space-y-2">
                      <Button
                        onClick={() => navigate("/alumni/dashboard")}
                        className="w-full bg-gradient-hero"
                      >
                        Go to Dashboard
                      </Button>
                      <Button
                        onClick={() => {
                          setUser(null);
                          localStorage.removeItem("user");
                          localStorage.removeItem("access_token");
                          localStorage.removeItem("refresh_token");
                          toast({
                            title: "Logged out",
                            description: "You have been logged out successfully.",
                          });
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                              id="first_name"
                              value={regData.first_name}
                              onChange={(e) => setRegData({ ...regData, first_name: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                              id="last_name"
                              value={regData.last_name}
                              onChange={(e) => setRegData({ ...regData, last_name: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={regData.username}
                            onChange={(e) => setRegData({ ...regData, username: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="studentId">Student ID</Label>
                          <Input
                            id="studentId"
                            value={regData.student_id}
                            onChange={(e) => setRegData({ ...regData, student_id: e.target.value })}
                            maxLength={50}
                          />
                        </div>
                        <div>
                          <Label htmlFor="graduationYear">Graduation Year</Label>
                          <Input
                            id="graduationYear"
                            type="number"
                            value={regData.graduation_year}
                            onChange={(e) => setRegData({ ...regData, graduation_year: e.target.value })}
                          />
                        </div>
                      </>
                    )}
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={isLogin ? "" : regData.email}
                        onChange={(e) => !isLogin && setRegData({ ...regData, email: e.target.value })}
                        required={!isLogin}
                        disabled={isLogin}
                      />
                    </div>
                    
                    {!isLogin && (
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={regData.phone_number}
                          onChange={(e) => setRegData({ ...regData, phone_number: e.target.value })}
                        />
                      </div>
                    )}

                    {isLogin && (
                      <div>
                        <Label htmlFor="login_username">Username</Label>
                        <Input
                          id="login_username"
                          value={loginData.username}
                          onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                          required
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={isLogin ? loginData.password : regData.password}
                        onChange={(e) => 
                          isLogin
                            ? setLoginData({ ...loginData, password: e.target.value })
                            : setRegData({ ...regData, password: e.target.value })
                        }
                        required
                      />
                    </div>

                    {!isLogin && (
                      <div>
                        <Label htmlFor="password_confirm">Confirm Password</Label>
                        <Input
                          id="password_confirm"
                          type="password"
                          value={regData.password_confirm}
                          onChange={(e) => setRegData({ ...regData, password_confirm: e.target.value })}
                          required
                        />
                      </div>
                    )}

                    <Button type="submit" className="w-full bg-gradient-hero" disabled={loading}>
                      {loading ? "Processing..." : isLogin ? "Login" : "Register"}
                    </Button>
                  </form>
                )}

                {!isLogin && !user && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Fill in your information to create an alumni account. You'll be able to login immediately after registration.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alumni;
