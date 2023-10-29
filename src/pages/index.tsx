import React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import logo from '../images/logo.jpg';

const pageStyles = {
  color: '#232129',
  padding: 96,
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
};

const IndexPage: React.FC<PageProps> = () => (
  <>  
    <header>
      <StaticImage src={logo} alt='logo'/>
    </header>
    <main style={pageStyles}>
      
    </main>
    <footer></footer>
  </>
);

export default IndexPage;

export const Head: HeadFC = () => (
  <>
    <title>demee.org</title>
    <link rel="icon" type="image/x-icon" href="../images/favicon.ico" />
  </>
);
