
export interface PostModel {
    title: string;
    content: string;
    slug: string;
    date: string;
}

export default interface PostProps {
    post: PostModel;
}
