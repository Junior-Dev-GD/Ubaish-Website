import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Download, Heart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Alumni = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isLogin ? "Login Successful" : "Registration Submitted",
      description: isLogin 
        ? "Welcome back! Your alumni dashboard is loading..."
        : "Your registration has been submitted for admin approval.",
    });
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

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" required />
                      </div>
                      <div>
                        <Label htmlFor="studentId">Student ID (6-digit)</Label>
                        <Input id="studentId" maxLength={6} required />
                      </div>
                      <div>
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Input id="graduationYear" type="number" required />
                      </div>
                    </>
                  )}
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required />
                  </div>
                  
                  {!isLogin && (
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" required />
                    </div>
                  )}
                  
                  {isLogin && (
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required />
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-gradient-hero">
                    {isLogin ? "Login" : "Submit Registration"}
                  </Button>
                </form>

                {!isLogin && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Registration requests are reviewed by admin. You'll receive login credentials via email upon approval.
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
