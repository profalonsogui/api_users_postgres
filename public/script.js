const form = document.querySelector("#user-form");
const message = document.querySelector("#message");
const submitButton = document.querySelector("#submit-button");

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const ageValue = document.querySelector("#age").value;

  const user = {
    name,
    email,
    ...(ageValue !== "" && { age: Number(ageValue) })
  };

  try {
    submitButton.disabled = true;
    submitButton.textContent = "Cadastrando...";
    message.className = "message";
    message.textContent = "";

    const response = await fetch("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Não foi possível cadastrar o usuário.");
    }

    showMessage(
      `Usuário ${data.name} cadastrado com sucesso! ID: ${data.id}`,
      "success"
    );

    form.reset();
  } catch (error) {
    showMessage(error.message || "Erro ao cadastrar usuário.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Cadastrar usuário";
  }
});
