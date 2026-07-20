"use client";


import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { TooltipProvider } from "@/components/ui/tooltip"

// import PageTransition from "@/app/blocks/Animate-Components/Page-Transition";
import PagesTransition from "@/app/blocks/Animate-Components/pages-transition";
// import RouteTransition from "@/app/blocks/Animate-Components/route-transition";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />

                  <SidebarInset >
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                      <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                    
                              <PagesTransition />

                            <TooltipProvider>

                              {/* <PageTransition> */}
                                {/* <RouteTransition> */}
                                  {children}
                                {/* </ RouteTransition> */}
                              {/* </ PageTransition> */}


                            </TooltipProvider>
            
                        </div>
                      </div>
                    </div>
                  </SidebarInset>

      {/* <main className="font-inter"> */}

      {/* </main> */}

      </SidebarProvider>
  );
}