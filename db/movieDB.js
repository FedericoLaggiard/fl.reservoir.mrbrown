var sqlite3 = require('sqlite3').verbose();
var db = ''

module.exports = {
    test: function(cb){

        db = new sqlite3.Database('C:/ProgramData/Team MediaPortal/MediaPortal/database/movingpictures.db3',sqlite3.OPEN_READWRITE,function(err,success){
            if(err) throw err;

           

            var ret = [];

            db.all("SELECT * from movie_info", function(err, rows) {
                if(err) throw err;

                ret = rows;
                db.close();
                cb(null, ret);
            });

            
            
        });

        

    }
}