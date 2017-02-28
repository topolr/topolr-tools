var mysql=require("../lib/mysql");
var topolr=require("topolr-util");
module.exports={
    command:"model",
    desc:"to build model files",
    paras:[],
    fn:function (parameters,cellmapping,allmapping) {
        var n=[];
        mysql(allmapping.mysql).then(function () {
            return this.query("show table status");
        }).then(function (a) {
            var queue=topolr.queue(),ths=this,ps=topolr.promise(),r={};
            queue.complete(function () {
                ps.resolve(r);
            });
            a.forEach(function (b) {
                queue.add(function (c,d) {
                    console.log(d);
                    var e=this;
                    ths.query("show full fields from "+d).done(function (k) {
                        r[d]=k;
                        e.next();
                    });
                },null,b.Name);
            });
            queue.run();
            return ps;
        }).done(function (a) {
            console.log(a);
            this.close();
        });
        // mysql(allmapping.mysql).then(function () {
        //     console.log("----->");
        //     return this.query("select * from user");
        // }).then(function (rows) {
        //     console.log("----->2");
        //     n.push(rows);
        //     return this.query("select * from articles");
        // }).done(function (t) {
        //     console.log("----->3");
        //     n.push(t);
        //     console.log(n);
        //     this.close();
        // });
    }
};