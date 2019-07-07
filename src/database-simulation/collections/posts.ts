import {Database, DatabaseCollection} from '../database.class';

export const postsCollection: DatabaseCollection = Database.createCollection('Post');

// SEED
postsCollection.insertMany([
  {
    title: 'Post 1',
    description: 'Description of post 1',
    tags: ['tag1', 'tag2'],
    userId: 1,
  },
  {
    title: 'Post 2',
    description: 'Description of post 2',
    tags: ['tag1', 'tag2'],
    userId: 1,
  },
  {
    title: 'Post do Allan',
    description: 'Description of post 3',
    tags: ['post', 'allan'],
    userId: 2,
  },
]).then(x => console.log(postsCollection, x));
