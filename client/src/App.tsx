import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import RestaurantDetail from "@/pages/restaurant-detail";
import WalkingDirections from "@/pages/walking-directions";
import Search from "@/pages/search";
import Orders from "@/pages/orders";
import Profile from "@/pages/profile";
import MainLayout from "@/components/layouts/MainLayout";
import { AuthProvider } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/restaurant/:id" component={RestaurantDetail} />
      <Route path="/restaurant/:id/directions" component={WalkingDirections} />
      <Route path="/search" component={Search} />
      <ProtectedRoute path="/orders" component={Orders} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainLayout>
          <Router />
        </MainLayout>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
