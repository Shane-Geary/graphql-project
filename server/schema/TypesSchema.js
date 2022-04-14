const graphql = require('graphql')


const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLSchema

} = graphql

//Scalar Types
/*
    String = GraphQLString
    int = GraphQLInt
    Float
    Boolean
    Id

*/

const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'Represents a Person Type',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        isMarried: {type: GraphQLBoolean},
        gpa: {type: GraphQLFloat},

        justAType: {
            type: Person,
            resolve(parent, args) {
                return parent
            }
        }

    })
})

//RootQuery 
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        person: {
            type: Person,
            resolve(parent, args) {
                let personObj = {
                    name: 'Tanner',
                    age: 26,
                    isMarried: true,
                    gpa: 4.0
                }
                return personObj
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
})