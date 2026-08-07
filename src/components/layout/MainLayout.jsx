import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {

    return (

        <>

            <Navbar />

            <div className="d-flex">

                <Sidebar />

                <div
                    className="flex-grow-1 p-4"
                >
                    {children}
                </div>

            </div>

        </>

    );

}