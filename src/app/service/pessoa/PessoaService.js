import ApiService from '../ApiService';
import moment from 'moment';
import FormatterUtils from '../../utils/FormatterUtils';

class PessoaService extends ApiService {

  constructor() {
    super('pessoas');
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
    const isCpfValido = item.cpf.replace(/\D/g, '').length === 11;
    const isDataValida = item.dataNascimento.length === 8 && moment(FormatterUtils.formatDataToUs(item.dataNascimento)).isValid();
    return isNomeValido && isCpfValido && isDataValida;
  }

};

export default PessoaService;