const express = require("express")
const cors = require('cors')
require('dotenv').config();

const app = express()
app.use(cors({
    methods: ['POST', "GET"]
}))
app.use(express.json())


const mongoose = require("mongoose")
var Schema = mongoose.Schema;
const contactFormSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    app: {type: String, required: true}
}, { timestamp: true, collection: "ContactForm" })
const ContactForm = mongoose.model("ContactForm", contactFormSchema)

async function connect() {
    const uri = process.env.URI
    try {
        await mongoose.connect(uri)
        console.log("connected to Mongo")
    } catch (error) {
        console.error(error)
    }
}
connect();

app.get("/api", (req, res) => {
    res.send({"test" : "test"})
})

app.post("/processform", (req, res) => {
    var formData = req.body
    const data = new ContactForm(formData)

    data.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })

})


const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS);

app.post("/getnews", (req, res) => {
    var formData = req.body

    newsapi.v2.topHeadlines({
        category: formData.cat,
        country: formData.country
      }).then(response => {
        res.send(response);
      });
})


app.listen(process.env.PORT || 4001, () => { console.log("server running") })