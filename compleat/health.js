var express = require('express');
var router = express.Router();
const mysql = require('mysql');

let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'my_db'
  })
  
// create DB conection
router.get('/', (req, res)=> 
{
    try{
          // connect
          db.connect((err)=>{
            if(err){
                res.status(500).end(); 
            }
            else
            res.status(200).end();
          });
          
        //   callback(null, {
        //         statusCode: 200,
        //         body: response,
        //     });
    }catch(err){
        res.status(500).end();    
    }

    db.end()
});

module.exports = router;

