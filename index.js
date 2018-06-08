var app = require('express')();
var http = require('http').Server(app);
var PORT = process.env.PORT || 5000



app.get('/', function(req, res){

 res.send("hello world 5");

});

app.listen(PORT, function(){
console.log("listening");
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM test_table');
    res.render('pages/db', result);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});



