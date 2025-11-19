async function carregarPerfil() {
    const userId = localStorage.getItem("userId");

    const response = await fetch(`http://localhost:8080/perfil/${userId}`);
    const usuario = await response.json();

    document.getElementById("nome").value = usuario.nome;
    document.getElementById("email").value = usuario.email;
    document.getElementById("senha").value = usuario.senha;
    document.getElementById("fotoUrl").value = usuario.fotoUrl;async function salvarPerfil() {
    const userId = localStorage.getItem("userId");

    const dadosAtualizados = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value,
        fotoUrl: document.getElementById("fotoUrl").value
    };

    const resp = await fetch(`http://localhost:8080/perfil/atualizar/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAtualizados)
    });

    if (resp.ok) {
        alert("Perfil atualizado!");
        carregarPerfil();
    } else {
        alert("Erro ao atualizar perfil");
    }
}


    document.getElementById("fotoExibicao").src = usuario.fotoUrl;
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

async function carregarPerfil() {
    const userId = localStorage.getItem("userId");

    const response = await fetch(`http://localhost:8080/perfil/${userId}`);
    const usuario = await response.json();

    document.getElementById("nome").value = usuario.nome;
    document.getElementById("email").value = usuario.email;
    document.getElementById("senha").value = usuario.senha;
}
async function salvarPerfil() {
    const userId = localStorage.getItem("userId");

    const dadosAtualizados = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value
    };

    const response = await fetch(`http://localhost:8080/perfil/atualizar/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAtualizados)
    });

    if (response.ok) {
        alert("Perfil atualizado com sucesso!");
    } else {
        alert("Erro ao atualizar perfil.");
    }
}