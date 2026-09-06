import { useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    function closeSidebar() {
        setSidebarOpen(false);
    }

    return (
        <div className="rt-layout d-flex flex-column min-vh-100 bg-light">
            <Navbar
                onMenuClick={() =>
                    setSidebarOpen((current) => !current)
                }
            />

            <div className="rt-layout-body d-flex flex-grow-1 position-relative">
                {sidebarOpen && (
                    <button
                        type="button"
                        className="rt-sidebar-overlay d-md-none"
                        aria-label="Close navigation"
                        onClick={closeSidebar}
                    />
                )}

                <Sidebar
                    mobileOpen={sidebarOpen}
                    onNavigate={closeSidebar}
                />

                <main className="rt-main">
                    <div className="rt-main-content">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}