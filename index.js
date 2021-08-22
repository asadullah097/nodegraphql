const express = require('express');
const {graphqlHTTP}=require('express-graphql')
const schema = require('./schema/schema');
const mongoose = require('mongoose');
require('dotenv').config()
const app = express();
const connectDB = require('./db');

app.use("/graphql",graphqlHTTP({
    schema: schema,
    graphiql: true,
}));  
app.use('/',(req,res) => {
    res.send("Welcome to GraphQL server. Use GraphQL endpoint at /graphql")
})
connectDB();
app.listen(5000, () => {
    console.log('now listening for requests on port 5000');
});