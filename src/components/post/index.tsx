import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import React from 'react';
import PostProps from './postprops';

const Post: React.FC<PostProps> = ({ post }) => {

    return (
        <div>
            <h1>{post.title}</h1>
            <div>
                {documentToReactComponents(JSON.parse(post.content?.raw || ''))}
            </div>
        </div>
    )
};

export default Post;