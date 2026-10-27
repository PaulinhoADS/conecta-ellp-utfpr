const Unauthorized = () => {
  return (
    <div style={{flex: 1, display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
        <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
          <h1>Acesso Negado</h1>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
    </div>
  )
};

export default Unauthorized;