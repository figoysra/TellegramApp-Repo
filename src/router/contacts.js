const express = require("express")

const {
  getList,
  insert,
} = require("../controller/contact");

const authentication = require("../midAuth/authentication")

const contactsRouter = express.Router()

contactsRouter
  .get('/contacts', authentication, getList) 
  .post('/contact', authentication, insert)
    // .delete('/deleteContact',authentication, destroy)

module.exports = contactsRouter