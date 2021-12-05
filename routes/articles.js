const Article = require('../models/article');

exports.list = (req, res) => {
  Article.findArticles(req.session.uid).then((result) => {
    res.render('articles', {
      title: 'Новостные статьи',
      articles: result
    });
  })
};

exports.submit = (req, res, next) => {
  const data = req.body.article;
  let article = new Article(req.session.uid, data.title, data.content);

  Article.jsonToCSV(article);
  article.save();
  res.redirect('/articles');
};

exports.showfull = (req, res, next) => {
  let id = req.params[0];
  Article.findArticles(req.session.uid).then((result) => {
    let i = 0;
    let article = '';
    if ( result[i].id === id ) {
      article = result[i];
    } else {
      while ( result[i].id != id) {
        i++;
      };
      article = result[i];
    };
    res.render('fullarticle', {
      title: article.title,
      articles: result,
      article: article
    });
  });
};

exports.delete = (req, res, next) => {
  let id = req.params[0];
  Article.deleteArticleById(id).then(() => {
    res.redirect('/articles');
  });
};
