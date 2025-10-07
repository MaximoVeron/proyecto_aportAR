const formData = document.getElementById("registerForm");

formData.addEventListener("submit", async (e) => {
  e.preventDefault(); // Agregar () para ejecutar la función
  const first_name = e.target.registerFirstName.value;
  const last_name = e.target.registerLastName.value;
  const email = e.target.registerEmail.value;
  const password = e.target.registerPassword.value;
  const career = e.target.registerCareer.value;

  console.log("Datos del registro:");
  console.log("Nombre:", first_name);
  console.log("Apellido:", last_name);
  console.log("Correo:", email);
  console.log("Password:", password);
  console.log("Carrera:", career);

  const user = {
    profile: {
      first_name,
      last_name,
    },
    email,
    password,
    career,
  };
  await fetch("http://localhost:3000/api/auth/register", {
    method: "POST", // Método HTTP POST para enviar datos
    headers: {
      "Content-Type": "application/json", // Especificar que enviamos datos en formato JSON
    },
    body: JSON.stringify(user), // Convertir el objeto usuario a string JSON
  })
    .then((res) => res.json()) // Convertir la respuesta del servidor a JSON
    .then((data) => {
      console.log(data); // Mostrar la respuesta del servidor en la consola
    });
});
