import React from 'react';

import Layout from '../components/layout';
import { PageProps, graphql } from 'gatsby';
import Project from '../components/project';

const Projects : React.FC<PageProps<Queries.ProjectsQuery>> = ({ data }) => {

    const projectElements = data.allContentfulProject.nodes.map((project) => {
      return <Project key={project.title} project={project as Queries.ContentfulProject} />
    });

    return (
      <Layout>
        <h1>Projects</h1>
        {projectElements}
      </Layout>
    );

};

export const query = graphql`
query Projects {
  allContentfulProject {
    nodes {
      title
      github
      description {
        raw
      }
    }
  }
}
`;

export default Projects;


