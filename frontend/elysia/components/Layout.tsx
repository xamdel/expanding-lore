// components/Layout.tsx
import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="layout">
    <Header />
    {children}
    <Footer />
  </div>
);

export default Layout;