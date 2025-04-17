import { Button } from "@/components/ui/button";
import { 
  User, Settings, Heart, CreditCard, 
  Bell, HelpCircle, LogOut, ChevronRight 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function Profile() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-6">
      <div className="py-4">
        <h1 className="font-heading font-bold text-xl text-neutral-800 mb-4">Profile</h1>
        
        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
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
            <Button variant="outline" className="flex-1 mr-2">Sign In</Button>
            <Button className="flex-1">Create Account</Button>
          </div>
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
    </div>
  );
}