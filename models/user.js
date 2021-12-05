// modules setup
const mongoose = require('mongoose');
const crypto = require('crypto');

// mongodb model setup
const userSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const UserSchema = mongoose.model('users', userSchema);

class User {

  constructor(login, password) {
    this.login = login;
    this.password = password;
  };

  // adds user to mongodb
  createUser(){
    this.password = this.hashPassword();
    return new UserSchema(this).save();
  };

  // checks credentials
  async authenticate() {
    let doc = await UserSchema.findOne({login: this.login});
    if ( doc ) {
      if ( doc.password === this.hashPassword() ){
        this.password = this.hashPassword();
        return this;
      };
    };
  };

  hashPassword(){
    let hash = crypto.createHash('sha256')
                        .update(this.password)
                        .digest('hex');
    return hash;
  };

  // gets user by login from mongodb
  static async get(uid) {
    return Promise.resolve(UserSchema.findOne( {login: uid} ));
  };

  // gets user by obj.login from mongodb
  static async getUser(obj) {
    return Promise.resolve(UserSchema.findOne( {login: obj.login} ));
  };

};

module.exports = User;
