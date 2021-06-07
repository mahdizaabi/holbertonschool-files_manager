import { MongoClient } from 'mongodb';

const { ObjectID } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
    const uri = `mongodb://${host}:${port}`;

    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    client.connect((err) => {
      if (!err) {
        this.status = true;
        this.db = client.db(DB_DATABASE);
      } else {
        this.status = false;
      }
    });
  }

  isAlive() {
    return this.status;
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }

  async checkEmail(email) {
    return this.db.collection('users').findOne({ email });
  }

  async setNewUser(newUser) {
    return this.db.collection('users').insertOne(newUser);
  }

  async getUserFromEmail(email) {
    return this.db.collection('users').findOne({ email });
  }

  async getUserById(userId) {
    return this.db.collection('users').findOne({ _id: ObjectID(userId) });
  }

  async getparentIdFile(parentId) {
    return this.db.collection('files').findOne({ _id: ObjectID(parentId) });
  }

  async saveNewFileToDataBase(newFile) {
    return this.db.collection('files').insertOne(newFile);
  }

  async getFile(fileId, userId) {
    return this.db.collection('files').findOne({ _id: ObjectID(fileId), userId });
  }

  async getAllFilesBasedParentId(userId, parentId) {
    return this.db.collection('files').find({ userId, parentId });
  }
}

export default new DBClient();
