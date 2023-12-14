import React from 'react';
import Navigation from './navigation/navigation';
import Footer from './footer';
import '../styles/global.css';


const Layout = ({ children }) => (
  <div>
    <Navigation />
    {children}
    <Footer />
  </div>
);

export default Layout;
