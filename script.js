const https = require("https")
const fs = require("fs")

// SET MAX CONNECTIONS TO 5
https.globalAgent.maxSockets = 5;

// MAX NO. OF PAGES to FETCH
var maxDepth = 50
var currentDepth = 0
const call = (url, index) => {
		https.get(url, (res) => {
			// START TIMER
			console.time(url)
			console.log(index, "called")
			var moreLinks = new Set()
			var file = ""

			// ON EACH CHUNK OF DATA
			res.on('data', (chunk) => {
				lines = chunk.toString().split(" ")
				lines.map((string) => {
					if(string.match(/https:\/\/\medium.com\/*/gi)){
						var strings = string.split("\"")
						strings.forEach(str => {
							if(str.match(/https:\/\/\medium.com\/*/gi)) {
								moreLinks.add(str)
							}
						})
					}
				})
  			});
			
			// ON RESPONSE END
			res.on("end",() => {
				// WRITE FILE TO `/tmp/links` (CHANGE NEED ON WINDOWS)
				fs.appendFileSync("/tmp/links", Array.from(moreLinks).join("\n"))
				var newLinks = Array.from(moreLinks)
				console.log(index, "ended")
				console.timeEnd(url)
				newLinks.forEach(url => {
					// UNTILL MAX DEPTH 
					if (currentDepth < maxDepth) {
						currentDepth++
						// RECURSIVE CALL
						call(url, index++)	
					}	
				})
			})
		})
}

call("https://medium.com",0)
