import ApiService from '../../ApiService';

class ContatoPessoaService extends ApiService {

  constructor() {
    super('pessoas/contatos');
  }

  salvar(params) {
    if (params.id) {
      return this.put(params.id, params);
    }
    return this.post('', params);
  }

  buscar(params) {
    return this.get('', params);
  }

  obterPorId(id) {
    return this.get(id);
  }

  deletar(id) {
    return this.delete(id);
  }

  validar(item) {
    const isNomeValido = item.nome.length > 0;
    const isTelefoneValido = item.telefone.replace(/\D/g, '').length === 11;
    const isEmailValido = (/\S+@\S+\.\S+/).test(item.email);
    const isPessoaValida = item.pessoa;
    return isNomeValido && isTelefoneValido && isEmailValido && isPessoaValida;
  }

};

export default ContatoPessoaService;