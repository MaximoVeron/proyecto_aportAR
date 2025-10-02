const formData = document.getElementById("registerForm");

formData.addEventListener("submit", (e) => {
  e.preventDefault(); // Agregar () para ejecutar la función

  // Crear FormData para obtener los datos del formulario
  const data = new FormData(formData);

  console.log(data);
  // Convertir FormData a objeto para ver mejor en console.log
  const formObject = {};
  for (let [key, value] of data.entries()) {
    formObject[key] = value;
  }

  console.log("Datos del formulario:", formObject);
});
