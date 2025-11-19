function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    const user = mockUsers.find(u => u.email === email && u.senha === senha);

    if (!user) {
        alert("Email ou senha incorretos!");
        return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "pag-inicial.html";
}
