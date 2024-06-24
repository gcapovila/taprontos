window.onload = function(){
   
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

function atualizaStatus(senha) {
    // Caso a senha esteja vazia
    if (!senha) {
        console.error('Senha não fornecida');
        alert('Por favor, forneça uma senha válida para atualizar o status do pedido.');
        return;
    }

    fetch(`/api/senha/${senha}`)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error('Erro ao obter os dados do servidor');
            }
            return resposta.json();
        })
        .then(retorno => {
            console.log(retorno);

            if (retorno.length > 0 && retorno[0].status !== undefined) {
                var status = retorno[0].status;                
            } 
            else {
                console.log("A senha fornecida não existe")
                status = 5;
            }
            var nomeStatus = formataStatus(status);
                console.log("Status do pedido: " + nomeStatus);
                document.getElementById("situacaoPedido").innerHTML = "Situação do seu pedido: " + nomeStatus;
                montaBarraProgresso(status);
        })
        .catch(err => {
            console.error('Erro:', err);
            alert('Ocorreu um erro ao atualizar o status do pedido. Por favor, tente novamente mais tarde.');
        });
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
        case 5: 
            return "Senha não encontrada. Por favor, volte e passe uma senha válida.";
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