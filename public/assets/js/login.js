const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  const email = e.target.loginEmail.value;
  const password = e.target.loginPassword.value;

  console.log("Datos de inicio de sesión:");
  console.log("Correo:", email);
  console.log("Password:", password);

  // Aquí podrías enviar los datos al servidor
  // fetch('/api/login', { method: 'POST', body: JSON.stringify({...}) })
  const credentials = {
    email,
    password,
  };
  await fetch("http://localhost:3000/api/auth/login", {
    method: "POST", // Método HTTP POST para enviar datos
    headers: {
      "Content-Type": "application/json", // Especificar que enviamos datos en formato JSON
    },
    body: JSON.stringify(credentials), // Convertir el objeto usuario a string JSON
  })
    .then((res) => {
      res.json();
      console.log(res.ok);
      if (res.ok) {
        window.location.href = "./public/pages/user.page.html"; // Redirigir a user.page.html
      }
    }) // Convertir la respuesta del servidor a JSON
    .then((data) => {
      console.log(data); // Mostrar la respuesta del servidor en la consola
    });
});
