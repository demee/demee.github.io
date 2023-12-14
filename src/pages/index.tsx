import React from 'react';
import type { PageProps } from 'gatsby';
import Head from '../components/head';
import Navigation from '../components/navigation/navigation';
import Footer from '../components/footer';

const IndexPage: React.FC<PageProps> = () => (
  <>
    <Navigation />
    <main>Welcome to demee.org</main>
    <Footer />
  </>
);

export default IndexPage;
export { Head };
