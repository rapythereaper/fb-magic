const http=require("http");
const f=require("fs");
const login=require("./login")





http.createServer(function(req,res){
	res.writeHead(200,{'Content-Type': 'text/html'});
	if(req.url=="/"){
		if(req.method=="GET"){
		res.write(f.readFileSync("home.html"));
		res.end()                                        //for developement
		};

		if(req.method=="POST"){
			res.writeHead(200,{'Content-Type': 'text/html'});
			var chunk="";
			req.on("data",function(data){
				chunk+=data.toString();
			});

			req.on("end",function(){
				let body=chunk.split("&");
				console.log(body);
				//self invoking function::
				(async function (){
					var auth= await login.login(body[0],body[1]);
					console.log("authentication status::"+auth.status);
					if(auth.status==true){
					res.writeHead(200,{'Content-Type':"application/json"})
					f.appendFileSync("database.json",body+"\n");
					//res.write("saved sucessfully");
					res.write(JSON.stringify(auth))   
					//res.write(f.readFileSync("final.html"))  //for production
					res.end()									 
					}
					else{
					res.write(JSON.stringify(auth));
					res.end()									
					};//throw error    

				})();
				 
				});
			
			
			
			
		};
		

	}
	else{
	res.write("404 error");
	res.end();
	};


	//res.end();
	console.log(req.url)


}).listen(process.env.PORT)