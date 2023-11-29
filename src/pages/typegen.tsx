import * as React from 'react';
import { graphql, PageProps } from 'gatsby';

const pageStyles = {
  color: '#232129',
  padding: '96px',
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
};

const TypegenPage = ({ data }: PageProps<Queries.TypegenPageQuery>) => (
    <main style={pageStyles}>
      <p>Site title: {data.site?.siteMetadata?.title}</p>
      <hr />
      <p>Query Result:</p>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </main>
);

export default TypegenPage;

export const query = graphql`
  query TypegenPage {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
