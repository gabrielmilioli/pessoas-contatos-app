import React from 'react';
import { Route, Switch, HashRouter, Redirect } from 'react-router-dom';
import Pessoa from '../view/pessoa/Pessoa';
import ContatoPessoa from '../view/pessoa/contato/ContatoPessoa';

function Rotas() {
  return (
    <HashRouter>
      <Switch>
        <Redirect exact from="/" to="/pessoas" />
        <Route exact path="/pessoas" component={Pessoa} />
        <Route exact path="/pessoas/contatos" component={ContatoPessoa} />
      </Switch>
    </HashRouter>
  )
}

export default Rotas;