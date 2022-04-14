const graphql = require('graphql')
const _ = require('lodash')
const User = require('../model/user')
const Hobby = require('../model/hobby')
const Post = require('../model/post')
const { updateMany } = require('../model/user')

//dummy data
// let usersData = [
//     {id: '1', name: 'Gary', age: '30', profession: 'Software Engineer'},
//     {id: '2', name: 'Dana', age: '24', profession: 'Architect'},
//     {id: '3', name: 'Dion', age: '40', profession: 'Musician'},
//     {id: '4', name: 'Cody', age: '51', profession: 'CEO'},
//     {id: '5', name: 'Ashley', age: '33', profession: 'Amusement Park Owner'},
// ]

// let hobbiesData = [
//     {id: '1', title: 'Programming', description: 'Using computers to make the world a better place', userId: '1'},
//     {id: '2', title: 'Martial Arts', description: 'Self-defense training for combat in many different applications', userId: '5'},
//     {id: '3', title: 'Gaming', description: 'Playing games such as board or video for the competition or thrill', userId: '2'},
//     {id: '4', title: 'Concert Go-er', description: 'Attending concerts for the enjoyment of live music', userId: '4'},
//     {id: '5', title: 'Song Writing', description: 'Composing song arrangements with melodies', userId: '3'},
// ]

// let postsData = [
//     {id: '1', comment: 'Graphql is awesome', userId: '1'},
//     {id: '2', comment: 'Learning AWS', userId: '1'},
//     {id: '3', comment: 'Dynamic Databases', userId: '4'},
// ]


const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull

} = graphql


//Create Types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                // return _.filter(postsData, {userId: parent.id})
                return Post.find({userId: parent.id})
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                // return _.filter(hobbiesData, {userId: parent.id})
                return Hobby.find({userId: parent.id})
            }
        }
    })

})

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby Desc',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(Hobby, {id: parent.userId})
            }
        }
    })
})

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post Desc',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(User, {id: parent.userId})
            }
        }
    })
})

//RootQuery

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},

            resolve(parent, args) {
                //we resolve with data
                //get and return data from a data source
                // return _.find(usersData, {id: args.id})
                return User.findById(args.id)
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({})
            }
        },
        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                //return data for our hobby
                return Hobby.findById(args.id)
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({})
            }
        },
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                //return data (post data)
                return Post.findById(args.id)
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({})
            }
        }
    }
})

//Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                // id: {type: GraphQLID},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                profession: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                let user = User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                })
                return user.save()
            }
        },
        //Update User
        UpdateUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                profession: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                return UpdateUser = User.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            age: args.age,
                            profession: args.profession
                        }
                    },
                    {new: true} //Send back updated user type
                )
            }
        },
        //Remove User
        RemoveUser : {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                let removedUser = User.findByIdAndRemove(args.id).exec()
                if(!removedUser) {
                    throw new "Error"()
                }
                return removedUser
            }
        },

        createHobby: {
            type: HobbyType,
            args: {
                // id: {type: GraphQLID},
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let hobbies = Hobby({
                    id: args.id,
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                })
                return hobbies.save()
            }
        },
        //Update Hobby
        UpdateHobby: {
            type: HobbyType,
            args: {
                 id: {type: GraphQLID},
                 title: {type: new GraphQLNonNull(GraphQLString)},
                 description: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                return UpdateHobby = Hobby.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            title: args.title,
                            description: args.description,
                            userId: args.userId
                        }
                    },
                    {new: true} //Send back updated hobby type
                )
            }
        },
        //Remove Hobby
        RemoveHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                removedHobby = Hobby.findByIdAndRemove(args.id).exec()
                if(!removedHobby) {
                    throw new "Error"()
                }
                return removedHobby
            }
        },

        createPost: {
            type: PostType,
            args: {
                // id: {type: GraphQLID},
                comment: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let post = Post({
                    id: args.id,
                    comment: args.comment,
                    userId: args.userId
                })
                return post.save()
            }
        },

        //Update Post
        UpdatePost: {
            type: PostType,
            args: {
                id: {type: GraphQLID},
                comment: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                return UpdatePost = Post.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            comment: args.comment,
                            userId: args.userId
                        }
                    },
                    {new: true} //Send back updated post type
                )
            }
        },
        //RemovePost
        RemovePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                removedPost = Post.findByIdAndRemove(args.id).exec()
                if(!removedPost) {
                    throw new "Error"()
                }
                return removedPost
            }
        }
    }
})



module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})