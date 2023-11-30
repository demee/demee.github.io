import React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import '../styles/index.scss';

const pageStyles = {
  color: '#232129',
  padding: 96,
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
};

const IndexPage: React.FC<PageProps> = () => (
  <>
    <header> 
    </header>
    <main style={pageStyles}></main>
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
