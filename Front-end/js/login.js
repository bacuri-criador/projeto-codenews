document.getElementById("formularioLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = document.getElementById("email").value;  // CORRIGIDO
    const senha = document.getElementById("senha").value;

    try {
        const resposta = await fetch("http://localhost:5500/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ login, senha })  // 
        });

        const data = await resposta.json();

        if (resposta.ok && data.status === "sucesso") {
            localStorage.setItem("token", data.token);
            window.location.href = "pag-inicial.html";
        } else {
            alert("Login inválido. Verifique suas credenciais.");
        }

    } catch (erro) {
        console.error("Erro no login:", erro);
        alert("Erro ao conectar com o servidor.");
    }
});
