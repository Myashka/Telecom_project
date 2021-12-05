// modules setup
const mongoose = require('mongoose');
const fs = require('fs');
const converter = require('json-2-csv');
const {PythonShell} = require('python-shell');


// mongodb model setup
const articleSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tag: { type: String, required: false}
});

const ArticleSchema = mongoose.model('article', articleSchema);

class Article {

  constructor( owner, title, content ) {
    this.owner = owner;
    this.title = title;
    this.content = content;
    this.tag = 'true';
  };

  async save() {
    let data = this.content;
    async function runPy(data) {
      const options = {
        mode: 'text',
        pythonOptions: ['-u'],
        args: [data],
      };
      const result = await new Promise((resolve, reject) => {
        PythonShell.run('ml_algorithms/main.py', options, (err, results) => {
          if (err) return reject(err);
          return resolve(results);
        });
      });
      console.log(result);
      return result;
    };
    runPy(data).then((res) => {
      this.tag = res.toString();
      return Promise.resolve(ArticleSchema(this).save());
    });
  };

  static async findArticles(uid) {
    return Promise.resolve(ArticleSchema.find( {owner: uid} ));
  };

  static async deleteArticleById(id) {
    return Promise.resolve(ArticleSchema.deleteOne( {_id: id} ));
  };

  static async jsonToCSV(article) {
    converter.json2csv(article, (err, csv) => {
      if (err) {
        throw err;
      };
      fs.writeFileSync(`${article.owner}.csv`, csv);
    });
  };
};

module.exports = Article;
