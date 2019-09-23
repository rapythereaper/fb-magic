var puppeteer=require("puppeteer");

//returs status, name, img

exports.login=async function (user_name,password){

	var browser= await puppeteer.launch(args: ["--no-sanfbox","--disable-setuid-sandbox"],);
 
	var page= await browser.newPage();
	await page.goto("https://mbasic.facebook.com/",{waitUntil:"networkidle2"});
	console.log("loging in user.......");
	await page.type("[name=email]",user_name);
	await page.type("[name=pass]",password);
	await page.keyboard.press("Enter");
	await page.waitFor(5000);
	await page.goto("https://mbasic.facebook.com/profile");
	await page.waitFor(5000);
	var auth= await page.evaluate(function(){
		return document.URL
	});
	if(auth=="https://mbasic.facebook.com/?refsrc=https%3A%2F%2Fmbasic.facebook.com%2Fprofile&_rdr"){
		console.log("incorrext username/password");
		browser.close();
		return {statue:false,
				name:"username/password incorrect",
				img:""};
	}
	else{
		console.log("user authenticated /n retriving information...........");
		//validate given information
		var info= await page.evaluate(function(){
			return {name:document.getElementsByClassName("bs")[0].getElementsByTagName("img")[0].alt,
					link:document.getElementsByClassName("bs")[0].getElementsByTagName("a")[0].href}
		});
		console.log("sucessfully loged_in as"+info["name"]);
		await page.goto(info["link"]);         //problem
		await page.waitFor(5000);
		var link=await page.evaluate(function(){
			return document.getElementById("root").getElementsByTagName("img")[0].src  //problem
		})
		console.log(link);
		console.log("all done");
		await browser.close();
		return {status:true,
				name:info.name,
				img:link

				}
	};



};



