import { Schema, model } from 'mongoose';
import { IFeed } from '@interfaces/feed/IFeed';

const FeedSchema = new Schema<IFeed>({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }, 
    summary:{
        type: String,
        required: false
    },
    publishedAt: {
        type: Number,
        required: true
    },
    source: {
        type: String,
        required: true
    }
});

export default model<IFeed>('Feed', FeedSchema);