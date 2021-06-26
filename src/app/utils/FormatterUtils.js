class FormatterUtils {

  static formatCpf(cpf) {
    if (!cpf) return cpf;
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  };

  static formatDataToBr(data) {
    if (!data) return data;
    data = data.replace(/\D/g, '');
    return data.substring(6,8) + '/' + data.substring(4,6) + '/' + data.substring(0,4);
  }

  static formatDataToUs(data) {
    if (!data) return data;
    data = data.replace(/\D/g, '');
    return data.substring(4,8) + '-' + data.substring(2,4) + '-' + data.substring(0,2);
  }

  static formatTelefone(tel) {
    if (!tel) return tel;
    tel = tel.replace(/\D/g, '');
    return '(' + tel.substring(0,2) + ') ' + tel.substring(2,7) + '-' + tel.substring(7,11);
  }

}

export default FormatterUtils;