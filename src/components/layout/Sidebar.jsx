import { NavLink } from "react-router-dom";

export default function Sidebar() {

    const menuItems = [
        {
            label: "Dashboard",
            path: "/dashboard"
        },
        {
            label: "Houses",
            path: "/houses"
        },
        {
            label: "Residents",
            path: "/residents"
        },
        {
            label: "Payments",
            path: "/payments"
        },
        {
            label: "Expenses",
            path: "/expenses"
        },
        {
            label: "Reports",
            path: "/reports"
        },
        {
            label: "House Residents",
            path: "/house-residents"
        }
    ];

    return (
        <aside
            className="bg-white border-end d-none d-md-block"
            style={{
                width: "240px",
                flexShrink: 0
            }}
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
                            className={({ isActive }) =>
                                `text-decoration-none rounded px-3 py-2 ${
                                    isActive
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