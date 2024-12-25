const path = require("path");
const fs = require("fs");
const http = require("http");
const Port = process.env.PORT || 3000;
const Rootpath = path.join(__dirname, "..");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.readFile(path.join(Rootpath, "client", "public", "index.html"), "utf8", (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("<h1>404</h1><h2>File not found</h2>")
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }


  if (req.url === "/style") {
    fs.readFile(path.join(Rootpath, "client", "src", "styles", "style.css"), "utf8", (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("<h1>404</h1><h2>File not found</h2>")
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
      }

    });
  }


  //script request

  if (req.url === "/script") {
    fs.readFile(path.join(Rootpath, "client", "src", "script.js"), "utf8", (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("<h1>404</h1><h2>File not found</h2>");
        console.log(err);

      } else {

        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);

      }


    });

  }

  //login service.
  if (req.url === "/login") {
    let body = '';
    let user;//to store username
    let pass;//to store password

    req.on('data', chunks => { body += chunks });
    req.on('end', () => {
      body = JSON.parse(body);
      user = body.username;
      pass = body.password;
      user = user.replaceAll('.', '_');
      fs.readFile(path.join(Rootpath, 'Database', user, "user.json"), 'utf8', (err, data) => {
        if (err) {
          console.log("user not found");
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ msg: 'User not found' }));
        } else {
          console.log("user found");

          //check requested password and user password correct.
          data = JSON.parse(data);
          if (pass === data.password) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ user: data.username, msg: 'Login success' }));
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ msg: 'password miss match' }));
          }
        }

      });

    });
  }
  
//new user creation
if (req.url === '/newUser') {
  let body = '';
  req.on('data', (chunks) => {
    body += chunks;
  });
  req.on('end', () => {
    body = JSON.parse(body);
    let newdirctory = body.newEmail.replaceAll('.', '_');

    //create a folder in the name of user,
    fs.mkdir(path.join(Rootpath, 'Database', newdirctory), (err) => {
      if (err) {
        res.writeHead(400);
        res.end('Account already exist');
        
      }
    });

    //store user credentials
    fs.writeFile(
      path.join(Rootpath, 'Database', newdirctory, 'user.json'),
      JSON.stringify({
        username: body.newUsername,
        email: body.newEmail,
        password: body.newPassword,
      }),
      (err) => {
        if (err) {
          console.err('failed');
          res.writeHead(400);
          res.end('User data failed to store retry');
          fs.rmdir(path.join(Rootpath, 'Database', newdirctory));
        } else {
          res.writeHead(200);
          res.end('Your Account created success fully');
          console.log('Success!');
        }
      }
    );

    fs.writeFile(path.join(Rootpath,"Database",newdirctory,"diaries.json"),JSON.stringify([]),(err)=>{
      if(err){
        console.log(err);
      }
    })
  });

  // res.end("account created");
}

if(req.url==="/submit"){
  body='';
  req.on('data',bits=>{body+=bits});
  req.on('end',()=>{
     let diaryData=JSON.parse(body);
     let directory=diaryData.username;
     directory=directory.replaceAll(".","_");
     //creats file , where stores the content of diary,name for the file recieved from client side
     fs.writeFile(path.join(Rootpath,"Database",directory,`${diaryData.diaryData.Dname}.txt`),diaryData.diaryData.content,err=>{
       if(err){
         res.writeHead(400,{'Content-Type':'application/json'});
         res.end(JSON.stringify({poststatus:false,msg:"Submission failed, some error occured"}));
       }else{
         //diary list updation,Opens file where list of diaries stored
         fs.readFile(path.join(Rootpath,"Database",directory,"diaries.json"),"utf8",(err,data)=>{
           let diaryList=JSON.parse(data);//turn that into a object
           let diarydetls={...diaryData.diaryData};
           diarydetls.Dname=diarydetls.Dname+".txt";
           delete diarydetls.content;
           diaryList.push(diarydetls);//update that list
           if(err){
             console.log(err);
           }else{
             //write back the updated list
             fs.writeFile(path.join(Rootpath,"Database",directory,"diaries.json"),JSON.stringify(diaryList),err=>{
               if(err)
                 console.log(err);

                 res.writeHead(200,{'Content-Type':'application/json'});
                 res.end(JSON.stringify({poststatus:true,msg:"submission success"}));
             });
           }

         })
       }
     })
     
  });
  //end of submit
}

if(req.url==="/mydiareis"){
  let body='';
  req.on('data',(bits)=>{
    body+=bits;
  });
  req.on("end",()=>{
    body=JSON.parse(body);
    let directory=body.user.replaceAll(".","_");
    let file=path.join(Rootpath,"Database",directory,"diaries.json");
    fs.readFile(file,"utf8",(err,data)=>{
      if(err){
        res.writeHead(400,{'Content-Type':'application/json'});
        res.end(JSON.stringify({msg:"cant find any files"}));
      }else{
        res.writeHead(200,{"Content-Type":"application/json"});
        res.end(data);
      }
    })
  })
  //end of mydiaries
}
if(req.url==="/diarycontent"){
 let body='';
 req.on('data',chnks=>{
  body+=chnks;
 });
 req.on('end',()=>{
  body=JSON.parse(body);
  let directory=body.user.replaceAll(".","_");
  console.log(directory);
  let file=body.Dname;
  try{
    fs.readFile(path.join(Rootpath,"Database",directory,file),"utf8",(err,data)=>{
      if(err){
        console.log(err);
        //throw new Error("failed to read");
      }else{
        res.writeHead(200,{'content-type':'application/json'});
        res.end(JSON.stringify({readStatus:true,content:data}));
      }

    });
  }catch(e){
    res.writeHead(400,{'content-type':'application/json'});
    res.end(JSON.stringify({readStatus:false}));
  }
 })
}
});

server.listen(Port, () => {

  console.log(`server runs in ${Port}`);

});