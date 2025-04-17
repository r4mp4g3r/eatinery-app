import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Receipt, Clock, ArrowRight, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { MenuItem } from "@shared/schema";
import { getCalorieClass } from "@/lib/utils/distance-calculator";

interface OrderItem extends MenuItem {
  quantity: number;
  restaurantName: string;
}

export default function Orders() {
  const [activeTab, setActiveTab] = useState("current");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orderItems');
    if (savedOrders) {
      try {
        setOrderItems(JSON.parse(savedOrders));
      } catch (e) {
        console.error('Failed to parse saved orders', e);
      }
    }
  }, []);
  
  // Save orders to localStorage when changed
  useEffect(() => {
    localStorage.setItem('orderItems', JSON.stringify(orderItems));
  }, [orderItems]);
  
  // Function to update item quantity
  const updateQuantity = (id: number, change: number) => {
    setOrderItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
      
      return updated;
    });
  };
  
  // Function to remove item from order
  const removeItem = (id: number) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "The item has been removed from your order.",
    });
  };
  
  // Calculate total calories
  const totalCalories = orderItems.reduce((sum, item) => sum + (item.calories * item.quantity), 0);
  
  // Group items by restaurant
  const itemsByRestaurant = orderItems.reduce((grouped, item) => {
    if (!grouped[item.restaurantName]) {
      grouped[item.restaurantName] = [];
    }
    grouped[item.restaurantName].push(item);
    return grouped;
  }, {} as Record<string, OrderItem[]>);

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
            {orderItems.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="font-medium text-neutral-800 mb-1">No Current Orders</h3>
                <p className="text-sm text-neutral-500 mb-4">
                  You don't have any active orders at the moment.
                </p>
                <Button className="w-full" onClick={() => navigate("/search")}>Browse Restaurants</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Calorie Summary */}
                <div className="bg-primary/10 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-neutral-700">Total Calorie Intake</h3>
                    <span className={`text-lg font-bold ${getCalorieClass(totalCalories)}`}>
                      {totalCalories} kcal
                    </span>
                  </div>
                </div>
                
                {/* Order Items */}
                {Object.entries(itemsByRestaurant).map(([restaurantName, items]) => (
                  <div key={restaurantName} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-neutral-100">
                      <h3 className="font-medium text-neutral-800">{restaurantName}</h3>
                    </div>
                    
                    <div className="p-4">
                      <div className="space-y-4">
                        {items.map(item => (
                          <div key={item.id} className="flex items-center">
                            <img 
                              src={item.imageUrl || 'https://placehold.co/56x56'} 
                              alt={item.name}
                              className="w-14 h-14 rounded object-cover" 
                            />
                            <div className="ml-3 flex-1">
                              <h5 className="font-medium text-neutral-800">{item.name}</h5>
                              <div className="flex items-center">
                                <span className={`text-sm font-medium ${getCalorieClass(item.calories)}`}>
                                  {item.calories} kcal
                                </span>
                                <span className="text-xs text-neutral-500 ml-2">
                                  • {item.tags?.[0] || "Healthy option"}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <button 
                                className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="mx-2 text-sm font-medium min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button 
                                className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                              <button 
                                className="ml-2 p-1 rounded-full text-red-500 hover:bg-red-100"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 flex space-x-3">
                  <Button className="flex-1">Checkout</Button>
                  <Button variant="outline" className="flex-1" onClick={() => navigate("/search")}>
                    Add More Items
                  </Button>
                </div>
              </div>
            )}
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