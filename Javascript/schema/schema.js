
import axios from 'axios'
import { sequelize, mongoose, employees, ProjectsModel } from './models.connection'

const graphql = require('graphql'), 
      _ = require('lodash');
const {
    GraphQLObjectType,
        GraphQLString,
        GraphQLInt,
        GraphQLSchema,
        GraphQLList,
        GraphQLNonNull,
        GraphQLID
    } = graphql;
  

const ProjectType = new GraphQLObjectType({
    name: 'project',
    fields: () => ({
        _id: {type: GraphQLString },
        owner: {type: GraphQLInt },
        nameProject: {type: GraphQLString },
        description: {type: GraphQLString },
        employee: { type: new GraphQLList(EmployeeType),
                    resolve(parentValue, args){
                    return employees.findAll({where: {idproject: parentValue.owner}})
                    }
            }
    })
})

const OrdersType = new GraphQLObjectType({
        name: 'Orders',
        fields: () => ({
            IDPEDIDO: {type: GraphQLInt }, 
            IDCLIENTE: {type: GraphQLInt },
            PPRECIOTOTAL: {type: GraphQLInt },
            PSTATUS: {type: GraphQLString },
            PDIRECCION_R: {type: GraphQLString },
            PFECHA: {type: GraphQLString },
            COORDENADAS_R: {type: GraphQLString },
            PDIRECCION_E: {type: GraphQLString },
            COORDENADAS_E: {type: GraphQLString },
            PPAGADO: {type: GraphQLString },
            PFORMA: {type: GraphQLString },
            employee: { type: new GraphQLList(EmployeeType),
                resolve(parentValue, args){
                return employees.findAll({where: {id: parentValue.IDCLIENTE}})
                }
            }
        })
    })

const EmployeeType = new GraphQLObjectType({
    name: 'employees',
    fields: ()=>({
        id: { type: GraphQLInt },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        name: { type: GraphQLString },
        lastname: { type: GraphQLString },
        age: { type: GraphQLInt },
        gender: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        dateregistered: { type: GraphQLString },
        itecorposition: { type: GraphQLString },
        status: { type: GraphQLString },
        birthdate: { type: GraphQLString },
        avatar: { type: GraphQLString },
        idproject: { type: GraphQLInt },
        idpedido: { type: GraphQLInt },
        // company:{ type: CompanyType,
            //     resolve(parentValue, args){
            //         return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
            //             .then(response => response.data);
            //     } },
        project:{ type: new GraphQLList(ProjectType),
            resolve({idproject:idproject, name:name}){
                return ProjectsModel.find({owner: idproject}, (err, project) =>{
                    if(project != null){
                        // console.log(`${name } - ${project}`)
                    }else{
                        console.log(`Project' employee don´t found.`)
                    }
                    if(idproject === null){
                        console.log(`${name} has no projects yet.`)
                    }
                })
                
            }    
        },
        orders: {type: new GraphQLList(OrdersType),
            resolve({idpedido: idpedido}){
                return axios.get(`http://kityplanchoapi.mybluemix.net/api/v1/getpedido?id=${idpedido}`)
                    .then(response => response.data)
                    .then(data => data.PEDIDO)
            }        
        }
    })
}),
RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        employees: {
            type: new GraphQLList(EmployeeType),
            args: { id: { type: GraphQLInt }},
            resolve(parentValue, args){
                return args.id
                 ? employees.findAll({where: {id: args.id}})
                 : employees.findAll()
            }
        },
        orders: {
                type: new GraphQLList(OrdersType),
                args: { IDCLIENTE: { type: GraphQLInt }},
                resolve(parentValue, args){
                    return axios.get(`http://kityplanchoapi.mybluemix.net/api/v1/getpedidos`)
                        .then(response => response.data)
                        .then(response => console.log(response))
                }
            },
        projects: {
            type: new GraphQLList(ProjectType),
            args: { owner: { type: GraphQLInt }},
            resolve(parentValue, args){
                // return args.id
                    // ? axios.get(`http://localhost:3000/projects/${args.id}`)
                    //     .then(response => response.data)
                    // : axios.get(`http://localhost:3000/projects/`)
                    //     .then(response => response.data)
                    //     .then(response => console.log(response))
                return args.owner
                ? ProjectsModel.find({owner: args.owner}, (err, project) =>{
                    if(project != null){
                     //   console.log('ProjectsModel-1: con datos ')
                    }else{
                        console.log('ProjectsModel-1: sin datos')
                    }
                })
                : ProjectsModel.find({}, (err, projects) =>{
                    if(projects != null){
                        // console.log('ProjectsModel-n: con datos')
                    }else{
                        console.log('ProjectsModel-n: sin datos')
                    }
                })
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'mutationUser',
    fields:{
        addEmployee:{
            type: new GraphQLList(EmployeeType),
            args:{
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                lastname: { type: GraphQLString },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                gender: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLString },
                dateregistered: { type: GraphQLString },
                itecorposition: { type: new GraphQLNonNull(GraphQLString) },
                status: { type: new GraphQLNonNull(GraphQLString) },
                birthdate: { type: GraphQLString },
                avatar: { type: GraphQLString },
                idproject: { type: GraphQLInt },
            },
            resolve(parentValue, { username, password, name, lastname, age, gender, email, phone, 
                    itecorposition, status, avatar, idproject }){
                    return employees.create({ username, password, name, lastname, age, gender, email, phone,
                        itecorposition, status, avatar, idproject })
                            .then(employees => { return employees.findAll()})
                // return axios.post('http://localhost:3000/users', { firstName, age })
                //     .then(response => response.data)
            }
        },
        deleteEmployee:{
            type: EmployeeType,
            args:{ id: {type: new GraphQLNonNull(GraphQLInt)}},
            resolve(parentValue, { id }){
                return employees.destroy({where: {id: id}})
                    .then(response => console.log('Employee deleted'))
            }
        },
        updateEmployee:{
            type: EmployeeType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLInt)},
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                lastname: { type: GraphQLString },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                gender: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLString },
                dateregistered: { type: GraphQLString },
                itecorposition: { type: new GraphQLNonNull(GraphQLString) },
                status: { type: new GraphQLNonNull(GraphQLString) },
                birthdate: { type: GraphQLString },
                avatar: { type: GraphQLString },
                idproject: { type: GraphQLInt },
            },
            resolve(parentValue, args){
                    return employees.update(args, {where: {id: args.id}})
                        .then(employees => { return employees.findAll()})
            }

        }
    }
})   

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});