import * as React from 'react';
import { graphql, PageProps } from 'gatsby';


const TypegenPage = ({ data }: PageProps<Queries.TypegenPageQuery>) => (
    <main>
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
