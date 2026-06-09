async function buscarCEP() {
  const cepInput = document.getElementById("cep");
  const cep = cepInput.value.replace(/\D/g, "");

  if (cep.length !== 8) {
    alert("Digite um CEP válido com 8 números.");
    return;
  }

  ativarLoading();

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      throw new Error("CEP não encontrado");
    }

    if(!document.getElementById("ia-icon").querySelector('i')){
      preencherDados(data);
      removerSkeleton();
      adicionarAlerta();
      adicionarIcone("analysis-icon", "fa-magnifying-glass")
      adicionarIcone("ia-icon" , "fa-microchip")
      adicionarIcone("ar", "fa-wind");
      adicionarIcone("temperatura", "fa-temperature-half");
      adicionarIcone("incendio", "fa-fire");
      adicionarIcone("desastres", "fa-tornado");

    }

  } catch (error) {
    console.error(error);
    alert("Erro ao buscar CEP.");
    removerSkeleton();
  }
}

function ativarLoading() {
  document.querySelectorAll(".alert-card, #summaryCard, #localInfo")
    .forEach(el => {
      el.classList.add("skeleton");
    });
}

function removerSkeleton() {
  document.querySelectorAll(".skeleton").forEach(el => {
    el.classList.remove("skeleton");
  });
}

function preencherDados(data) {

  document.querySelector(".analysis-text").innerText =
    `Monitoramento em raio de 200km a partir das informações:
     
      CEP: ${data.cep} 

      Bairro: ${data.bairro}
      
      Cidade: ${data.localidade} 
      
      Estado: ${data.uf}`;

  document.querySelector(".summary-text").innerText =
    "Qualidade do ar e temperatura moderadas pedem atenção a pessoas sensíveis, com hidratação e evitar esforço físico intenso nos horários mais frios. \n O risco de incêndio está alto, então evite qualquer tipo de queimada ou uso de fogo ao ar livre na região. \nApesar de não haver alerta de desastres naturais, acompanhe atualizações e prepare-se para a queda de temperatura durante a madrugada.";
  
  

  preencherCard("card1", "Moderado", "Níveis de partículas levemente elevados. Pode causar desconforto respiratório.")
  preencherCard("card2", "Alto", "Vegetação muito seca na região. Evite qualquer tipo de queimada.")
  preencherCard("card3", "Moderado", "Frente fria se aproximando. Queda de 8°C prevista para a madrugada.")
  preencherCard("card4", "Baixo", "Nenhuma anomalia grave detectada por satélite para enchentes ou deslizamentos.")
}

function adicionarAlerta(){
  const divIaSummary = document.getElementById("ia-summary");
  
  const span = document.createElement("span");
  span.className = "badge-alert ms-2";
  span.textContent = "ATENÇÃO";

  divIaSummary.appendChild(span);

}

function adicionarIcone(id, icone){
  const elemento = document.getElementById(id);
  const icon = document.createElement("i");
  
  icon.classList.add("fa-solid", icone);
  elemento.appendChild(icon);
}

function preencherCard(id, valor, desc){
  const card = document.getElementById(id);
  const span = document.getElementById(`span-${id}`)
  const cardValue = card.querySelector(".card-value");
  const cardIconBox = card.querySelector(".icon-box");
  if(valor == "Moderado"){
    span.classList.add("yellow");
    cardValue.classList.add("text-yellow");
    cardIconBox.classList.add("yellow");
  }else if(valor == "Alto"){
    span.classList.add("red")
    cardValue.classList.add("text-red")
    cardIconBox.classList.add("red");
  }else if(valor == "Baixo"){
    cardValue.classList.add("text-blue")
    span.classList.add("blue")
    cardIconBox.classList.add("blue");
  }
  cardValue.innerText = valor;
  card.querySelector(".card-desc").innerText = desc;
}