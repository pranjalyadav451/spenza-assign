class Events {
  constructor() {
    this.events = {};
  }
  on(eventName, callback) {
    if (this.events.eventName === undefined) {
      this.events[eventName] = [callback];
    } else {
      this.events.eventName.push(callback);
    }
  }
  trigger(eventName) {
    if (this.events[eventName] && this.events[eventName].length > 0) {
      try {
        this.events[eventName].forEach((callback) => {
          callback(eventName);
          saveEvent(eventName);
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Event not registered");
    }
  }

  off(eventName) {
    console.log("All Event handlers removed for", eventName);
    saveEvent(`${eventName}[off]`);
    delete this.events[eventName];
  }
}

const [registerButton, triggerButton, unregisterButton, getAllEventButton] =
  document.querySelectorAll("button");
const [eventNameInput, trgEventName, unregEventName] =
  document.querySelectorAll("input");
const eventList = document.querySelector("#event-list");

const events = new Events();

registerButton.addEventListener("click", () => {
  if (eventNameInput.value === "") {
    alert("Please enter an event name");
    return;
  }
  events.on(eventNameInput.value, (e) => {
    console.log("Callback run from :", e);
  });
  updateEventList();
});

triggerButton.addEventListener("click", () => {
  if (trgEventName.value === "") {
    alert("Please enter an event name");
    return;
  }
  if (events.events[trgEventName.value] === undefined) {
    alert("Event not registered");
    return;
  }
  events.trigger(trgEventName.value);
});

unregisterButton.addEventListener("click", () => {
  if (unregEventName.value === "") {
    alert("Please enter an event name");
    return;
  }
  if (events.events[unregEventName.value] === undefined) {
    alert("Event not registered");
    return;
  }

  events.off(unregEventName.value);
  updateEventList();
});

const updateEventList = () => {
  eventList.innerHTML = "";
  for (let event in events.events) {
    const li = document.createElement("li");
    li.textContent = event;
    eventList.appendChild(li);
  }
};

const BACKEND_URL = "http://localhost:5000/api";
getAllEventButton.addEventListener("click", () => {
  requestAllEvents();
});

const requestAllEvents = () => {
  fetch(`${BACKEND_URL}/list`)
    .then((res) => res.json())
    .then((data) => {
      const { allEvents } = data;
      console.log(allEvents);
      const fileData = allEvents.reduce((acc, curr) => {
        return acc + `event --> ${curr.name} \t ${curr.timeStamp} \n`;
      }, "");
      createFile(fileData);
    })
    .catch((err) => {
      console.log(err);
    });
};

const saveEvent = (eventName) => {
  fetch(`${BACKEND_URL}/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ eventName }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
const createFile = (data) => {
  const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "app.log");
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
