// run `node index.js` in the terminal
const path=require("path");
const fs=require("fs");
const http=require("http");
const Port=process.env.PORT || 3000;
const Rootpath=path.join(__dirname,"..");
const server=http.createServer((req,res)=>{
  if(req.url==="/"){
    
     fs.readFile(path.join(Rootpath,"client","public","index.html"),"utf8",(err,data) =>{
      
        if(err){
          res.writeHead(404);
          res.end("<h1>404</h1><h2>File not found</h2>")
       }else{

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
        
       }

     });
  }

  if(req.url==="/style"){
    
    fs.readFile(path.join(Rootpath,"client","src","styles","style.css"),"utf8",(err,data) =>{
     
       if(err){
         res.writeHead(404);
         res.end("<h1>404</h1><h2>File not found</h2>")
      }else{

       res.writeHead(200, {'Content-Type': 'text/css'});
       res.end(data);
       
      }

     
    });
  }

  //script request
  if(req.url==="/script"){
    
    fs.readFile(path.join(Rootpath,"client","src","script.js"),"utf8",(err,data) =>{
     
       if(err){
         res.writeHead(404);
         res.end("<h1>404</h1><h2>File not found</h2>");
         console.log(err);
      }else{

       res.writeHead(200, {'Content-Type': 'application/javascript'});
       res.end(data);
       console.log(data);
      }

    });
 }


});
  
server.listen(Port,()=>{
  console.log(`server runs in ${Port}`);
});