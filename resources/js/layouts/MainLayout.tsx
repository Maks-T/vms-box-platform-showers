import React, {PropsWithChildren} from 'react';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer/Footer';
import {cn} from "@/shared/lib/utils";
import {Toaster} from "sonner";
import FavoritesDrawer from '@/widgets/FavoritesDrawer';
import Breadcrumbs, {BreadcrumbItem} from '@/shared/components/ui/Breadcrumbs';

interface MainLayoutProps extends PropsWithChildren {
  headerOverlaps?: boolean;
  breadcrumbs?: BreadcrumbItem[];
}

export default function MainLayout({children, headerOverlaps = false, breadcrumbs}: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <div className={cn(
        "w-full z-50 sticky top-0 bg-white shadow-sm",
        headerOverlaps && "absolute top-0 left-0 bg-transparent"
      )}>
        <Header/>
      </div>

      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="w-full bg-white border-b border-slate-200/60">
          <div className="max-w-[1240px] mx-auto px-4 md:px-8">
            <Breadcrumbs items={breadcrumbs} variant="dark"/>
          </div>
        </div>
      )}

      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>

      <Footer/>

      <FavoritesDrawer/>
      <Toaster position="top-right" richColors={false}/>
    </div>
  );
}