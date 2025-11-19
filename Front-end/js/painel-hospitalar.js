window.onload = function () {
    const lista = document.getElementById("lista-pacientes");

    mockPacientes.forEach(p => {
        const item = document.createElement("div");
        item.classList.add("paciente-item");

        item.innerHTML = `
            <h3>${p.nome}</h3>
            <p>Diagnóstico: ${p.diagnostico}</p>
            <p>Status: ${p.status}</p>
            <button onclick="verPaciente(${p.id})">Ver detalhes</button>
        `;

        lista.appendChild(item);
    });
};

function verPaciente(id) {
    localStorage.setItem("pacienteSelecionado", id);
    window.location.href = "historico.html";
}
