const formData = document.getElementById("registerForm");

formData.addEventListener("submit", (e) => {
  e.preventDefault(); // Agregar () para ejecutar la función
  const name = e.target[0].value;
  const apellido = e.target[1].value;
  const correo = e.target[2].value;
  const password = e.target[3].value;
  console.log(name);
  console.log(apellido);
  console.log(correo);
  console.log(password);
});
