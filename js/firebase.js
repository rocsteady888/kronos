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
  const tableRowBtn = document.getElementsByClassName('tableRow');
  let dateIn;
  let timeIn;
  let endTime;
  let dateOut;
  let timeOut;
  let startTime;
  let totalHours = [];

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

  clockInTwentyFour.addEventListener('click', e => {
    let d = new Date();
    let n = d.getTime();
    let currentDate = moment().format('MMMM Do YYYY');
    let currentTime = moment().format('h:mm:ss a');
    let clockout = moment().endOf('day').format('h:mm:ss a');
    let duration = moment
            .duration(moment(clockout, 'h:mm:ss a')
            .diff(moment(currentTime, 'h:mm:ss a'))
          ).asHours().toFixed(1);
    dbRefObject.push({
      time: n,
      date: currentDate,
      clockin: currentTime,
      clockout: clockout,
      duration: duration
    });
  });

  clockOutTwentyFour.addEventListener('click', e => {
    let d = new Date();
    let n = d.getTime();
    let currentDate = moment().format('MMMM Do YYYY');
    let currentTime = moment().format('h:mm:ss a');
    let clockin = moment().startOf('day').format('h:mm:ss a');
    let duration = moment
            .duration(moment(currentTime, 'h:mm:ss a')
            .diff(moment(clockin, 'h:mm:ss a'))
          ).asHours().toFixed(1);
    dbRefObject.push({
      time: n,
      date: currentDate,
      clockin: clockin,
      clockout: currentTime,
      duration: duration
    });
  });


  timeCardQuery.addEventListener('click', e => {
    let payPeriodStart = 1541002504848
    let query = dbRefObject.orderByChild('time').startAt(payPeriodStart);
    query.on('child_added', function(snap) {
      let timeStampQuery = snap.val();
      console.log(timeStampQuery);
      console.log(snap.key);
    });
  });

  dbRefObject.orderByChild("dateAdded")
      .on("child_added", function(snapshot) {
          // storing the snapshot.val() in a variable for convenience
          const sv = snapshot.val();

          // Console.loging the last time stamps's data

          // Change the HTML to reflect
          id = snapshot.key;
          dateOf=sv.date;
          timeIn=sv.clockin;
          timeOut=sv.clockout;
          duration=parseFloat(sv.duration).toFixed(1);
          totalHours.push(duration);
          // function call to display current time stamp details
          createTable();
          // console.log(JSON.stringify(sv, null, 3));
          // Handle the errorss
        }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
  });

  function createTable(){

    let dateTR = $("<tr class='tableRow'>");
    dateTR.attr('id', id);
    let dateTD =$("<td>").text(dateOf);
    let clockInTD =$("<td>").text(timeIn);
    let clockOutTD =$("<td>").text(timeOut);
    let durationTD =$("<td>").text(duration);
    let hours = 0;
    for (let i = 0; i < totalHours.length; i++) {
      hours += parseFloat(totalHours[i]);
    }
    let totalHoursTD =$("<td>").text(hours.toFixed(1));
    // let deleteTD =$("<a class='waves-effect waves-light btn red modal-trigger delete-btn' href='#modal2'>").text("Delete");
    

    dateTR.append(dateTD,clockInTD,clockOutTD,durationTD,totalHoursTD);

    $("#timeCard").prepend(dateTR);
  }





    //fin
