//MONGODB PASSWORD: R2PcHN95RipGumm2
//Connection: mongodb+srv://shane:<password>@graphqlcluster.qj6bf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

//username: shane


const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const mongoose = require('mongoose')
const cors = require('cors')


const schema = require('./graphql-projectv1/server/schema/schema')
// const schema = require('./schema/TypesSchema')

const app = express()
const port = process.env.PORT || 4000

app.use(cors())

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}))

mongoose.connect(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@graphqlcluster.qj6bf.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority`
,{useNewUrlParser: true, useUnifiedTopology: true}
).then(() => {
    app.listen({port: port}, () => { 
        console.log(process.env.mongoUserName)
        //localhost:4000
        console.log('listening for requests on my awesome port 4000');
    
    })
}).catch((e) => {
    console.log(process.env.mongoUserName)
    return console.log('Error :' + e)
})
