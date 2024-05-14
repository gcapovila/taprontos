window.onload = function(){
    var nomeStatus;
    
    // Assim que a tela é aberta, o sistema chama a função 
    senha = localStorage.getItem("senhaCliente");
    atualizaStatus(senha);

    // Depois, começa a chamar de 5 em 5 segundos 
    window.setInterval(function(){
        atualizaStatus(senha);
        console.log("Buscando status da senha " + senha);
    }, 5000);

    // Monta o HTML com base na senha fornecida
    document.getElementById("exibeSenha").innerHTML =  senha;
}

function atualizaStatus(senha){
    fetch(`https://531ca0e4-f9f3-4035-a170-ea3ae44adf2b-00-2ra4djkhmcrjb.worf.replit.dev/api/senha/${senha}`)
        .then(resposta => resposta.json())
        .then (retorno => {console.log(retorno)
            var status = retorno[0].status;     
            var nomeStatus = formataStatus(status);
            console.log("Status do pedido: " + nomeStatus);
            document.getElementById("situacaoPedido").innerHTML = "Situação do seu pedido: "+ nomeStatus;
            montaBarraProgresso(status);
        })
        .catch(err => console.error('Erro:', err))
}

function formataStatus(status){
    switch(status){
        case 1: 
            return "Pedido na fila de espera";
        case 2: 
            return "Pedido em preparação";
        case 3: 
            return "Pedido pronto!";
        case 4: 
            return "Pedido entregue!";
    }
}

function montaBarraProgresso(status){
    switch(status){
        case 1: 
            document.getElementById("barraProgresso").innerHTML = '<div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" style="height: 60px"><div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" style="width: 30%">Pedido na fila de espera</div></div>';
            break;
        case 2: 
            document.getElementById("barraProgresso").innerHTML = '<div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="height: 60px"><div class="progress-bar progress-bar-striped progress-bar-animated bg-warning text-dark" style="width: 70%">Pedido em preparação</div></div>';
            break;
        case 3: 
            document.getElementById("barraProgresso").innerHTML = '<div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="height: 60px"><div class="progress-bar progress-bar-striped progress-bar-animated bg-success" style="width: 100%">Pedido pronto!</div></div><br><audio controls autoplay><source src="https://raw.githubusercontent.com/10Daniele/imagensTaProntos/main/Musica.mp3" type="audio/mp3">Seu navegador não suporta o elemento de áudio. </audio>';
            break;
        case 4: 
            document.getElementById("barraProgresso").innerHTML = '<div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="height: 60px"><div class="progress-bar progress-bar-striped progress-bar-animated bg-info text-dark" style="width: 100%">Pedido entregue!</div></div>';
            break;
    }
}