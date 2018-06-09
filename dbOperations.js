module.exports = {
  getRecords: function(req, res) {    
        var pg = require('pg');  
      
        //You can run command "heroku config" to see what is Database URL from Heroku belt
      
        var conString = process.env.DATABASE_URL || "postgres://bymbnvfyrosgvz:1aee5875cdbedd2d8c4fbbb9c1f9b44088f2b36111f9c78090cbf58986e9f8e1@ec2-54-225-107-174.compute-1.amazonaws.com:5432/d3gvoum1kvv887";
        var client = new pg.Client(conString);
        try{
        client.connect();
        var query = client.query("select * from test_table");
        res.json(query);
        client.release();
        } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
  }
    

    
    
     
    
   
    
};

