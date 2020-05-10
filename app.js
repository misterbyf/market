const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'pug');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'market',
});

app.use(express.json());


app.get('/', (_req, res) => {
  const models = new Promise((resolve, reject) => {
    connection.query(
        'SELECT id, name, cost, image, category from (select id, name, cost, image, category, if(if(@curr_category != category, @curr_category := category, "") != "", @k := 0, @k := @k + 1) as ind from models, (select @curr_category := "") v ) models where ind < 3',
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
  });

  const modelsDescription = new Promise((resolve, reject) => {
    connection.query(
        'SELECT * from category',
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
  });
  Promise.all([models, modelsDescription]).then((val) => {
    res.render('main', {
      models: JSON.parse(JSON.stringify(val[0])),
      description: JSON.parse(JSON.stringify(val[1])),
    });
  });
});


app.get('/categories', (req, res) => {
  // console.log(req.query.id);

  const categoriesId = req.query.id;

  const categories = new Promise((resolve, reject) => {
    connection.query(
        'SELECT * FROM category WHERE id=' + categoriesId,
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        },
    );
  });

  const models = new Promise((resolve, reject) => {
    connection.query(
        'SELECT * FROM models WHERE category=' + categoriesId,
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        },
    );
  });


  Promise.all([categories, models]).then((val) => {
    res.render('categories', {
      categories: JSON.parse(JSON.stringify(val[0])),
      models: JSON.parse(JSON.stringify(val[1])),
    });
  });
});


app.get('/models', (req, res) => {
  console.log(req.query.id);

  connection.query(
      'SELECT * FROM models where id=' + req.query.id,
      (err, result) => {
        if (err) throw err;
        res.render('models', {
          models: JSON.parse(JSON.stringify(result)),
        });
      },
  );
});


app.post('/get-category-list', (_req, res) => {
  connection.query(
      'SELECT id, category FROM category',
      (err, result) => {
        if (err) throw err;
        res.json(result);
      },
  );
});


app.post('/get-models-info', (req, res) => {
  if (req.body.key != 0) {
    connection.query('SELECT id, name, cost FROM models WHERE id IN (' + req.body.key.join(',') + ')',
        (err, result) => {
          if (err) throw err;
          const models = [];
          for (let i = 0; i < result.length; i++) {
            models[result[i]['id']] = result[i];
          }
          res.json(models);
        });
  } else {
    res.send('0');
  }
});
app.get('/order', (_req, res) => {
  res.render('order');
});
app.listen(8080, () => {
  console.log('Server has been started....');
});
