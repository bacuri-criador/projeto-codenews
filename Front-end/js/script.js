// Este é o cérebro principal. Ele roda em todas as páginas e decide
// o que fazer com base nos IDs que encontra no HTML.

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE LOGIN ---
    if (document.getElementById('formularioLogin')) {
        document.getElementById('formularioLogin').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            
            // Chama o nosso service de API
            const sucesso = await login(email, senha); // 'login' vem do authService.js
            
            if (sucesso) {
                // Redireciona para a página principal (agora index.html)
                window.location.href = 'pag-inicial.html'; 
            } else {
                alert('E-mail ou senha incorretos!');
            }
        });
    }

    // --- LÓGICA DE ESQUECI A SENHA ---
    if (document.getElementById('formularioEsqueciSenha')) {
        document.getElementById('formularioEsqueciSenha').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            
            // Chama o service (mockado)
            const sucesso = await esqueciSenha(email); // 'esqueciSenha' vem do authService.js
            
            if (sucesso) {
                alert('Se um e-mail estiver cadastrado, você receberá um link para redefinição.');
                window.location.href = 'login.html';
            } else {
                alert('Ocorreu um erro. Tente novamente.');
            }
        });
    }

    // --- LÓGICA DO PAINEL HOSPITALAR (CRUD) ---
    if (document.getElementById('corpoTabelaPacientes')) {
        carregarPacientes(); // Carrega a tabela assim que a página abre

        // Adiciona listener ao botão de pesquisa (o 'onclick' no HTML é ruim)
        const btnPesquisar = document.querySelector('.botao-primario-painel');
        if (btnPesquisar) {
            btnPesquisar.onclick = pesquisarPacientes;
        }
    }

    // --- LÓGICA DO FORMULÁRIO DE CADASTRO ---
    if (document.getElementById('formularioCadastro')) {
        document.getElementById('formularioCadastro').addEventListener('submit', async (e) => {
            e.preventDefault();

            const novoAtendimento = {
                nome: document.getElementById('nome').value.trim(),
                risco: document.getElementById('risco').value,
                sala: document.getElementById('sala').value.trim(),
                medico: document.getElementById('medico').value.trim(),
                situacao: document.getElementById('situacao').value,
                dataHoraEntrada: new Date().toISOString() // O backend aceita
            };

            // Validação simples
            if (!novoAtendimento.nome || !novoAtendimento.risco || !novoAtendimento.sala || !novoAtendimento.medico || !novoAtendimento.situacao) {
                alert('Por favor preencha todos os campos obrigatórios.');
                return;
            }

            // Chama a API!
            const salvo = await criarAtendimento(novoAtendimento); // vem do atendimentoService.js
            
            if (salvo) {
                alert('Paciente cadastrado com sucesso!');
                window.location.href = 'painel-hospitalar.html';
            } else {
                alert('Erro ao salvar paciente.');
            }
        });
    }

    // --- LÓGICA DO FORMULÁRIO DE EDIÇÃO ---
    if (document.getElementById('formularioEditarPaciente')) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = parseInt(urlParams.get('id'));

        if (!id) {
            alert('ID do paciente não encontrado!');
            window.location.href = 'painel-hospitalar.html';
        } else {
            // 1. Busca os dados do paciente na API e preenche o formulário
            buscarAtendimentoPorId(id).then(paciente => {
                if (!paciente) {
                     alert('Paciente não encontrado!');
                     window.location.href = 'painel-hospitalar.html';
                     return;
                }
                
                document.getElementById('idPaciente').value = paciente.id;
                document.getElementById('nome').value = paciente.nome;
                document.getElementById('risco').value = paciente.risco;
                document.getElementById('sala').value = paciente.sala;
                document.getElementById('medico').value = paciente.medico;
                document.getElementById('situacao').value = paciente.situacao;
                
                // Formata a data para o input
                const dataFormatada = new Date(paciente.dataHoraEntrada).toISOString().slice(0, 16);
                document.getElementById('dataHoraEntrada').value = dataFormatada;
            });

            // 2. Adiciona o listener para o submit
            document.getElementById('formularioEditarPaciente').addEventListener('submit', async (e) => {
                e.preventDefault();

                const atendimentoAtualizado = {
                    nome: document.getElementById('nome').value.trim(),
                    risco: document.getElementById('risco').value,
                    sala: document.getElementById('sala').value.trim(),
                    medico: document.getElementById('medico').value,
                    situacao: document.getElementById('situacao').value,
                    dataHoraEntrada: new Date(document.getElementById('dataHoraEntrada').value).toISOString()
                };

                const salvo = await atualizarAtendimento(id, atendimentoAtualizado);

                if (salvo) {
                    alert('Paciente atualizado com sucesso!');
                    window.location.href = 'painel-hospitalar.html';
                } else {
                    alert('Erro ao atualizar paciente.');
                }
            });
        }
    }

    // --- LÓGICA DO DASHBOARD ---
    if (document.getElementById('gradeDashboard')) {
        renderizarDashboard();
        // Você pode adicionar um setInterval aqui para atualizar o dashboard
        // setInterval(renderizarDashboard, 30000); // Atualiza a cada 30 seg
    }

    // --- LÓGICA DO HISTÓRICO (CORRIGIDO!) ---
    if (document.getElementById('tabelaHistorico')) {
        renderizarHistorico();
        
        document.getElementById('botaoLimpar').addEventListener('click', () => {
             alert('Função "Limpar Histórico" deve ser implementada no backend.');
             // No futuro, isso chamaria uma API: POST /api/atendimentos/limpar-historico
        });
    }

    // --- Funções de Toggle (movemos do seu script.js original) ---
    inicializarToggleBarraLateral();
    inicializarCarrossel();
});


// --- FUNÇÕES GLOBAIS DE RENDERIZAÇÃO ---

/**
 * Carrega os pacientes da API e renderiza a tabela no painel-hospitalar.html
 */
async function carregarPacientes() {
    const corpoTabela = document.getElementById('corpoTabelaPacientes');
    corpoTabela.innerHTML = `<tr><td colspan="7">Carregando...</td></tr>`;

    const pacientes = await listarAtendimentos(); // Vem do service
    
    const pacientesAtivos = pacientes.filter(p => p.situacao !== 'Atendimento Finalizado');

    if (pacientesAtivos.length === 0) {
        corpoTabela.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">
            <i class="fas fa-users me-2"></i> Nenhum paciente em atendimento
            </td></tr>`;
        return;
    }
    
    corpoTabela.innerHTML = ''; // Limpa o "Carregando..."
    pacientesAtivos.forEach(paciente => {
        corpoTabela.appendChild(criarLinhaPaciente(paciente));
    });
}

/**
 * Filtra os pacientes da tabela com base na busca.
 * (Esta função agora filtra os dados já carregados na tela, para ser mais rápida)
 */
function pesquisarPacientes() {
    const termo = document.getElementById('campoPesquisa').value.toLowerCase();
    const linhas = document.querySelectorAll('#corpoTabelaPacientes tr');
    let encontrou = false;
    
    linhas.forEach(linha => {
        const textoLinha = linha.textContent.toLowerCase();
        if (textoLinha.includes(termo)) {
            linha.style.display = '';
            encontrou = true;
        } else {
            linha.style.display = 'none';
        }
    });

    if (!encontrou && linhas.length > 0) {
        // Você pode adicionar uma mensagem de "não encontrado"
    }
}

/**
 * Cria uma <tr> (linha de tabela) para um paciente.
 * @param {Object} paciente - O objeto do atendimento.
 * @returns {HTMLElement} O elemento <tr>.
 */
function criarLinhaPaciente(paciente) {
    const linha = document.createElement('tr');
    
    // Pega as classes de CSS do seu stilo.css
    let classeRisco = '';
    switch(paciente.risco) {
      case 'Emergência':
        classeRisco = 'risco-emergencia';
        break;
      case 'Muito Urgente':
        classeRisco = 'risco-muito-urgente';
        break;
      case 'Urgente':
        classeRisco = 'risco-urgente';
        break;
      case 'Pouco Urgente':
        classeRisco = 'risco-pouco-urgente';
        break;
      case 'Não Urgente':
        classeRisco = 'risco-nao-urgente';
        break;
      default:
        classeRisco = '';
    }

    const classeSituacao = paciente.situacao === 'Em Atendimento' 
        ? 'situacao-em-atendimento' 
        : 'situacao-a-ser-atendido';
    
    linha.innerHTML = `
        <td>${paciente.nome}</td>
        <td><span class="${classeRisco}">${paciente.risco}</span></td>
        <td>${paciente.sala}</td>
        <td>${paciente.medico}</td>
        <td><span class="${classeSituacao}">${paciente.situacao}</span></td>
        <td>${formatarDataHora(paciente.dataHoraEntrada)}</td>
        <td>
            <div class="btn-group" role="group">
                <button class="btn btn-warning btn-pequeno-painel" onclick="editarPaciente(${paciente.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-finalizar btn-pequeno-painel" onclick="finalizarPaciente(${paciente.id})">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-danger btn-pequeno-painel" onclick="excluirPaciente(${paciente.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    return linha;
}

// --- Funções dos Botões de Ação (agora globais) ---

function editarPaciente(id) {
    window.location.href = `editar-paciente.html?id=${id}`;
}

async function excluirPaciente(id) {
    if (!confirm('Tem certeza que deseja excluir este paciente?')) return;
    
    const sucesso = await deletarAtendimento(id);
    if (sucesso) {
        alert('Paciente excluído com sucesso!');
        carregarPacientes(); // Recarrega a tabela
    } else {
        alert('Erro ao excluir paciente.');
    }
}

async function finalizarPaciente(id) {
    if (!confirm('Tem certeza que deseja finalizar o atendimento deste paciente?')) return;

    // 1. Busca o paciente
    const paciente = await buscarAtendimentoPorId(id);
    if (!paciente) {
        alert('Paciente não encontrado!');
        return;
    }

    // 2. Altera a situação
    paciente.situacao = 'Atendimento Finalizado';
    // paciente.dataHoraSaida = new Date().toISOString(); // Você pode adicionar este campo no backend

    // 3. Salva a alteração
    const salvo = await atualizarAtendimento(id, paciente);

    if (salvo) {
        alert('Atendimento finalizado com sucesso! O paciente foi movido para o histórico.');
        carregarPacientes(); // Recarrega a tabela
    } else {
        alert('Erro ao finalizar atendimento.');
    }
}

/**
 * Renderiza o dashboard.
 */
async function renderizarDashboard() {
    const pacientes = await listarAtendimentos();
    
    const total = pacientes.length;
    document.getElementById('contadorTotal').innerText = total;

    const proximos = pacientes.filter(p => p.situacao === 'Em Atendimento' || p.situacao === 'A ser Atendido');
    const primeiro = proximos.length > 0 ? proximos[0] : null;

    if(primeiro){
        document.getElementById('nomePaciente').innerText = primeiro.nome;
        document.getElementById('infoPaciente').innerText = `Sala ${primeiro.sala} • ${primeiro.medico} • ${new Date(primeiro.dataHoraEntrada).toLocaleString('pt-BR')}`;
        document.getElementById('textoRisco').innerText = primeiro.risco;
        document.getElementById('emblemaRisco').innerText = primeiro.risco[0] || '!';
        aplicarCorRisco(document.getElementById('cartaoRisco'), primeiro.risco);
    } else {
        document.getElementById('nomePaciente').innerText = '—';
        document.getElementById('infoPaciente').innerText = 'Nenhum paciente em atendimento';
        document.getElementById('textoRisco').innerText = '-';
        document.getElementById('emblemaRisco').innerText = '-';
        aplicarCorRisco(document.getElementById('cartaoRisco'), null);
    }
    
    if(proximos.length > 0){
        const totalMinutos = proximos.reduce((acumulador, p)=>{
        const diferencaMinutos = Math.floor((Date.now() - new Date(p.dataHoraEntrada))/60000);
        return acumulador + Math.max(0, diferencaMinutos);
        }, 0);
        const media = Math.round(totalMinutos / proximos.length);
        document.getElementById('tempoEsperaMedio').innerText = `${media} min`;
    } else {
        document.getElementById('tempoEsperaMedio').innerText = '-';
    }

    const listaElemento = document.getElementById('listaProximos');
    listaElemento.innerHTML = '';
    if(proximos.length === 0){
        listaElemento.innerHTML = '<div class="texto-pequeno">Nenhum paciente na fila.</div>';
    } else {
        proximos.forEach(p => {
        const item = document.createElement('div');
        item.className = 'item-paciente';
        item.innerHTML = `
            <div class="info-paciente">
            <div class="nome-paciente">${p.nome}</div>
            <div class="texto-pequeno">${p.risco} • Sala ${p.sala} • ${p.medico}</div>
            </div>
            <div class="tempo-paciente">
            <div class="tempo-espera">${tempoDesde(p.dataHoraEntrada)}</div>
            <div class="texto-pequeno">${p.situacao}</div>
            </div>
        `;
        listaElemento.appendChild(item);
        });
    }
}

/**
 * Renderiza o histórico (CORRIGIDO: mostra apenas finalizados).
 */
async function renderizarHistorico() {
    const corpoTabela = document.querySelector('#tabelaHistorico tbody');
    corpoTabela.innerHTML = '<tr><td colspan="6">Carregando...</td></tr>';
    
    const pacientes = await listarAtendimentos();
    
    // CORREÇÃO DO BUG: Filtra apenas os finalizados
    const pacientesFinalizados = pacientes
        .filter(p => p.situacao === 'Atendimento Finalizado')
        .sort((a,b) => new Date(b.dataHoraEntrada) - new Date(a.dataHoraEntrada));

    if (pacientesFinalizados.length === 0) {
        corpoTabela.innerHTML = '<tr><td colspan="6" class="texto-pequeno">Nenhum registro encontrado no histórico.</td></tr>';
        return;
    }
    
    corpoTabela.innerHTML = '';
    pacientesFinalizados.forEach(p => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${p.nome}</td>
            <td>${p.risco}</td>
            <td>${p.sala}</td>
            <td>${p.medico}</td>
            <td>${p.situacao}</td>
            <td>${formatarDataHora(p.dataHoraEntrada)}</td>
        `;
        corpoTabela.appendChild(linha);
    });
}


// --- Funções Utilitárias (copiadas do seu script.js) ---

function formatarDataHora(dataHoraString) {
    if (!dataHoraString) return 'N/A';
    try {
        return new Date(dataHoraString).toLocaleString('pt-BR');
    } catch (e) {
        return 'Data inválida';
    }
}

function tempoDesde(dataHoraEntrada){
  try{
    const agora = new Date();
    const entao = new Date(dataHoraEntrada);
    const diferenca = Math.max(0, Math.floor((agora - entao)/1000));
    const minutos = Math.floor(diferenca / 60);
    const horas = Math.floor(minutos / 60);
    if(horas > 0) return `${horas}h ${minutos%60}m`;
    if(minutos > 0) return `${minutos} min`;
    return `${diferenca} s`;
  }catch(erro){
    return '-';
  }
}

function inicializarToggleBarraLateral(){
  const barraLateral = document.getElementById('barraLateral');
  const botaoToggle = document.querySelector('.botao-toggle');
  if(!barraLateral || !botaoToggle) return;

  const recolhida = localStorage.getItem('barra-lateral-recolhida') === 'true';
  if(recolhida) barraLateral.classList.add('recolhida');

  botaoToggle.addEventListener('click', ()=> {
    barraLateral.classList.toggle('recolhida');
    localStorage.setItem('barra-lateral-recolhida', barraLateral.classList.contains('recolhida'));
  });
}

function inicializarCarrossel(){
  const elementoCarrossel = document.querySelector('.conteudo-carrossel');
  if(!elementoCarrossel) return;

  const slides = [
    { titulo: 'Política de Privacidade', texto: 'Clique em <a href="politica-privacidade.html" style="color: #3498db; text-decoration: underline;">Saiba mais.</a>' },
    { titulo: 'Termos de Uso', texto: 'Clique em <a href="termos-uso.html" style="color: #3498db; text-decoration: underline;">Saiba mais.</a>' }
  ];

  let indice = 0;
  function renderizar(){
    elementoCarrossel.innerHTML = `<div><h4>${slides[indice].titulo}</h4><p class="texto-pequeno">${slides[indice].texto}</p></div>`;
  }
  renderizar();

  setInterval(()=> {
    indice = (indice + 1) % slides.length;
    renderizar();
  }, 6000);
}

function aplicarCorRisco(cartaoRisco, risco) {
  if(!cartaoRisco) return;
  cartaoRisco.classList.remove('emergencia', 'muito-urgente', 'urgente', 'pouco-urgente', 'nao-urgente');
  
  switch(risco) {
    case 'Emergência':
      cartaoRisco.classList.add('emergencia');
      break;
    case 'Muito Urgente':
      cartaoRisco.classList.add('muito-urgente');
      break;
    case 'Urgente':
      cartaoRisco.classList.add('urgente');
      break;
    case 'Pouco Urgente':
      cartaoRisco.classList.add('pouco-urgente');
      break;
    case 'Não Urgente':
      cartaoRisco.classList.add('nao-urgente');
      break;
    default:
      break;
  }
}