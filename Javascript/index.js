import express from 'express'
import expressGraphQL from 'express-graphql'
import {sequelize } from './schema/models.connection'

const app = express(),
      port = process.env.PORT || 4000;
const schema = require('./schema/schema');

app
    .use('/graphiql', expressGraphQL({
        schema,
        graphiql: true
    }));
    sequelize.sync().then(() =>{
        app.listen(port, () => console.log(`APIGraphQL running on port ${port}...`))
    })
    