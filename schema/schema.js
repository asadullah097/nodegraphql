const graphql = require('graphql');
const Article = require('../models/article');
const Contributor = require('../models/contributor');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema ,GraphQLNonNull } = graphql;

const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        topic: { type: GraphQLString },
        date: { type: GraphQLString },
        contributorId: { type: GraphQLID },
        contributor:{
            type: ContributorType,
            resolve(parent,args){
                return Contributor.findById(args.id)
            }
        }
    })
});
const ContributorType = new GraphQLObjectType({
    name: 'Contributor',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        url: { type: GraphQLString },
        major: { type: GraphQLString },
        articles:{
            type: new GraphQLList(ArticleType),
            resolve(parent,args){
                return Article.find({contributorId:parent.id})
            }
        }
    })
});
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        status: {
            type: GraphQLString,
            resolve(parent, args){
                return "Welcome to GraphQL"
            }
        },
   
    article: {
        type: ArticleType,
        args: {id:{type: GraphQLID}},
        resolve(parent,args){
            Article.findById(args.id)
        }
    },
    contributor: {
        type: ContributorType,
        args: {id:{type: GraphQLID}},
        resolve(parent,args){
            return Contributor.findById(parent.contributorId)
        }
    }
  }
});

///Mutation

const Mutation=new GraphQLObjectType({
  name:'Mutations',
  fields:{
    addArticle: {
        type: ArticleType,
        args: {
            name:{type: new GraphQLNonNull(GraphQLString)},
            topic:{type: new GraphQLNonNull(GraphQLString)},
            date: {type: new GraphQLNonNull(GraphQLString)},
            contributorId: {type: new GraphQLNonNull(GraphQLID)}
        },
        resolve(parent,args){
            let article=new Article({
                name: args.name,
                topic: args.topic,
                date:args.date,
                contributorId:args.contributorId
            })
            return article.save();
        }
    },
    addContributor: {
        type: ContributorType,
        args: {
            name:{type: new GraphQLNonNull(GraphQLString)},
            major:{type: GraphQLString},
            url: {type: new GraphQLNonNull(GraphQLString)}
        },
        resolve(parent,args){
            let contributor= new Contributor({
                name:args.name,
                major:args.major,
                url:args.url
            })
            return contributor.save();
        }
    }
  }
});
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:Mutation
});