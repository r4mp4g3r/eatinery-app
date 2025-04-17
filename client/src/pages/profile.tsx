import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  User, Settings, Heart, CreditCard, 
  Bell, HelpCircle, LogOut, ChevronRight, Loader2 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";

// Create a schema for login
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Create a schema for registration with password confirmation
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Profile() {
  const { user, isLoading, loginMutation, registerMutation, logoutMutation } = useAuth();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        setIsLoginDialogOpen(false);
        loginForm.reset();
      },
    });
  };

  // Handle register form submission
  const onRegisterSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        setIsRegisterDialogOpen(false);
        registerForm.reset();
      },
    });
  };

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-6">
      <div className="py-4">
        <h1 className="font-heading font-bold text-xl text-neutral-800 mb-4">Profile</h1>
        
        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : user ? (
            <>
              <div className="p-4 flex items-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="font-medium text-lg">{user.username}</h2>
                  <p className="text-sm text-neutral-500">Logged in</p>
                </div>
              </div>
              <div className="p-4 border-t border-neutral-100">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4 mr-2" />
                  )}
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 flex items-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="font-medium text-lg">Guest User</h2>
                  <p className="text-sm text-neutral-500">Sign in to save your preferences</p>
                </div>
              </div>
              <div className="p-4 border-t border-neutral-100 flex justify-between">
                <Button 
                  variant="outline" 
                  className="flex-1 mr-2"
                  onClick={() => setIsLoginDialogOpen(true)}
                >
                  Sign In
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => setIsRegisterDialogOpen(true)}
                >
                  Create Account
                </Button>
              </div>
            </>
          )}
        </div>
        
        {/* Settings Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-4 border-b border-neutral-100">
            <h2 className="font-medium">Settings</h2>
          </div>
          
          {/* Settings List */}
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-3">
                  <Bell className="h-4 w-4 text-neutral-600" />
                </div>
                <span className="text-neutral-800">Notifications</span>
              </div>
              <Switch checked={true} />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-3">
                  <Settings className="h-4 w-4 text-neutral-600" />
                </div>
                <span className="text-neutral-800">Preferences</span>
              </div>
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-3">
                  <Heart className="h-4 w-4 text-neutral-600" />
                </div>
                <span className="text-neutral-800">Health Goals</span>
              </div>
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-3">
                  <CreditCard className="h-4 w-4 text-neutral-600" />
                </div>
                <span className="text-neutral-800">Payment Methods</span>
              </div>
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </div>
          </div>
        </div>
        
        {/* Support Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-4 border-b border-neutral-100">
            <h2 className="font-medium">Support</h2>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-3">
                  <HelpCircle className="h-4 w-4 text-neutral-600" />
                </div>
                <span className="text-neutral-800">Help Center</span>
              </div>
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-3">
                  <LogOut className="h-4 w-4 text-neutral-600" />
                </div>
                <span className="text-neutral-800">Sign Out</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-xs text-neutral-500">
          <p>Eatinery Version 1.0.0</p>
          <p className="mt-1">©2025 Eatinery. All rights reserved.</p>
        </div>
      </div>
      
      {/* Login Dialog */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Sign in to save your preferences and track your orders.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 py-4">
              <FormField
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-2 text-center text-sm text-neutral-500">
            <span>Don't have an account? </span>
            <Button 
              variant="link" 
              className="p-0" 
              onClick={() => {
                setIsLoginDialogOpen(false);
                setIsRegisterDialogOpen(true);
              }}
            >
              Create one
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Register Dialog */}
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
            <DialogDescription>
              Create an account to track your orders and get personalized recommendations.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 py-4">
              <FormField
                control={registerForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-2 text-center text-sm text-neutral-500">
            <span>Already have an account? </span>
            <Button 
              variant="link" 
              className="p-0" 
              onClick={() => {
                setIsRegisterDialogOpen(false);
                setIsLoginDialogOpen(true);
              }}
            >
              Sign in
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}