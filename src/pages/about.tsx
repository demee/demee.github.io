import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';

const About: React.FC = () => (
  <Layout>
    <h1>About</h1>
    <p>{}</p>
    <p>
      This is a blog about the things I've learned while building this blog.</p>
  </Layout>
);

export const pageQuery = graphql`{
  site {
    siteMetadata {
      title
    }
  }
}`;

export default About;
