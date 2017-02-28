var topolr=require("topolr-util");
var readlineSync = require('readline-sync');

var creater={
    webinfo:function (path,info) {
        return topolr.promise(function (a) {
            a();
        }).then(function () {
            if (!topolr.file(path + "WEBINF/web.json").isExists()) {
                return topolr.file(path + "WEBINF/web.json").write(JSON.stringify({
                    "page": {
                        "index": "index.nsp",
                        "404": "index.nsp"
                    },
                    "upload": {
                        "temp": "{project}/_temp/",
                        "encoding": "utf-8",
                        "max": 20971520
                    },
                    "service": [
                        {
                            "name":"cetusservice",
                            "option":{
                                "srcPath":"app/site/src/",
                                "root":"option.root.blog",
                                "cache":{
                                    "type":"file",
                                    "path":"{project}/cache/",
                                    "cycle":10000
                                }
                            }
                        },
                        {
                            "name":"daoservice",
                            "option":{
                                "host": "localhost",
                                "port":"3306",
                                "debug":false,
                                "database":"blog",
                                "user": "root",
                                "password": "",
                                "connectionLimit ": "200"
                            }
                        },
                        {
                            "name": "mvcservice",
                            "option": {}
                        }
                    ],
                    "filter": [
                        {"name": "mvcfilter", "option": {}},
                        {"name": "cachefilter", "option": {
                            "etag": true,
                            "cacheSetting": {
                                "png": 20000,
                                "js": 2000,
                                "default": 2000
                            }
                        }},
                        {"name": "zipfilter", "option": {
                            "gzip": "js,css"
                        }}
                    ]
                }, null, 4));
            }
        }).then(function () {
            if (!topolr.file(path + "WEBINF/src/controller.js").isExists()) {
                return topolr.file(path + "WEBINF/src/controller.js").write(
                    "/*\n" +
                    " * @packet controller;\n" +
                    " */\n" +
                    "Module({\n" +
                    "    name: \"test\",\n" +
                    "    extend: \"controller\",\n" +
                    "    path: \"/test\",\n" +
                    "    dao: \"mysql\",\n" +
                    "    \"/test\": function (done) {\n" +
                    "        this.request.setAttr(\"desc\",\"this is thr desc of the url:/test/test\");\n" +
                    "        done(this.getCspView(\"index.csp\",{data:\"this is data\"}));\n" +
                    "    }\n" +
                    "});");
            }
        }).then(function () {
            if (!topolr.file(path + "index.nsp").isExists()) {
                return topolr.file(path + "index.nsp").write(
                    "<!DOCTYPE html>\n" +
                    "<html>\n" +
                    "    <head>\n" +
                    "        <title><%=title;%></title>\n" +
                    "        <meta charset=\"UTF-8\">\n" +
                    "        <meta name='description' content='<%=data.description;%>'>\n" +
                    "        <meta name='Keywords' content='<%=data.keywords;%>'>\n" +
                    "        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                    "    </head>\n" +
                    "    <body><%=data.body;%></body>\n" +
                    "</html>");
            }
        }).then(function () {
            if (!topolr.file(path + "package.json").isExists()) {
                return topolr.file(path + "package.json").write(JSON.stringify({
                    name: info.name,
                    author: "",
                    version: "0.0.1",
                    description: info.description,
                    keywords:info.keywords,
                    license: "",
                    bugs: "",
                    dependencies: {},
                    devDependencies: {},
                    scripts: {}
                }, null, 4));
            }
        }).error(function (a) {
            console.log(a);
        });
    },
    app:function (path,info) {
        return topolr.promise(function (a) {
            a();
        }).then(function () {
            if(!topolr.file(path+"app/site/src/topolr-builder.js").isExists()){
                return topolr.file(path+"app/site/src/topolr-builder.js").write("module.exports={\n" +
                "    basePath: \""+(path+"app/site/src/")+"\",\n"+
                "    bootPacket:\"option.root\",\n"+
                "    bootFolder:\"option/\",\n"+
                "    output:\"../dist/\",\n"+
                "    debug:true,\n"+
                "    pageTemp:\"../../index.html\"\n"+
                "}\n");
            }
        }).then(function () {
            if(!topolr.file(path+"app/site/src/option/root.js").isExists()){
                topolr.file(path+"app/site/src/option/root.js").write('' +
                    '/*\n'+
                    ' * @packet option.root;\n'+
                    ' */\n'+
                    'Option({\n'+
                    '    name:"blog",\n'+
                    '    option:{\n'+
                    '        override_onendinit:function(){\n'+
                    '            App().setInfo({\n'+
                    '                title:"ssdsd",\n'+
                    '                description:"sdsdsd",\n'+
                    '                keywords:"sdsdsd"\n'+
                    '            });\n'+
                    '            App().snapshot();\n'+
                    '        }\n'+
                    '    }\n'+
                    '});');
            }
        });
    }
};
module.exports= {
    command: "create",
    desc: "to start a topolr project",
    paras: [],
    fn: function (parameters, cellmapping, allmapping) {
        var ops={
            title:{desc:"Your app title: ",default:"myApp"},
            keywords:{desc:"Your app keywords: ",default:"app,blog"},
            description:{desc:"Your app description: ",default:"my blog"}
        };
        var r={};
        for(var i in ops){
            var a=ops[i];
            r[i]=readlineSync.question(a.desc)||a.default;
        }
        console.log(r);
        var path="G:/test/";
        creater.webinfo(path,r).then(function () {
            return creater.app(path,r);
        }).done(function () {
            console.log(">> done");
        });
    }
};