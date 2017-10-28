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
    GraphQLNonNull,
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
    fields: () => ({
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
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: "Start your root query with UserType",
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

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString)},
                age: { type: new GraphQLNonNull(GraphQLInt)},
                companyId: { type: GraphQLString}
            },
            resolve(parentValue, {firstName, age}) {
                return axios.post(`http://localhost:3000/users`, { firstName, age })
                    .then(res => res.data)
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, {id}) {
                return axios.delete(`http://localhost:3000/users/${id}`)
                    .then(res => res.data)
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString)},
                firstName: { type: GraphQLString},
                age: { type: GraphQLString},
                companyId: { type: GraphQLString}
            },
            resolve(parentValue, args) {
                return axios.patch(`http://localhost:3000/users/${args.id}`, args)
                    .then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})
