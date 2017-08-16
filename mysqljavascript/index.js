import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import bodyParser from 'body-parser'

import Schema from './schemas/schema'
import Mock from './mocks/mock'
import Resolvers from './connectorsdb/resolvers'

//MongoDB 
import { sequelize, mongoose } from './connectorsdb/connectors'
//mongoose.connect('mongodb://localhost/kityplanchoM')


const port = process.env.PORT || 3000
const app = express()
const executableSchema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers
})
app
    .use(bodyParser.json())
    .use('/graphql', bodyParser.json(), graphqlExpress({
    schema: executableSchema,
    context:{
    }
}))

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'

}))
sequelize.sync().then(() => {
    app.listen(port, console.log(`GraphQL is running on localhost:${port}`))
})
