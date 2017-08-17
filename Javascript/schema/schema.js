
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
        id: {type: GraphQLInt },
        nameProject: {type: GraphQLString },
        description: {type: GraphQLString },
        // users: { type: new GraphQLList(EmployeeType),
        //         resolve(parentValue, args){
        //         return axios.get(`http://localhost:3000/projects/${parentValue.id}/users`)
        //         .then(response => response.data);
        //         }
        // }
    })
})

// const CompanyType = new GraphQLObjectType({
    //     name: 'Company',
    //     fields: () => ({
    //         id: {type: GraphQLInt },
    //         name: {type: GraphQLString },
    //         description: {type: GraphQLString },
    //         users: { type: new GraphQLList(UserType),
    //                 resolve(parentValue, args){
    //                 return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
    //                 .then(response => response.data);
    //                 }
    //         }
    //     })
    // })

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
        idproject: { type: GraphQLInt },
        // company:{ type: CompanyType,
            //     resolve(parentValue, args){
            //         return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
            //             .then(response => response.data);
            //     } },
        project:{ type: ProjectType,
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/projects/${parentValue.id}`)
                    .then(response => response.data);
            }   }
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
                 ? employees.findById(args.id)
                    .then(employee => {
                        var array = [employee];
                        var e = array[0].name;
                        console.log('Empleado(a): '+e)
                        return e;
                    })
                 : employees.findAll()
            }
        },
        // company: {
            //     type: CompanyType,
            //     args: { id: { type: GraphQLInt }},
            //     resolve(parentValue, args){
            //         return axios.get(`http://localhost:3000/companies/${args.id}`)
            //             .then(response => response.data)
            //     }
            // },
        project: {
            type: new GraphQLList(ProjectType),
            args: { id: { type: GraphQLInt }},
            resolve(parentValue, args){
                // return args.id
                    // ? axios.get(`http://localhost:3000/projects/${args.id}`)
                    //     .then(response => response.data)
                    // : axios.get(`http://localhost:3000/projects/`)
                    //     .then(response => response.data)
                    //     .then(response => console.log(response))
                return args.id  
                ? ProjectsModel.findById(args.id, function(err,video){
                    if(video != null){
                    console.log("Encontré el video: "+video.id);
                    }else{
                        console.log("No encontré el video: ");

                    }
                })
                : ProjectsModel.find({}, (err, projects) =>{
                    if(projects != null){
                        console.log('ProjectsModel-n: con datos')
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
        addUser:{
            type: EmployeeType,
            args:{
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString }
            },
            resolve(parentValue, { firstName, age }){
                return axios.post('http://localhost:3000/users', { firstName, age })
                    .then(response => response.data)
            }
        },
        deleteUser:{
            type: EmployeeType,
            args:{ id: {type: new GraphQLNonNull(GraphQLInt)}},
            resolve(parentValue, { id }){
                return axios.delete(`http://localhost:3000/users/${id}`)
                    .then(response => response.data)
            }
        },
        patchUser:{
            type: EmployeeType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLInt)},
                firstName: {type: GraphQLString},
                age: {type: GraphQLInt},
                companyId: {type: GraphQLString}
            },
            resolve(parentValue, args){
                return axios.patch(`http://localhost:3000/users/${args.id}`, args)
                    .then(response => response.data)
            }

        }
    }
})   

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});