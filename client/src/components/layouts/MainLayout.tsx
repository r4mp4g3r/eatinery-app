import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, Search, ShoppingBag, User } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col pb-16 bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h1 className="font-heading font-bold text-lg text-neutral-800">Eatinery</h1>
            </div>
          </Link>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-neutral-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-around py-2">
            <Link href="/">
              <div className="flex flex-col items-center p-2 cursor-pointer">
                <Home className={`h-6 w-6 ${location === '/' ? 'text-primary' : 'text-neutral-400'}`} />
                <span className={`text-xs font-medium mt-1 ${location === '/' ? 'text-primary' : 'text-neutral-500'}`}>Home</span>
              </div>
            </Link>
            
            <Link href="/search">
              <div className="flex flex-col items-center p-2 cursor-pointer">
                <Search className={`h-6 w-6 ${location === '/search' ? 'text-primary' : 'text-neutral-400'}`} />
                <span className={`text-xs font-medium mt-1 ${location === '/search' ? 'text-primary' : 'text-neutral-500'}`}>Search</span>
              </div>
            </Link>
            
            <Link href="/orders">
              <div className="flex flex-col items-center p-2 cursor-pointer">
                <ShoppingBag className={`h-6 w-6 ${location === '/orders' ? 'text-primary' : 'text-neutral-400'}`} />
                <span className={`text-xs font-medium mt-1 ${location === '/orders' ? 'text-primary' : 'text-neutral-500'}`}>Orders</span>
              </div>
            </Link>
            
            <Link href="/profile">
              <div className="flex flex-col items-center p-2 cursor-pointer">
                <User className={`h-6 w-6 ${location === '/profile' ? 'text-primary' : 'text-neutral-400'}`} />
                <span className={`text-xs font-medium mt-1 ${location === '/profile' ? 'text-primary' : 'text-neutral-500'}`}>Profile</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
