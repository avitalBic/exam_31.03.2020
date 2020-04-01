var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');

router.use(bodyParser.json({extended: false}));

// ---- endCon
function endCon(){
    db.end( function(err) {
        if (err) {console.log("Error ending the connection:",err);}
    
       //  reconnect in order to prevent the"Cannot enqueue Handshake after invoking quit"
         db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '12345678',
            database: 'my_db'
    
            });
        // callback(null, {
        //     statusCode: 200,
        //     body: response,
    
        // });
    });
}

// -- DB 
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'my_db'
  })

function conectDb()
{
    db.connect((err)=>{
    if(err){
        console.log("my sql1 "+ err);

    }
    else
    console.log('mysql connected...');
  });

}
  

// 
router.get('/', (req, res)=> 
{
    try{
        conectDb();
        // const obj = {"source": "theSource", "destination": "theDestination", "hits": totalNumberOfHits}
        const q =  `select * from Distance where
        counterAB = (select max(counterBA) from (select counterBA from Distance union select counterAB from Distance) as counter)
        or counterBA = (select max(counterBA) from (select counterBA from Distance union select counterAB from Distance) as counter)`
        console.log("quert is \n",q,"\n");
        db.query(q,(err,result,fields)=>{
            endCon();
            if(!err)
            {   
                console.log(result[0])
                if(result.length !=0){
                    let s= "", d="", c="";
                    if(result[0].counterAB > result[0].counterBA)
                        {
                            s = result[0].locationA;
                            d = result[0].locationB;
                            c = result[0].counterAB;
                        }
                    else
                    {
                        s = result[0].locationB;
                        d = result[0].locationA;
                        c = result[0].counterBA;
                    }
                
                const obj = {"source": s, "destination": d, "hits": c}
                console.log(obj.source);
                res.send(obj);
                }
                
            }
            else{
                res.end(err.code);
            }

        });

    }catch(err){
        res.end("err" , err.code);
    }
});

module.exports = router;
