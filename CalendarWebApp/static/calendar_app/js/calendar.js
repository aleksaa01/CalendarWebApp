let state = {};
let access_token = document.getElementById('access-token').innerText;
let refresh_token = document.getElementById('refresh-token').innerText;
let current_event = null;

fetchCalendarEvents();

function fetchCalendarEvents() {
  let url = '/calendar/event/';

  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == xhr.DONE) {
      if (xhr.status == 200) {
        event_list = JSON.parse(xhr.responseText);

        for (let idx in event_list) {
          addCalendarEvent(event_list[idx]);
        }
      }
      else if (xhr.status == 401) {
        getAccessToken();
        fetchCalendarEvents();
        return;
      }
      else {
        console.log("fetchCalendarEvents failed");
      }
    }
  };

  xhr.open('GET', url, false);
  xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
  xhr.send();
}

function addCalendarEvent(event) {
  if (!state[event.year]) {
    state[event.year] = {};
  }
  if (!state[event.year][event.month]) {
    state[event.year][event.month] = {};
  }
  if (!state[event.year][event.month][event.day]) {
    state[event.year][event.month][event.day] = event;
  }
}

function hasCalendarEvent(event) {
  if(!state[event.year]) return false;
  if(!state[event.year][event.month]) return false;
  if(!state[event.year][event.month][event.day]) return false;

  return true;
}

function removeCalendarEvent(event) {
  delete state[event.year][event.month][event.day];
}

document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('modal-create').addEventListener('click', createEvent);
document.getElementById('modal-delete').addEventListener('click', deleteEvent);
document.getElementById('modal-save').addEventListener('click', saveEvent);

function generate_year_range(start, end) {
  let years = "";
  for (let year = start; year <= end; year++) {
      years += "<option value='" + year + "'>" + year + "</option>";
  }
  return years;
}

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let calendar = document.getElementById("calendar");

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

let dayHeader = "<tr>";
for (day in days) {
  dayHeader += "<th data-days='" + days[day] + "'>" + days[day] + "</th>";
}
dayHeader += "</tr>";

document.getElementById("thead-month").innerHTML = dayHeader;


monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);
document.getElementById('previous').addEventListener('click', previous);
document.getElementById('next').addEventListener('click', next);


function next() {
  currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
}

function previous() {
  currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {

  let firstDay = (new Date(year, month)).getDay();

  tbl = document.getElementById("calendar-body");

  monthAndYear.innerHTML = months[month] + " " + year;
  tbl.innerHTML = "";

  // Create all table cells.
  let date = 1;
  let days_in_month = daysInMonth(month, year);
  let irl_date = today.getFullYear() + today.getMonth() / 100 + today.getDate() / 10000;
  for (let i = 0; i < 6; i++) {
    let row = document.createElement("tr");

    for (let j = 0; j < 7; j++) {
      // Skip empty days(first row of the table)
      if (i === 0 && j < firstDay) {
        cell = document.createElement("td");
        cellText = document.createTextNode("");
        cell.appendChild(cellText);
        row.appendChild(cell);
      }
      else if (date > days_in_month) {
        break;
      }
      else {
        cell = document.createElement("td");
        cell.setAttribute("data-day", date);
        cell.setAttribute("data-month", month + 1);
        cell.setAttribute("data-year", year);
        cell.className = "date-picker";
        cell.innerHTML = '<span>' + date + "</span>";

        if((year + month / 100 + date / 10000) < irl_date)  {
          cell.classList.add('disabled-td');
        }
        
        else {
          cell.classList.add('hoverable-td');

          // Check if event exists for the current day, and modify the cell appropriately.
          if (hasCalendarEvent({ 'year': year, 'month': month + 1, 'day': date })) {
            cell.setAttribute('data-id', state[year][month + 1][date].id);
            cell.classList.add('occupied-td');
          }
        }

        row.appendChild(cell);
        date++;
      }


    }

    tbl.appendChild(row);
  }
}

function daysInMonth(iMonth, iYear) {
  return 32 - new Date(iYear, iMonth, 32).getDate();
}

calendar.addEventListener('click', function(event) {
  elem = event.target;

  if(!(elem.classList.contains('date-picker'))) {
    if (!(elem.parentNode.classList.contains('date-picker'))) {
      return;
    }
    elem = elem.parentNode;
  }

  // Anything before today shouldn't respond to click.
  if (elem.classList.contains('disabled-td')) return;
  
  let event_id = elem.getAttribute('data-id');
  let day = elem.getAttribute('data-day');
  let month = elem.getAttribute('data-month');
  let year = elem.getAttribute('data-year');

  let event_data;
  if (event_id) {
    event_data = state[year][month][day];
  }
  else {
    event_data = {'day': day, 'month': month, 'year': year};
  }

  current_event = elem;

  showModal(event_data);
});


function showModal(event_data) {
  let modal = document.getElementById('modal');
  let desc = document.getElementById('modal-text');
  let del_btn = document.getElementById('modal-delete');
  let create_btn = document.getElementById('modal-create');
  let save_btn = document.getElementById('modal-save');

  if (event_data.description === undefined) {
    del_btn.classList.add('hidden');
    create_btn.classList.remove('hidden');
    save_btn.classList.add('hidden');
    desc.value = '';
  }
  else {
    del_btn.classList.remove('hidden');
    create_btn.classList.add('hidden');
    save_btn.classList.remove('hidden');
    desc.value = event_data.description;
  }

  if (event_data.id) modal.setAttribute('data-id', event_data.id);
  modal.setAttribute('data-day', event_data.day);
  modal.setAttribute('data-month', event_data.month);
  modal.setAttribute('data-year', event_data.year);
  modal.classList.toggle('hidden');
}

function closeModal() {
  let modal = document.getElementById('modal');
  modal.classList.add('hidden');
}

function createEvent() {
  let modal = document.getElementById('modal');
  let desc = document.getElementById('modal-text');
  let day = modal.getAttribute('data-day');
  let month = modal.getAttribute('data-month');
  let year = modal.getAttribute('data-year');

  let event_data = {
    'day': day,
    'month': month,
    'year': year,
    'description': desc.value
  };
  let post_url = '/calendar/event/';

  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == xhr.DONE) {
      if (xhr.status == 200 || xhr.status == 201) {
        event = JSON.parse(xhr.responseText);
        addCalendarEvent(event);
        current_event.setAttribute('data-id', event.id);
        current_event.classList.add('occupied-td');
        closeModal();
        return;
      }
      else if (xhr.status == 401) {
        getAccessToken();
        createEvent();
        return;
      }
      else {
        console.log("createEvent failed:");
        return;
      }
    }
  }

  xhr.open('POST', post_url);
  xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(event_data));
}

function deleteEvent(){
  let modal = document.getElementById('modal');
  let event_id = modal.getAttribute('data-id');
  if (!event_id) {
    return;
  }

  let desc = document.getElementById('modal-text');
  let day = modal.getAttribute('data-day');
  let month = modal.getAttribute('data-month');
  let year = modal.getAttribute('data-year');

  let event = {
    'id': event_id,
    'day': day,
    'month': month,
    'year': year,
    'description': desc.value
  };

  let del_url = '/calendar/event/' + event_id;

  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == xhr.DONE) {
      if (xhr.status == 204) {
        removeCalendarEvent(event);
        current_event.removeAttribute('data-id');
        current_event.classList.remove('occupied-td');
        closeModal();
        return;
      }
      else if (xhr.status == 401) {
        getAccessToken();
        deleteEvent();
        return;
      }
      else {
        console.log("deleteEvent failed:");
      }
    }
  }

  xhr.open('DELETE', del_url);
  xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
  xhr.send();
};

function saveEvent() {
  let modal = document.getElementById('modal');
  let event_id = modal.getAttribute('data-id');
  if (!event_id) {
    return;
  }

  let desc = document.getElementById('modal-text');
  let day = modal.getAttribute('data-day');
  let month = modal.getAttribute('data-month');
  let year = modal.getAttribute('data-year');

  let save_url = '/calendar/event/' + event_id;

  event = state[year][month][day];
  event.description = desc.value;

  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == xhr.DONE) {
      if (xhr.status == 200 || xhr.status == 201) {
        closeModal();
        return;
      }
      else if (xhr.status == 401) {
        getAccessToken();
        saveEvent();
        return;
      }
      else {
        console.log("saveEvent failed:");
      }
    }
  }

  xhr.open('PUT', save_url);
  xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(event));
};

function getAccessToken() {
  let url = '/api/token/refresh/';
  let data = {
    'refresh': refresh_token
  }

  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == xhr.DONE) {
      if (xhr.status == 200 || xhr.status == 201) {
        access_token = JSON.parse(xhr.responseText).access;
      }
      else if (xhr.status == 401) {
        // refresh_token has expired, load index page.
        window.location.href = "/";
      }
      else {
        console.log("getAccessToken failed:");
      }
    }
  }

  xhr.open('POST', url, false);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
}
