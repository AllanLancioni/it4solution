import {Database, DatabaseCollection} from '../database.class';

export const usersCollection: DatabaseCollection = Database.createCollection('User');

// SEED
usersCollection.insertMany([
  {
    user: 'admin',
    email: 'admin@admin.com',
    password: '123'
  },
  {
    user: 'Allan',
    email: 'Allan@email.com',
    password: '123'
  }
]).then(x => console.log(usersCollection, x));
