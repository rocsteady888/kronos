// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
  };
  // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);

// Twelve Hour Shift
document.getElementById(`clockInTwelve`).addEventListener(`click`, clockInShort);

function clockInShort() {
  let currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
  console.log(currentTime);
  var tablearea = document.getElementById('timeCard');

  var table = document.createElement('table');

  var tr = ['clock in', 'clock out', 'description'];

  var td1 = document.createElement('td');

  var text1 = document.createTextNode(currentTime);

  for (var i = 1; i < 4; i++){
      tr[i] = document.createElement('tr');
      for (var j = 1; j < 4; j++){
          td1.appendChild(text1);
          tr[i].appendChild(td1);
      }
      table.appendChild(tr[i]);

  }

  tablearea.appendChild(table);
}

document.getElementById(`clockOutTwelve`).addEventListener(`click`, clockOutShort);

function clockOutShort() {
  let currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
  console.log(currentTime);
  var tablearea = document.getElementById('timeCard');

  var table = document.createElement('table');

  var tr = ['clock in', 'clock out', 'description'];

  var td2 = document.createElement('td');

  var text2 = document.createTextNode(currentTime);

  for (var i = 1; i < 4; i++){
      tr[i] = document.createElement('tr');
      for (var j = 1; j < 4; j++){
          td2.appendChild(text2);
          tr[i].appendChild(td2);
      }
      table.appendChild(tr[i]);

  }

  tablearea.appendChild(table);

}
