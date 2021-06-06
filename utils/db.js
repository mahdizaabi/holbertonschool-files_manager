import { MongoClient } from 'mongodb';

const { ObjectID } = require('mongodb');

class DBClient {
  constructor() {
    this.status = false;
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
    const uri = `mongodb://${this.host}:${this.port}`;

    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    client.connect((err) => {
      if (!err) {
        this.status = true;
      }
      this.db = client.db(this.DB_DATABASE);
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
}

export default new DBClient();
