// Initialize Firebase
 const config = {
   apiKey: "AIzaSyBeO0W-WFRw4CQeFwuUuiJ95CbRsxHmXRw",
   authDomain: "kronos-3c918.firebaseapp.com",
   databaseURL: "https://kronos-3c918.firebaseio.com",
   projectId: "kronos-3c918",
   storageBucket: "kronos-3c918.appspot.com",
   messagingSenderId: "534939289411"
 };
 firebase.initializeApp(config);

  //Real-time elements
  const preObject = document.getElementById('object');
  const dbRefObject = firebase.database().ref().child('time stamp');

  // Get Elements
  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const txtFirstName = document.getElementById('txtFirstName');
  const txtLastName = document.getElementById('txtLastName');
  const btnLogIn = document.getElementById('btnLogIn');
  const btnRegister = document.getElementById('btnRegister');
  const btnLogOut = document.getElementById('btnLogOut');
  let dateIn;
  let timeIn;
  let endTime;
  let dateOut;
  let timeOut;
  let startTime;

  //Add Login
  btnLogIn.addEventListener('click', e => {
    //get email and password
    console.log('clicked');
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();
    //sign in
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));
  })

  btnRegister.addEventListener('click', e => {
    //get email and password
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();
    //sign in
    const promise = auth.createUserWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));
  });

  btnLogOut.addEventListener('click', e=> {
    firebase.auth().signOut();
  })

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      // console.log(firebaseUser);
      btnLogOut.classList.remove('hide');
    } else {
      console.log('not logged in');
      btnLogOut.classList.add('hide');
    }
  });

  //Sync object changes
  dbRefObject.on('value', snap => {
    console.log(preObject.innerText = JSON.stringify(snap.val(), null, 3));
  });

  document.getElementById(`clockInTwentyFour`).addEventListener(`click`, clockInLong);
  function clockInLong() {
    let currentDate = moment().format('MMMM Do YYYY');
    let currentTime = moment().format('h:mm:ss a');
    let endHour = moment().endOf('day').format('h:mm:ss a');
    dbRefObject.push({
        date: currentDate,
        clockin: currentTime,
        endHour: endHour
    });
  }

  document.getElementById(`clockOutTwentyFour`).addEventListener(`click`, clockOutLong);
  function clockOutLong() {
    let currentDate = moment().format('MMMM Do YYYY');
    let currentTime = moment().format('h:mm:ss a');
    let startHour = moment().startOf('day').format('h:mm:ss a');
    dbRefObject.push({
        date: currentDate,
        clockout: currentTime,
        startHour: startHour
    });
  }


dbRefObject.orderByChild("dateAdded")
     .on("child_added", function(snapshot) {
        // storing the snapshot.val() in a variable for convenience
        const sv = snapshot.val();

        // Console.loging the last trains's data
        console.log(sv);

        // Change the HTML to reflect
        dateIn=sv.date;
        timeIn=sv.clockin;
        endTime=sv.endHour;

        // function call to display current train details
        createTable();

        // Handle the errorss
}, function(errorObject) {
       console.log("Errors handled: " + errorObject.code);
});

function createTable(){

	let dateTR = $("<tr>");
	let clockInTD =$("<td>").text(timeIn);
	let endTimeTd =$("<td>").text(endTime);

	dateTR.append(clockInTD,endTimeTd);

	$("#object").append(dateTR);
}














    //fin
