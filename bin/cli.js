var topolr=require("topolr-util");
var mapping=require("../config/mapping");
var t=topolr.file(process.cwd()+"/mapping.json");
if(t.isExists()){
    var t=t.readSync();
    try{
        topolr.extend(mapping,JSON.parse(t));
    }catch(e){
        console.log(e);
    }
}
var commander=topolr.commander(mapping);
[
    require("../cell/modelMaker"),
    require("../cell/projectMaker"),
    require("../cell/gitMaker")
].forEach(function (a) {
    var command=a.command, desc=a.desc, paras=a.paras, fn=a.fn;
    commander.bind(command,desc,paras,fn);
});
commander.call(process.argv.slice(2));