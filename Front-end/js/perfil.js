const userId = 1; // futuramente pega do login/token

async function carregarPerfil() {
    const resposta = await fetch(`http://localhost:8080/api/usuario/${userId}`);
    const dados = await resposta.json();

    document.getElementById("nomeUsuario").textContent = dados.nomeCompleto;
    document.getElementById("nomeCompleto").value = dados.nomeCompleto;
    document.getElementById("email").value = dados.email;
    document.getElementById("telefone").value = dados.telefone;
    document.getElementById("fotoUrl").value = dados.fotoUrl;

    if (dados.fotoUrl)
        document.getElementById("fotoUsuario").src = dados.fotoUrl;
}

document.getElementById("formPerfil").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        nomeCompleto: document.getElementById("nomeCompleto").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        fotoUrl: document.getElementById("fotoUrl").value
    };

    await fetch(`http://localhost:8080/api/usuario/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    alert("Perfil atualizado com sucesso!");
    carregarPerfil();
});

carregarPerfil();
