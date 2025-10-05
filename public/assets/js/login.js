const formData = document.getElementById("registerForm");

formData.addEventListener("submit", (e) => {
  e.preventDefault(); // Agregar () para ejecutar la función
  const name = e.target.registerFirstName.value;
  const apellido = e.target.registerLastName.value;
  const correo = e.target.registerEmail.value;
  const password = e.target.registerPassword.value;
  const carrera = e.target.registerCareer.value;

  console.log("Datos del registro:");
  console.log("Nombre:", name);
  console.log("Apellido:", apellido);
  console.log("Correo:", correo);
  console.log("Password:", password);
  console.log("Carrera:", carrera);

  // Aquí podrías enviar los datos al servidor
  // fetch('/api/register', { method: 'POST', body: JSON.stringify({...}) })
});
