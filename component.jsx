import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import anime from "animejs";
import { createPageUrl } from "./src/utils";
import { TrendingUp, BarChart3, Newspaper, Home, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "./src/components/ui/sidebar";
import ApiStatus from "./src/components/ApiStatus";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Markets",
    url: createPageUrl("Markets"),
    icon: TrendingUp,
  },
  {
    title: "Charts",
    url: createPageUrl("Charts"),
    icon: BarChart3,
  },
  {
    title: "News",
    url: createPageUrl("News"),
    icon: Newspaper,
  },
];

export default function Layout({ children, onLogout }) {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    // GSAP entrance animations
    const tl = gsap.timeline();
    
    tl.fromTo(sidebarRef.current,
      { x: -300, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    )
    .fromTo(mainRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    // Anime.js floating animation for logo
    anime({
      targets: '.crypto-logo',
      translateY: [-5, 5],
      duration: 2000,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true
    });
  }, []);

  const handleLogout = () => {
    // GSAP logout animation
    gsap.to([sidebarRef.current, mainRef.current], {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        if (onLogout) onLogout();
      }
    });
  };

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --background: 10 10 15;
            --foreground: 255 255 255;
            --primary: 147 51 234;
            --accent: 59 130 246;
          }
          
          body {
            background: linear-gradient(135deg, rgb(10, 10, 15) 0%, rgb(20, 20, 30) 100%);
            min-height: 100vh;
          }
          
          .crypto-glow {
            box-shadow: 0 0 30px rgba(147, 51, 234, 0.3);
          }
          
          .price-up {
            color: #10b981;
            animation: pulse-green 2s infinite;
          }
          
          .price-down {
            color: #ef4444;
            animation: pulse-red 2s infinite;
          }
          
          @keyframes pulse-green {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes pulse-red {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          .glass-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .gradient-text {
            background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}
      </style>
      <div className="min-h-screen flex w-full">
        <Sidebar ref={sidebarRef} className="border-r border-white/10 bg-black/40 backdrop-blur-xl">
          <SidebarHeader className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3 px-6 py-4">
              <motion.img
                src="/jhgno-logo-main.png"
                alt="JHGNO Logo"
                className="w-12 h-12 object-contain"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  e.target.src = '/jhgno-logo.svg';
                  e.target.onerror = () => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  };
                }}
              />
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg hidden items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">JHGNO</h1>
                <p className="text-xs text-gray-400">Crypto Tracker</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item, index) => (
                    <SidebarMenuItem key={item.title}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-white/10 transition-all duration-200 rounded-lg mb-1 ${
                            location.pathname === item.url ? 'bg-gradient-to-r from-purple-600/20 to-blue-500/20 text-white border border-purple-500/30' : 'text-gray-300'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <item.icon className="w-5 h-5" />
                            </motion.div>
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </motion.div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            {/* Logout Button */}
            <div className="mt-auto p-3">
              <motion.button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-red-500/20 transition-all duration-200 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </SidebarContent>
        </Sidebar>

        <main ref={mainRef} className="flex-1 flex flex-col">
          <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4 md:hidden sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-white/10 p-2 rounded-lg transition-colors duration-200 text-white" />
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400">
                JHGNO CRYPTO TRACKER
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* API Status Indicator */}
      <ApiStatus />
    </SidebarProvider>
  );
}