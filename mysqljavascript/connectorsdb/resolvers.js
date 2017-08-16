import { clientes } from './connectors'

const Resolvers = {
    Query: {
        findClientes: (_, args, context) =>{
            return clientes.findAll();
        }
    }

}

export default Resolvers