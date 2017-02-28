var topolr=require("topolr-util");
var mysql=require("mysql");

var wrapper=function (option) {
    this._option=option;
    this._pool=mysql.createPool(option);
};
wrapper.prototype.query=function (sql,value) {
    var ps=topolr.promise(),ths=this;
    this._pool.getConnection(function (err,connection) {
        if(err){
            console.log(err);
            ps.reject(err);
        }else {
            connection.query(sql, value, function (err, rows) {
                connection.release();
                if (err) {
                    console.log(err);
                    ps.reject(err);
                } else {
                    ps.resolve(rows);
                }
            });
        }
    });
    return ps;
};
wrapper.prototype.close=function () {
    this._pool.end();
};

module.exports=function (option) {
    var ps=topolr.promise(),wrap=new wrapper(option);
    ps.scope(wrap);
    ps.resolve();
    return ps;
};
