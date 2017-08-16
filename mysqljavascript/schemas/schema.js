const Schema = [`
    type Pedidos {
      IDPEDIDO: Int  
      IDCLIENTE: Int
      PPRECIOTOTAL: Int
      PSTATUS: String
      PDIRECCION_R: String
      PFECHA: String
      COORDENADAS_R: String
      PDIRECCION_E: String
      COORDENADAS_E: String
      PPAGADO: String
      PFORMA: String
    }

    type Clientes {
      idcliente: Int
      cemail: String
      cpassword: String
      cnombre: String
      capellidos: String
      ctelefono: String
    }

    type Query {
        findClientes: [Clientes]
    }

    schema {
        query: Query
    }
`]

export default Schema