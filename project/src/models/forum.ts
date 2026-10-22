export class ReplyModel {
    id!: number;
    author!: string;
    authorId?: number | string | null;
    text!: string;
    date?: string;
    createdAt?: string;
    image!: string;
    isExpert?: boolean;
    replies!: ReplyModel[];
}

export class PostModel {
    id!: number;
    author!: string;
    authorId?: number | string | null;
    title!: string;
    content!: string;
    category!: string;
    date?: string;
    createdAt?: string;
    likes!: number;
    likedBy?: (number | string)[];
    image!: string;
        isExpert?: boolean;
    sensitivity?: string;
    replies!: ReplyModel[];
}

export interface AddPostModel {
    author: string;
    authorId?: number | string | null;
    title: string;
    content: string;
    category: string;
        image: string;
    isExpert?: boolean;
    sensitivity?: string;
}

export interface AddReplyModel {
    author: string;
    authorId?: number | string | null;
    isExpert?: boolean;
    text: string;
    image: string;
    replyingTo: number | null;
}