#!/usr/bin/env node
var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function(request,response){
	
	var filePath = '' + request.url;
	console.log('Requesting "'+filePath+'"');

	if(filePath == '/') filePath = '/index.html';
	if(filePath == '/students') filePath = '/../server_data/students.json';
	if(filePath == '/aikido/_design/attendance/_view/byCollection') filePath = '/../server_data/byCollection.json';
	if(filePath == '/aikido/_design/attendance/_view/students') filePath = '/../server_data/students_view.json';
	if(filePath == '/aikido/_design/attendance/_view/classes') filePath = '/../server_data/classes_view.json';
	
	var extname = path.extname(filePath);
	var contentType = 'text/html';
	
	switch(extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.json':
			contentType = '';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		case '.png':
			contentType = 'image/png';
			break;
	}

	filePath = './attachments' + filePath
	console.log('Serving "'+filePath+'"');
	path.exists(filePath, function(exists) {
		if(exists){
			fs.readFile(filePath, function(error, content){
				if(error){
					response.writeHead(500);
					response.end();
				} else {
					response.writeHead(200,{'Content-type':contentType});
					response.end(content,'utf-8');
				}
			});
		} else {
			response.writeHead(404);
			response.end();
		}
	});
	
}).listen(9292);

console.log('Server running at http://localhost:9292/');