document.addEventListener("DOMContentLoaded", () => {
    const formAddTarefa = document.getElementById('form-add-tarefa');
    const btnAFazer = document.getElementById('btn-a-fazer');

    if (formAddTarefa) {
        formAddTarefa.addEventListener('submit', (event) => {
            event.preventDefault();

            let desc = document.getElementById('inp-desc').value;
            let corSelecionadaElement = document.querySelector('input[name="cor"]:checked');
            let corSelecionada = corSelecionadaElement ? corSelecionadaElement.value : null;

            if (desc && corSelecionada) {
                resetInputs();
                inserirTarefa({
                    desc,
                    cor: corSelecionada
                });
                renderizarTarefas();
            } else {
                alert('Preencha todos os campos');
                return;
            }
        });
    }

    if (btnAFazer) {
        btnAFazer.addEventListener('click', () => {
            exibirAFazer();
        });
    }

    renderizarTarefas();

    console.log("Script carregado com sucesso!");
});

function resetInputs() {
    const inpDesc = document.getElementById('inp-desc');
    const corSelecionadaElement = document.querySelector('input[name="cor"]:checked');

    if (inpDesc) inpDesc.value = '';
    if (corSelecionadaElement) corSelecionadaElement.checked = false;
}

function exibirAFazer() {
    const aFazer = document.getElementById('form-add-tarefa');
    const btnFazer = document.getElementById('btn-a-fazer');

    if (aFazer && btnFazer) {
        aFazer.classList.toggle('show');
        btnFazer.classList.toggle('hide');
    }
}

function inserirTarefa({
    desc,
    cor
}) {
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    let tarefaExistente = tarefas.some(tarefa => tarefa.desc === desc);

    if (tarefaExistente) {
        alert('Tarefa já existente');
        return;
    }

    tarefas.push({
        desc,
        cor,
        concluida: false,
        arquivada: false
    });
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function listarTarefas() {
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    return tarefas;
}

function marcarConcluida(index) {
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas[index].concluida = !tarefas[index].concluida;
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    renderizarTarefas();
}

function marcarArquivada(index) {
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas[index].arquivada = !tarefas[index].arquivada;
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    renderizarTarefas();
}

function excluirTarefa(index) {
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.splice(index, 1);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    renderizarTarefas();
}

function renderizarTarefas() {
    const pagina = window.location.pathname;

    const containerTarefas = document.getElementById('tarefas');
    const containerTarefasArquivadas = document.getElementById('tarefas-arquivadas');

    if (containerTarefas) {
        containerTarefas.innerHTML = '';
    } else if (containerTarefasArquivadas) {
        containerTarefasArquivadas.innerHTML = '';
    }

    const tarefas = listarTarefas();

    tarefas.forEach((tarefa, index) => {
        const tarefaElement = document.createElement('div');
        tarefaElement.classList.add('tarefa');
        tarefaElement.classList.add(tarefa.cor);

        const labelStyle = tarefa.arquivada ? 'pointer-events: none; cursor: default;' : '';

        tarefaElement.innerHTML = `
            <div class="tarefa_estado ${tarefa.concluida ? 'concluida' : ''}">
                <input type="checkbox" id="checkbox-${index}" ${tarefa.concluida ? 'checked' : ''} ${tarefa.arquivada ? 'disabled' : ''} onchange="marcarConcluida(${index})" />
                <label for="checkbox-${index}" class="checkbox-label ${tarefa.concluida ? 'checked' : 'unchecked'}" style="${labelStyle}"></label>
                <span>${tarefa.concluida ? 'Concluída' : 'Não concluída'}</span>
            </div>
            <div class="tarefa_corpo">
                <p class="tarefa_descricao ${tarefa.concluida ? 'concluida' : ''}">${tarefa.desc}</p>
                <div class="tarefa_acoes">
                    ${tarefa.concluida ? `<button onclick="marcarArquivada(${index})" class="tarefa_arquivar ${tarefa.arquivada ? 'hide' : 'show'}"></button>` : ''}
                    ${tarefa.arquivada ? `<button onclick="excluirTarefa(${index})" class="tarefa_excluir show"></button>` : ''}
                </div>
            </div>
        `;

        if (containerTarefas && pagina.includes('index.html') && !tarefa.arquivada) {
            containerTarefas.appendChild(tarefaElement);
        } else if (containerTarefasArquivadas && pagina.includes('arquivadas.html') && tarefa.arquivada) {
            containerTarefasArquivadas.appendChild(tarefaElement);
        }
    });
}