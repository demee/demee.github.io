import React from 'react';
import Navigation from './navigation/navigation';
import Footer from './footer';

const Layout : React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className='layout'>
    <Navigation />
    {children}
    <Footer />
  </div>
);

export default Layout;
