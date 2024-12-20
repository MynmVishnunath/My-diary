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
  });

  // res.end("account created");
}
});

server.listen(Port, () => {

  console.log(`server runs in ${Port}`);

});