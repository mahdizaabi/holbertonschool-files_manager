import DBClient from '../utils/db';

const { ObjectID } = require('mongodb');

const acceptedType = ['file', 'folder', 'image'];

class FileModel {
  static async checkParentId(parentId) {
    const file = await DBClient.getparentIdFile(parentId);
    return file;
  }

  constructor({
    userId, name, type, isPublic, data, parentId,
  }) {
    this.userId = userId;
    this.name = name;
    this.type = type;
    this.isPublic = isPublic || false;
    this.parentId = parentId || 0;
    this.data = data;
  }

  get userId() {
    return this._userId;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  get isPublic() {
    return this._isPublic;
  }

  get parentId() {
    return this._parentId;
  }

  set userId(userId) {
    this._userId = ObjectID(userId);
  }

  set name(name) {
    if (!name) {
      throw new Error('Missing name');
    }
    this._name = name;
  }

  set type(type) {
    if (!type || !acceptedType.includes(type)) {
      throw new Error('Missing type');
    }
    this._type = type;
  }

  set isPublic(isPublic) {
    this._isPublic = isPublic;
  }

  set parentId(parentId) {
    if (parentId !== 0) {
      this._parentId = ObjectID(parentId);
    } else {
      this._parentId = 0;
    }
  }

  get data() {
    return this._data;
  }

  set data(data) {
    if (!data && this.type !== 'folder') {
      throw new Error('Missing data');
    }
    this._data = data;
  }

  async addOneToDatabase(localPath) {
    let newEntity;
    if (this.type !== 'folder') {
      newEntity = await DBClient.saveNewFileToDataBase({
        userId: this.userId,
        name: this.name,
        type: this.type,
        isPublic: this.isPublic,
        parentId: this.parentId,
        localPath,
      });
    } else {
      newEntity = await DBClient.saveNewFileToDataBase({
        userId: this.userId,
        name: this.name,
        type: this.type,
        isPublic: this.isPublic,
        parentId: this.parentId,
      });
    }
    return newEntity.ops[0];
  }

  static async isLinkedToUser(docId, userId) {
    const doc = await DBClient.getFile(docId, userId);
    return doc;
  }
}

export default FileModel;
