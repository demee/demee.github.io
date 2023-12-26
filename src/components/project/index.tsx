import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import ProjectProps from './project-props';

const Project: React.FC<ProjectProps> = ({ project }) => {
    return (
        <div>
            <h2>{project.title}</h2>
            <div>
                {documentToReactComponents(JSON.parse(project.description?.raw || ''))}
            </div>
            <h4><a href={project.github || ''}>{project.github}</a></h4>
        </div>);
};

export default Project;