// seletores de elementos
const palavraInput = document.getElementById("palavra_input");
const listaPalavras = document.getElementById("lista_palavras");
const revisoesContainer = document.getElementById("revisoesContainer");
const form = document.getElementById("documentForm");
const output = document.getElementById("jsonOutput"); 
const copyBtn = document.getElementById("copyJsonBtn");
const gerarPdfBtn = document.getElementById("gerarPdfBtn");

let palavras = [];

// --- FUNÇÕES DE MANIPULAÇÃO DO FORMULÁRIO ---

// Adiciona palavras-chave ao pressionar Enter
palavraInput.addEventListener("keypress", e => {
    if(e.key === "Enter"){
        e.preventDefault();
        const palavra = palavraInput.value.trim();
        if(palavra && !palavras.includes(palavra)){
            palavras.push(palavra);
            atualizarPalavras();
            palavraInput.value = "";
        }
    }
});

// Atualiza a lista de palavras-chave na tela e permite a remoção 
function atualizarPalavras(){
    listaPalavras.innerHTML = "";
    palavras.forEach(p => {
        const li = document.createElement("li");
        li.textContent = p;
        li.addEventListener("click", () =>  {
            palavras = palavras.filter(item => item !== p);
            atualizarPalavras();
        });
        listaPalavras.appendChild(li);
    });
} 

// Adiciona dinamicamente os campos para um nova revisão
document.getElementById("addRevisao").addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("revisao");
    div.innerHTML = `
        <label>Data:</label>
        <input type="datetime-local" class="data_revisão" required>
        <label>Revisado por:</label>
        <input type="text" class="revisado_por" required>
        <label>Comentário:</label>
        <input type="text" class="comentario_revisao" required>
    `;

    revisoesContainer.appendChild(div);
});

// Evento para o botão de gerar o relatório em PDF
gerarPdfBtn.addEventListener("click", () => {
    const doc = construirDocumento();

    if(!doc.titulo){
        alert("Por favor, preencha o formulário antes de gerar o PDF.")
        return
    }

    // acessa a bibliotecajsPDF que foi carregada no HTML
    const { jsPDF} = window.jspdf;
    const pdf = new jsPDF();

    let y = 20; // posição vertical inicial no documento PDF

    // -- adiciona o conteúdo ao pdf 
    pdf.setFontSize(18);
    pdf.text(doc.titulo, 105, y, { align: 'center'});                                                   
    y += 15;
    
    pdf.setFontSize(12);
    pdf.text(`Tipo: ${doc.tipo}`, 20, y);
    pdf.text(`Ano: ${doc.ano}`, 120, y);
    y += 7;
    pdf.text(`Status: ${doc.status}`, 120, y);
    pdf.text(`Data de Envio: ${new Date(doc.data_envio).toLocaleString('')}` )

});