var topolr=require("topolr-util");
var util={
	cloneRepo:function(path,local){
		var ps=topolr.promise();
		git.Clone(path, local,{
        	fetchOpts :{
        		callbacks: {
				    certificateCheck: function() {
				    	return 1;
				    }
			    }
        	}
		}).then(function () {
			ps.resolve();
        }).catch(function(err) {
        	ps.reject(err);
        });
    	return ps;
	},
	downloadZip:function(path,localFolder){
		var zip = require("zip"), request = require('request'), path = "";
        localFolder = (localFolder + "/").replace(/[\/]+/g, "/");
        topolr.file(localFolder + "/_cache_.zip").write("").done(function () {
            var ws = fs.createWriteStream(localFolder + '/_cache_.zip');
            request(zipPath).on('response', function (response) {
                var total = response.headers['content-length'] || "", nowis = 0, isend = false;
                response.on('data', function (data) {
                    if (total != "") {
                        nowis += data.length;
                        var persent = Math.round((nowis / total) * 100);
                        if (!isend) {
                            process.stdout.clearLine();
                            process.stdout.cursorTo(0);
                            process.stdout.write('     Downloading... ' + persent + '%');
                        }
                        if (persent === 100 && isend === false) {
                            process.stdout.write("\n");
                            isend = true;
                        }
                    } else {
                        console.log("     Download...");
                    }
                });
            }).on('error', function (err) {
                console.error("[server] download zip file error");
            }).pipe(ws);
            ws.on('finish', function () {
                console.log("[server] zip download success.Now release the files");
                var data = fs.readFileSync(localFolder + '/_cache_.zip');
                var files = [];
                zip.Reader(data).forEach(function (entry) {
                    if (entry.isFile()) {
                        if (entry.getName().indexOf("package.json") !== -1 && path === "") {
                            path = localFolder + entry.getName();
                        }
                        files.push({
                            path: localFolder + entry.getName(),
                            data: entry.getData()
                        });
                    }
                });
                topolr.file(localFolder + '/_cache_.zip').remove();
                if (path !== "") {
                    var qe = topolr.queue(), isend = false;
                    qe.progress(function (a) {
                        var persent = Math.round((a.runed / a.total) * 100);
                        if (!isend) {
                            process.stdout.clearLine();
                            process.stdout.cursorTo(0);
                            process.stdout.write('     Release... ' + persent + '%');
                        }
                        if (persent === 100 && isend === false) {
                            process.stdout.write("\n");
                            isend = true;
                        }
                    });
                    qe.complete(function () {
                        console.log("[server] release ok,install the project");
                        console.log("     Building...");
                        var q = path.split("/");
                        q.splice(q.length - 1, 1);
                        q = q.join("/");
                        var options = {
                            encoding: 'utf8',
                            timeout: 0,
                            maxBuffer: 200 * 1024,
                            killSignal: 'SIGTERM',
                            setsid: false,
                            cwd: q,
                            env: null
                        };
                        var cp = require('child_process');
                        cp.exec('npm install', options, function (e, stdout, stderr) {
                            console.log("[server] install the project end.");
                            fn && fn(q);
                        });
                    });
                    files.forEach(function (a) {
                        qe.add(function () {
                            var ths = this;
                            topolr.file(a.path).write(a.data).done(function () {
                                ths.next();
                            });
                        });
                    });
                    qe.run();
                } else {
                    console.log("[server] the zip file is not a server project.");
                }
            });
        });
	}
};

module.exports=util;