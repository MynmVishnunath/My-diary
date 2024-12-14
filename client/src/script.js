let diaries=[
  {
  date:"12dec2024",
  time:"12:11:45 PM"
  },
  {
  date:"6dec2024",
  time:"12:23:55 PM"
  },
  {
  date:"5 dec 2024",
  time:"8:00:00 AM"
  },
  {
  date:"31oct2024",
  time:"5:25:50 AM"
  }
  ]
  let attempt=0;
  let appbody=document.querySelector(".appbody");
  
  checklocalStorage();
  function checklocalStorage(){
     const username="admin";
     const password="12345";
     let data=localStorage.getItem("Mydiary_usr_crdntls");
     data=JSON.parse(data);
  
     if((!data)||!(data.userid === username && data.password === password)){
         loginpage();
         setTimeout(()=>{
            if(confirm("Do you want a new account")){
               newuserpage();
            }else{
               loginpage();
            }
         },1000);
         
     }else{
         home();
     }
  
  
  }
    // Prefill the textarea with the date and day name
    
  function home(){
   appbody.innerHTML=`<div class="buttonlist">
   <button onclick="diarylisting()">My diaries</button>
   <button onclick="newdiary()">New Diary</button>
   <button onclick="loginpage()">Login</button>
   <button onclick="newuserpage()">New user</button>
   </div>`;
  }
  
  function newdiary(){
  const currentDate = new Date();
   const options = { weekday: "long", year: "numeric", month: "short", day: "numeric" };
   const toptions={};
   const formattedDate = currentDate.toLocaleDateString(undefined, options);
   const formattime=`${currentDate.getHours()%12} : ${currentDate.getMinutes()} : ${currentDate.getSeconds()} : ${(currentDate.getHours()>=12)?"PM":"AM"}`;
   console.log(formattime);
  appbody.innerHTML=`<div class="newdiarypage" >
  <textarea id="diary"></textarea>
  <button class="submitdiary" onclick="diarysubmit()">📤</button>
  </div>`;
  // Prefill the textarea with the date and day name
   const diaryTextarea = document.querySelector("#diary");
   diaryTextarea.value = `Date: ${formattedDate}\n\n`; // Add the date and leave space for the user to write
  
  }
  
  function loginpage(){
  appbody.innerHTML=`<div class="accbody">
  <div class="container" id="loginPage">
      <h2>Login</h2>
      <input type="text" id="useremail" placeholder="Enter email">
      <input type="password" id="password" placeholder="Password">
      <button onclick="handleLogin()">Login</button>
      <p class="message" id="loginMessage"></p>
    </div>
  </div>`;
  }
  
  function newuserpage(){
  appbody.innerHTML=`<div class="accbody"><div class="container" id="newAccountPage">
      <h2>Create New Account</h2>
             <input type="text" id="newEmail" placeholder="Email id">
      <input type="text" id="newUsername" placeholder="New Username">
      <input type="password" id="newPassword" placeholder="New Password">
      <button onclick="handleCreateAccount()">Create Account</button>
      <p class="message" id="createMessage"></p>
    </div></div>`;
  }
  
  function handleLogin() {
        const username = document.getElementById('useremail').value;
        const password = document.getElementById('password').value;
  
        // Simulated login credentials
        const validUsername = "admin";
        const validPassword = "12345";
  
        // Check if login is successful
        if (username === validUsername && password === validPassword) {
          // Show New Account Page
          setTimeout(()=>{
            if(confirm("Login Success, Do you want to store password and email local?")){
              localStorage.setItem("Mydiary_usr_crdntls",JSON.stringify({userid:username,password}));
            }
          },400)
          home();
        } else {
          // Show error message
          document.getElementById('loginMessage').textContent = "Invalid username or password.";
          attempt++;
          
          setTimeout(()=>{
            let msg=false;
            if(attempt===3){
              attempt=0;
              msg=confirm("Do you want to create a new user account.");
              console.log(msg);}
            if(msg){
             attempt=0;
             newuserpage();
            }else{
               //clear inputs
               document.getElementById('useremail').value="";
               document.getElementById('password').value="";
               // clear error message
               document.getElementById('loginMessage').textContent = "";
            }
          },500)
          
        }
      }
  
      function handleCreateAccount() {
        const newUsername = document.getElementById('newUsername').value;
        const newPassword = document.getElementById('newPassword').value;
  
        if (newUsername && newPassword) {
          document.getElementById('createMessage').textContent = "Account created successfully!";
          document.getElementById('createMessage').style.color = "green";
          setTimeout(()=>{
            loginpage();
          },1000)
        } else {
          document.getElementById('createMessage').textContent = "Please fill in all fields.";
        }
      }
      
      function diarylisting(){
       appbody.innerHTML=`<div class="diarylist-container">
      <h2>Diary list</h2>
      <ul id="diaryList"></ul>
      </div>`;
      const diaryList = document.getElementById("diaryList");
      
      diaries.forEach(diary => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
      <span class="name">${diary.date}</span>
      <span class="phone">${diary.time}</span>
      `;
      diaryList.appendChild(listItem);
      });
      }
     