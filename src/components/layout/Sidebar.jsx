import { NavLink } from "react-router-dom";

export default function Sidebar({
    mobileOpen = false,
    onNavigate = () => { },
}) {
    const menuItems = [
        {
            label: "Dashboard",
            path: "/dashboard",
        },
        {
            label: "Houses",
            path: "/houses",
        },
        {
            label: "Residents",
            path: "/residents",
        },
        {
            label: "Payments",
            path: "/payments",
        },
        {
            label: "Expenses",
            path: "/expenses",
        },
        {
            label: "Reports",
            path: "/reports",
        },
        {
            label: "House Residents",
            path: "/house-residents",
        },
    ];

    return (
        <aside
            className={`rt-sidebar bg-white border-end ${mobileOpen ? "rt-sidebar-open" : ""
                }`}
        >
            <div className="p-3">
                <div className="text-uppercase text-muted small fw-semibold mb-3">
                    Main Menu
                </div>

                <nav className="d-flex flex-column gap-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                                `text-decoration-none rounded px-3 py-2 ${isActive
                                    ? "bg-primary text-white"
                                    : "text-dark"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </aside>
    );
}