


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
