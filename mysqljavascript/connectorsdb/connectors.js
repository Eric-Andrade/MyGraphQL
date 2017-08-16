import axios from 'axios'
import mongoose from 'mongoose'
import Sequelize from 'sequelize'
var db = require('./config')
// De una API
const User = {
    find: async () => {
        try {
            const response = await axios.get('http://kityplanchoapi.mybluemix.net/api/v1/getclientes')
            const { CLIENTES } = response.data
            return CLIENTES  
        }catch(e){
            throw e
        }
    } 
}

// De una Base de datos MongoDB
// const Messages = mongoose.model('message', mongoose.Schema({
//     owner: { type: String },
//     text: { type: String } 
// }))

//De una base de datos Mysql/PostgreSQL/SQLite/MSSQL
    
//Primer intento de conexión
    const sequelize = new Sequelize('kityplancho', 'kityadmin', 'adminkity2017', {
        host: 'www.itecormovil.com',
        dialect: 'mysql',
        logging: false,
        port: 3306
    });

    sequelize
        .authenticate()
        .then(() => {
            console.log('Conexión realizada satisfactoriamente.');
        })
        .catch(err => {
            console.error('Error al intentar conectar a la base de datos:', err);
        });

 const ClientesModel = sequelize.define('clientes',{
        idcliente: { type: Sequelize.INTEGER(11), primaryKey: true},
        cemail: {type: Sequelize.STRING},
        cpassword: {type: Sequelize.STRING},
        cnombre: {type: Sequelize.STRING},
        capellidos: {type: Sequelize.STRING},
        ctelefono: {type: Sequelize.STRING}
    },{
    timestamps: false,
    paranoid: true,
    omitNul: false
    }),
    clientes = sequelize.models.clientes
    
const PedidosModel = sequelize.define('PEDIDOS',{
        IDPEDIDO: {type: Sequelize.INTEGER },
        IDCLIENTE: {type: Sequelize.INTEGER},
        PPRECIOTOTAL: {type: Sequelize.INTEGER},
        PSTATUS: {type: Sequelize.STRING },
        PDIRECCION_R: {type: Sequelize.STRING },
        PFECHA: {type: Sequelize.STRING },
        COORDENADAS_R: {type: Sequelize.STRING },
        PDIRECCION_E: {type: Sequelize.STRING },
        COORDENADAS_E: {type: Sequelize.STRING },
        PPAGADO: {type: Sequelize.STRING },
        PFORMA: {type: Sequelize.STRING },
    },{
    paranoid: true,
    omitNul: false
    })
export {
    sequelize,
    clientes
}