import React from 'react';
import { PageProps, graphql } from 'gatsby';
import Layout from '../components/layout';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';


const About: React.FC<PageProps<Queries.AboutQuery>>= ( { data }) => {
  console.log(data);
  return (
  <Layout>
    <h1>{data.contentfulAbout?.title}</h1>
    <div>
      {documentToReactComponents(JSON.parse(data.contentfulAbout?.content?.raw || ''))}
    </div>
  </Layout>
)
};

export const query = graphql`
  query About {
    contentfulAbout(title: {eq: "About"}) {
      id
      title, 
      content {
        raw
      }
    }
  }
`

export default About;
