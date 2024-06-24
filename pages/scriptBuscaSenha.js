function buscaSenha(){
  if(!document.getElementById('senhaCliente').value){
    alert("Por favor, preencha o campo com a senha fornecida!");
  } 
  else{
    var senha = document.getElementById("senhaCliente").value;
    localStorage.setItem('senhaCliente', senha);
    //alert("Caiu")
    window.location.href = '/aguarda_senha';
  }
}