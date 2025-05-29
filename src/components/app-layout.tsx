import { Outlet } from 'react-router'
import { AppHeader } from './app-header'
import { AppFooter } from './app-footer'
import { Breadcrumb } from './breadcrumb'
import { Toaster } from './ui/toaster'

export function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col w-full bg-muted/50">
            <AppHeader />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8">
                <div className="py-4 relative z-10">
                    <Breadcrumb />
                </div>
                <div className="flex-1">
                    <Outlet />
                </div>
            </main>
            <AppFooter />
            <Toaster />
        </div>
    )
}