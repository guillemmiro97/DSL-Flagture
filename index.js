require('dotenv').config();
const express = require('express')
const mysql = require('mysql2');
const app = express()
const port = 3000
const operations = require("./operations")

app.get('/api/', operations.select)
app.get('/api/adduser', operations.addUser)
app.get('/api/deleteuser', operations.deleteUser)
app.get('/api/modifyuser', operations.modifyUser)
app.get('/api/modifyflag', operations.modifyFlag)
app.get('/api/modifyoddusers', operations.modifyOddUsersFlag)

app.listen(port, () => {
    console.log(`http://localhost:${port}/api/?app=app1&user=1`)
    console.log(`http://localhost:${port}/api/adduser?username=guillem&password=1234&email=guillem@gmail.com`)
    console.log(`http://localhost:${port}/api/modifyuser?oldname=bob&newname=bobby`)
    console.log(`http://localhost:${port}/api/modifyflag?flag=flag1&user=1&user=2&user=3&value=1`)
    console.log(`http://localhost:${port}/api/modifyoddusers?flag=flag1&value=1`)
})