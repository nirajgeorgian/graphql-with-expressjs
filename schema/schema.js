const graphql = require('graphql')
const axios = require('axios')
const _ = require('lodash')

/*
    const users = [
        { id: '12', firstName: 'dodo', lastName: 'OoOO', email: 'dodo@dodo.com', age: 12},
        { id: '13', firstName: 'john', lastName: 'doe', email: 'johndoe@dodo.com', age: 18},
    ]
*/

// destructuring
let {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = graphql

const CompanyType = new GraphQLObjectType({
    name: "Company",
    description: "Your company names",
    fields: () => ({
        id: { type: GraphQLString},
        name: { type: GraphQLString},
        description: { type: GraphQLString},
        user: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(resp => resp.data)
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString},
        firstName: { type: GraphQLString},
        age: { type: GraphQLInt},
        lastName: { type: GraphQLString},
        email: { type: GraphQLString},
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                console.log(parentValue);
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(resp => resp.data)
            }
        }
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString }},
            resolve(parentValue, args) {
                // return _.find(users, { id: args.id })
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp => resp.data)
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString}},
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(resp => resp.data)
                // console.log(args);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})
