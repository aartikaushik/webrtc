module.exports = {
  getRecords: function(req, res) { 

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});   
       
      
 
       try {
    const client = await pool.connect()
    const result = await client.query('select * from test_table');
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }

  },
    

    
    
     
    
   
    
};

