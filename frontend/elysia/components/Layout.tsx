import Header from "./Header";
import Footer from "./Footer";
import { LayoutProps } from "../types";

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="layout">
    <Header />
    {children}
    <Footer />
  </div>
);

export default Layout;