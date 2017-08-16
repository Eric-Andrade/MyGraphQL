import Sequelize from 'sequelize'
import _ from 'lodash'

//Conexión
const sequelize = new Sequelize('itecor_durango', 'kityadmin', 'adminkity2017', {
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


    const EmployeesModel = sequelize.define('employees', {
      id: {type: Sequelize.INTEGER, 
        primaryKey: true},
      username: {type: Sequelize.STRING,
        allowNull: false},
      password: {type: Sequelize.STRING},
      name: {type: Sequelize.STRING},
      lastname: {type: Sequelize.STRING},
      age: {type: Sequelize.INTEGER},
      gender: {type: Sequelize.STRING},
      email: {type: Sequelize.STRING,
        validate: { isEmail: true }},
      phone: {type: Sequelize.STRING},
      dateregistered: {type: Sequelize.STRING},
      itecorposition: {type: Sequelize.STRING},
      status: {type: Sequelize.STRING}
      },{
        timestamps: false,
        paranoid: true,
        omitNul: false
        }),
        employees = sequelize.models.employees; 

      export { sequelize, employees };