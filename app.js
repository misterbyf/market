const express = require('express');
const mysql = require('mysql')

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'pug');




let connection = mysql.createConnection({
    host: 'localhost',
    user: 'dobruyvesher',
    password: 'dobruyvesher',
    database: 'market'
});

app.use(express.json());


app.get('/', (req, res) => {
    connection.query(
        'SELECT * FROM models',
        (err, result) => {
            if(err) throw err;
            let models = {};
            //ArrayHelper
            for(let i = 0; i < result.length; i++) {
                models[result[i]['id']] = result[i];
            };
            console.log(models);
            res.render('main', {
                models: JSON.parse(JSON.stringify(models))
            });  
        }
    );
});


app.get('/categories', (req, res) => {
    console.log(req.query.id);

    let categoriesId = req.query.id;

    let categories = new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM category WHERE id=' + categoriesId,
            (err, result) => {
                if(err) reject(err)
                resolve(result);
            }
        );
    });

    let models = new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM models WHERE category=' + categoriesId,
            (err, result) => {
                if(err) reject(err);
                resolve(result);
            }
        );
    });


    Promise.all([categories, models]).then((val) => {
        res.render('categories', {
            categories: JSON.parse(JSON.stringify(val[0])),
            models: JSON.parse(JSON.stringify(val[1]))
        });        
    });
});


app.get('/models', (req, res) => {
    console.log(req.query.id);

    connection.query(
        'SELECT * FROM models where id=' + req.query.id,
        (err, result) => {
            if(err) throw err;
            res.render('models', {
                models: JSON.parse(JSON.stringify(result))
            });
        }
    );    
});


app.post('/get-category-list', (req, res) => {
    connection.query(
        'SELECT id, category FROM category',
        (err, result) => {
            if(err) throw err;
            res.json(result);
        }
    );
});


app.post('/get-models-info', (req, res) => {
    if(req.body.key != 0){
        connection.query('SELECT id, name, cost FROM models WHERE id IN (' + req.body.key.join(',') + ')' ,(err, result) => {
            if(err) throw err;
            let models = [];
            for(let i = 0; i < result.length; i++) {
                models[result[i]['id']] = result[i];
            }       
            res.json(models);
        });
    }else{
        res.send('0');
    }
    
});


app.listen(8080, () => {
    console.log('Server has been started....');
});