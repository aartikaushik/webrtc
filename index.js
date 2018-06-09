var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var PORT = process.env.PORT || 5000



app.get('/', function(req, res){

 res.sendFile(__dirname + 'client/index.html');

});

app.listen(PORT, function(){
console.log("listening");
});




setInterval( function() {

var msg = Math.random();
io.emit('message', msg);
console.log(msg);

}, 1000);


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
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


