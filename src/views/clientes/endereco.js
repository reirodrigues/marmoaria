async function buscaCEP() {
  const cepInput = document.getElementById(`cep_${index}`).value.trim();

  if (cepInput.replace("-", "").length != 8) {
    return;
  }

  document.getElementById(`adress_${index}`).classList.add("d-none");
  document.getElementById(`loading`).classList.remove("d-none");
  let error = false;

  const cepData = await axios
    .post(`cliente/buscaCEP`, {
      cep: cepInput,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.response);
      error = true;
      alert("Verifique o CEP digitado!");
    })
    .finally((res) => {
      document.getElementById(`adress_${index}`).classList.remove("d-none");
      document.getElementById(`loading`).classList.add("d-none");
    });

  if (error) return;

  const rua = document.getElementById(`rua_${index}`);
  const numero = document.getElementById(`numero_${index}`);
  const complemento = document.getElementById(`complemento_${index}`);
  const bairro = document.getElementById(`bairro_${index}`);
  const cidade = document.getElementById(`cidade_${index}`);
  const estado = document.getElementById(`estado_${index}`);

  rua.value = cepData.logradouro;
  bairro.value = cepData.bairro;
  complemento.value = cepData.complemento;
  cidade.value = cepData.localidade;
  estado.value = cepData.uf;

  numero.focus();
}
