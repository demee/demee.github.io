import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import ProjectProps from './project-props';

const Project: React.FC<ProjectProps> = ({ project }) => {
    return (
        <div>
            <h1>{project.title}</h1>
            <h3>{project.github}</h3>
            <div>
                {documentToReactComponents(JSON.parse(project.description?.raw || ''))}
            </div>
        </div>);
};

export default Project;