const socket = io();

// Message -- Elementos del DOM

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $messages = document.querySelector("#messages");
// Message Templates

const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
// Location -- Elementos del DOM
const $sendLocationButton = document.querySelector("#send-location");

// Normal message

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    message,
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

// Location message
socket.on("locationMessage", (url) => {
  // Renderizamos el template con la url emitida por el servidor
  const htmlLocation = Mustache.render(locationTemplate, {
    url,
  });

  // Adjuntamos el template al DOM
  $messages.insertAdjacentHTML("beforeend", htmlLocation);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled");

  // Disable the form
  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    // Enable the form

    // Se remueve el atributo disabled del boton
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }

    console.log("Message delivered!");
  });
});

$sendLocationButton.addEventListener("click", () => {
  $sendLocationButton.setAttribute("disabled", "disabled");
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (error) => {
        if (error) {
          return console.log(error);
        }
        $sendLocationButton.removeAttribute("disabled");
      }
    );
  });
});
