const loadProfile = document.getElementById("userNames");

const fetchNames = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/profile/my", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      loadProfile.innerHTML = `
        <i id="userNames" class="fas fa-user me-1"></i> ${data.user.first_name} ${data.user.last_name}
      `;
    } else {
      loadProfile.innerHTML = `<p>Error: ${data.message}</p>`;
    }
  } catch (error) {
    console.error("Error al cargar el perfil:", error);
    loadProfile.innerHTML = `<p>Error al cargar el perfil</p>`;
  }
};

fetchNames();
//registrate y hace el login
//pregunta al profe si es correcta la logica, pq al loguearte se borra la cookie y salta no autenticado
//la validacion llega del controlador
//que te explique y despues decime que onda
