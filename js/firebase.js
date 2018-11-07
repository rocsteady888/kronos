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
  const dbRefObject = firebase.database().ref();
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
  });

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
  });

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
    dbRefObject.child('time stamp').push({
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
    dbRefObject.child('time stamp').push({
      time: n,
      date: currentDate,
      clockin: clockin,
      clockout: currentTime,
      duration: duration
    });
  });

  clockInTwelve.addEventListener('click', e => {
    let d = new Date();
    let n = d.getTime();
    let currentDate = moment().format('MMMM Do YYYY');
    let currentTime = moment().format('h:mm:ss a');
    let clockout = '12hour';
    dbRefObject.child('time stamp').push({
      time: n,
      date: currentDate,
      clockin: currentTime,
      clockout: clockout,
      duration: 0
    });
  });

  $(document).on('click','#clockOutTwelve',function(e){
    let id = $(this).data('id');
    let dateToUpdate = dbRefObject.child('time stamp/' + id);
    let sv;
    let clockin;
    dateToUpdate.on('value', function(snapshot) {
      sv = snapshot.val();
      clockin = sv.clockin
    });
    
    let d = new Date();
    let n = d.getTime();
    let currentDate = moment().format('MMMM Do YYYY');
    let currentTime = moment().format('h:mm:ss a');
    let duration = moment
            .duration(moment(currentTime, 'h:mm:ss a')
            .diff(moment(clockin, 'h:mm:ss a'))
          ).asHours().toFixed(1);
    let postData = {
      clockin: sv.clockin,
      clockout: currentTime,
      date: currentDate,
      duration: duration,
      time: sv.time
    };
    var updates = {};
    updates['/time stamp/' + id] = postData;
  
    return firebase.database().ref().update(updates);
  });

  timeCardQuery.addEventListener('click', e => {
    let searchDate = document.getElementById('searchDate').value;
    // Time card validation
    if (moment(searchDate).isValid() === true) {
      //table reset
      $("#timeCard").empty();
      //reset the total hours for the duration column
      totalHours = [];
      let payPeriodStart = Date.parse(searchDate);
      // 1209600000 is the number of milliseconds in 2 weeks
      let payPeriodEnd = payPeriodStart + 1209600000;
      let query = dbRefObject.child('time stamp').orderByChild('time').startAt(payPeriodStart).endAt(payPeriodEnd);
      query.on('child_added', function(snapshot) {
        let timeStampQuery = snapshot.val();
        const sv = snapshot.val();
        id = snapshot.key;
        dateOf=sv.date;
        timeIn=sv.clockin;
        timeOut=sv.clockout;
        duration=parseFloat(sv.duration).toFixed(1);
        totalHours.push(duration);
        createTable();
      }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
      });
    } else {
      M.toast({html: 'Enter a valid date!'})
    }
  });
  
  dbRefObject.child('time stamp').limitToLast(5).orderByChild("dateAdded").on("child_added", function(snapshot) {
    const sv = snapshot.val();
    id = snapshot.key;
    dateOf=sv.date;
    timeIn=sv.clockin;
    timeOut=sv.clockout;
    duration=parseFloat(sv.duration).toFixed(1);
    totalHours.push(duration);
    createTable();
    }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  dbRefObject.child('time stamp').on("child_removed", function(snapshot) {
    const sv = snapshot.val();
    id = snapshot.key;
    $("#" + id).remove();
  });

  dbRefObject.child('time stamp').on("child_changed", function(snapshot) {
    const sv = snapshot.val();
    id = snapshot.key;
  });

  $(document).on("click", ".delete-btn", function () {
    let itemToDelete = $(this).data('id');
    console.log(itemToDelete);
    $("#modal-delete-btn").attr('data-id', itemToDelete);
  });

  $(document).on("click", "#modal-delete-btn", function () {
    let itemToDelete = $(this).data('id');

    console.log(itemToDelete);
    dbRefObject.child('time stamp/' + itemToDelete).remove()
      .then(function() {
        console.log("Remove succeeded.")
      })
      .catch(function(error) {
        console.log("Remove failed: " + error.message)
      });
  });

  function createTable(){
    let dateTR = $("<tr class='tableRow modal-trigger delete-btn' data-target='modal2'>");
    dateTR.attr('id', id).attr('data-id', id);
    let dateTD =$("<td>").text(dateOf);
    let clockInTD =$("<td>").text(timeIn);
    let clockoutTD;
    if ( timeOut === '12hour' ) {
      clockOutTD = $("<a>").attr('href', 'tel:+19192452001,10606#,,4182#,,1').attr('class', 'btn-large waves-effect waves-light orange').attr('id', 'clockOutTwelve').attr('data-id', id).text("Clock Out");
    } else {
      clockOutTD = $("<td>").text(timeOut);
    }
    let durationTD =$("<td>").text(duration);
    let hours = 0;
    for (let i = 0; i < totalHours.length; i++) {
      hours += parseFloat(totalHours[i]);
    }
    let totalHoursTD =$("<td>").text(hours.toFixed(1));
    dateTR.append(dateTD,clockInTD,clockOutTD,durationTD,totalHoursTD);
    $("#timeCard").append(dateTR);
  }





//fin
