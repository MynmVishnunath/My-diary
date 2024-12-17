let diaries = [
  {
    date: '12dec2024',
    time: '12:11:45 PM',
  },
  {
    date: '6dec2024',
    time: '12:23:55 PM',
  },
  {
    date: '5 dec 2024',
    time: '8:00:00 AM',
  },
  {
    date: '31oct2024',
    time: '5:25:50 AM',
  },
];
let logined = false;
let attempt = 0;
let appbody = document.querySelector('.appbody');

checklocalStorage();
async function checklocalStorage() {
  let data = localStorage.getItem('Mydiary_usr_crdntls');
  data = JSON.parse(data);
  try {
    if (!data) {
      loginpage();
      setTimeout(() => {
        if (confirm('Do you want a new account')) {
          newuserpage();
        } else {
          loginpage();
        }
      }, 1000);
    } else {
      //sending credentials to server for varification.
      let response = await fetch('/login', {
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.userid,
          password: data.password,
        }),
      });
      response = await response.json();
      //verify user
      if (response.user) {
        logined = true;
        home();
      } else {
        loginpage();
        setTimeout(() => {
          if (confirm('Do you want a new account')) {
            newuserpage();
          } else {
            loginpage();
          }
        }, 1000);
      }
    }
  } catch (e) {
    if (e.code === 'ENOTFOUND') {
      alert('Server not found');
    } else if (e.code === 'ECONNREFUSED') {
      alert('connection refused, Please check your nerwork connection');
    } else {
      alert('An unknown error occured, Please try after some times');
    }
  }
  //ends
}

//home page with buttons
function home() {
  if (logined) {
    appbody.innerHTML = `<div class="buttonlist">
   <button onclick="diarylisting()">My diaries</button>
   <button onclick="newdiary()">New Diary</button>
   <button onclick="loginpage()">Log out</button>
   <button onclick="newuserpage()">New user</button>
   </div>`;
  }
}

//open new diary,
function newdiary() {
  const currentDate = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const toptions = {};
  const formattedDate = currentDate.toLocaleDateString(undefined, options);
  const formattime = `${currentDate.getHours() % 12
    } : ${currentDate.getMinutes()} : ${currentDate.getSeconds()} : ${currentDate.getHours() >= 12 ? 'PM' : 'AM'
    }`;
  console.log(formattime);
  appbody.innerHTML = `<div class="newdiarypage" >
  <textarea id="diary"></textarea>
  <button class="submitdiary" onclick="diarysubmit()">📤</button>
  </div>`;
  // Prefill the textarea with the date and day name
  const diaryTextarea = document.querySelector('#diary');
  diaryTextarea.value = `Date: ${formattedDate}\n\n`; // Add the date and leave space for the user to write
  //Naming diary 
  let Dname = `${currentDate.getFullYear()}${currentDate.getMonth()}${currentDate.getDay()}_${currentDate.getHours()}${currentDate.getMinutes()}${currentDate.getSeconds()}`;
  let upload = document.querySelector(".submitdiary");

  upload.addEventListener("click", () => {
    alert("clicked");
    submitdiary({ content: diaryTextarea.value, Date: formattedDate, Time: formattime, Dname })
  });
}

//user login page
function loginpage() {
  logined = false;
  localStorage.removeItem('Mydiary_usr_crdntls');
  appbody.innerHTML = `<div class="accbody">
  <div class="container" id="loginPage">
      <h2>Login</h2>
      <input type="text" id="useremail" placeholder="Enter email">
      <input type="password" id="password" placeholder="Password">
      <button onclick="handleLogin()">Login</button>
      <p class="message" id="loginMessage"></p>
    </div>
  </div>`;
}

//account creation page.
function newuserpage() {
  appbody.innerHTML = `<div class="accbody"><div class="container" id="newAccountPage">
      <h2>Create New Account</h2>
             <input type="text" id="newEmail" placeholder="Email id">
      <input type="text" id="newUsername" placeholder="New Username">
      <input type="password" id="newPassword" placeholder="New Password">
      <button onclick="handleCreateAccount()">Create Account</button>
      <p class="message" id="createMessage"></p>
    </div></div>`;
}

//login to user account.
async function handleLogin() {
  const username = document.getElementById('useremail').value;
  const password = document.getElementById('password').value;

  try {
    let res = await fetch("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      header: {
        "Content-Type": "application/json",
      },

    });
    res = await res.json();
    // verify user
    if (res.user) {
      logined = true;
      //ask to store credentials local.
      setTimeout(() => {
        if (confirm(`Welcome ${res.user}, Do you want to store password and email local?`)) {
          localStorage.setItem("Mydiary_usr_crdntls", JSON.stringify({ userid: username, password }));
        }
      }, 400)
      home();
    } else {
      // Show error message
      document.getElementById('loginMessage').textContent = res.msg;
      attempt++;

      setTimeout(() => {
        let msg = false;
        if (attempt === 3) {
          attempt = 0;
          msg = confirm("Do you want to create a new user account.");
          console.log(msg);
        }
        if (msg) {
          attempt = 0;
          newuserpage();
        } else {
          //clear inputs
          document.getElementById('useremail').value = "";
          document.getElementById('password').value = "";
          // clear error message
          document.getElementById('loginMessage').textContent = "";
        }
      }, 500)

    }
  } catch (e) {

    if (e.code === "ENOTFOUND") {
      alert("Server not found");
    } else if (e.code === "ECONNREFUSED") {
      alert("connection refused, Please check your nerwork connection");
    } else {
      alert("An unknown error occured, Please try after some times");
    }

  }
}

function handleCreateAccount() {
  const newUsername = document.getElementById('newUsername').value;
  const newPassword = document.getElementById('newPassword').value;

  if (newUsername && newPassword) {
    document.getElementById('createMessage').textContent =
      'Account created successfully!';
    document.getElementById('createMessage').style.color = 'green';
    setTimeout(() => {
      loginpage();
    }, 1000);
  } else {
    document.getElementById('createMessage').textContent =
      'Please fill in all fields.';
  }
}

function diarylisting() {
  appbody.innerHTML = `<div class="diarylist-container">
      <h2>Diary list</h2>
      <ul id="diaryList"></ul>
      </div>`;
  const diaryList = document.getElementById('diaryList');

  diaries.forEach((diary) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span class="name">${diary.date}</span>
      <span class="phone">${diary.time}</span>
      `;
    diaryList.appendChild(listItem);
  });
}
