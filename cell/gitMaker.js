var git = require("nodegit");
module.exports= {
    command: "git",
    desc: "to start a topolr project",
    paras: [],
    fn: function (parameters, cellmapping, allmapping) {
        git.Clone("https://git.oschina.net/hou80houzhu/topolr-util.git", "G:/test2/tmp",{
        	fetchOpts :{
        		callbacks: {
				    certificateCheck: function() {
				    	return 1;
				    }
			    }
        	}
		}).then(function () {
            console.log("done");
        }).catch(function(err) {
        	console.log(err);
        });
    }
};
