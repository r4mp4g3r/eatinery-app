import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Receipt, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-6">
      <div className="py-4">
        <h1 className="font-heading font-bold text-xl text-neutral-800 mb-4">Your Orders</h1>
        
        <Tabs defaultValue="current" onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="font-medium text-neutral-800 mb-1">No Current Orders</h3>
              <p className="text-sm text-neutral-500 mb-4">
                You don't have any active orders at the moment.
              </p>
              <Button className="w-full">Browse Restaurants</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            {/* Sample order history - you would load this from an API in a real app */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-neutral-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Seoul Garden</h3>
                    <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">Completed</span>
                  </div>
                  <div className="flex items-center text-xs text-neutral-500 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Yesterday, 7:30 PM</span>
                  </div>
                </div>
                
                <div className="px-4 py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-neutral-600">2 items</p>
                      <p className="text-sm font-medium">$28.50</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary flex items-center">
                      <span>View Details</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-neutral-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Japanese Cuisine</h3>
                    <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">Completed</span>
                  </div>
                  <div className="flex items-center text-xs text-neutral-500 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Last week, 1:15 PM</span>
                  </div>
                </div>
                
                <div className="px-4 py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-neutral-600">3 items</p>
                      <p className="text-sm font-medium">$42.75</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary flex items-center">
                      <span>View Details</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}