import Sequelize from 'sequelize'
import _ from 'lodash'
import mongoose from 'mongoose'

//Conexiones
//MongoDB
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://eric:patol_03@ds149373.mlab.com:49373/itecor-durangodb', { useMongoClient: true })
    mongoose.connection
    .once('open',() => console.log('~Connection has been established to MongoDB database successfully.'))
    .on('error', console.error.bind(console, '~Error connecting to MongoLab:'));
  //MySQL
    const sequelize = new Sequelize('itecor_durango', 'kityadmin', 'adminkity2017', {
        host: 'www.itecormovil.com',
        dialect: 'mysql',
        logging: false,
        port: 3306
    });

    sequelize
      .authenticate()
      .then(() => {
          console.log('~Connection has been established to MySQL database successfully.');
      })
      .catch(err => {
          console.error('Unable to connect to the database:', err);
      });

//Modelos 
    const ProjectsModel = mongoose.model('project', new mongoose.Schema({
      id: {type: String },
      nameProject: {type: String },
      description: {type: String }
    }))

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
      status: {type: Sequelize.STRING},
      idproject: {type: Sequelize.INTEGER}
    },{
        timestamps: false,
        paranoid: true,
        omitNul: false
        }),
        employees = sequelize.models.employees; 

      export { sequelize, mongoose, employees, ProjectsModel };