import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const Layout = () => {
  return (
    // min-h-screen asegura que el layout ocupe toda la pantalla
    // flex-col permite que el contenido crezca y empuje al footer
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
