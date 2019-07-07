import {Database, DatabaseCollection} from '../database.class';

export const likesCollection: DatabaseCollection = Database.createCollection('Like');

// SEED
if (!likesCollection.hasKeyOnSession) {
  likesCollection.insertMany([
    {
      type: 0, // 0 -> like / 1 -> unlike
      postId: 1,
      userId: 1
    },
    {
      type: 0, // 0 -> like / 1 -> unlike
      postId: 2,
      userId: 1
    },
    {
      type: 1, // 0 -> like / 1 -> unlike
      postId: 1,
      userId: 2
    }
  ]).then(x => console.log(likesCollection, x));
}
