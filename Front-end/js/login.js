async function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, senha })
    });

    if (!response.ok) {
        alert("Email ou senha incorretos!");
        return;
    }

    const usuario = await response.json();

    // salva ID e dados no navegador
    localStorage.setItem("userId", usuario.id);
    localStorage.setItem("nome", usuario.nome);
    localStorage.setItem("email", usuario.email);

    // redireciona após login
    window.location.href = "pag-inicial.html";
}
