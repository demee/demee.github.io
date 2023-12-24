import React from 'react';
import Layout from '../components/layout';
import Post from '../components/post';
import { PageProps, graphql } from 'gatsby';

const Blog : React.FC<PageProps<Queries.PostQuery>> = ({data}) => (
    <Layout>
        <h1>Blog</h1>
        <div>
            {data.allContentfulPost.nodes.map((post) => (
                <Post key={post.title} post={post as Queries.ContentfulPost} />
            ))}

        </div>
    </Layout>
);

export const query = graphql`
query Post {
  allContentfulPost {
    totalCount
    nodes {
      title
      content {
        raw
      }
      updatedAt
    }
  }
}`

export default Blog;
