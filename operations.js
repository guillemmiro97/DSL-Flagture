const mysql = require("mysql2");

function select (req, res) {
    let user = req.query.user;
    let app = req.query.app;

    const connection = mysql.createConnection(process.env.DATABASE_URL);

    // flags by user query
    connection.query(
        'SELECT * FROM `'+ app +'` WHERE user = ?',
        [user],
        function(err, results, fields) {
            if (err) return res.json({error: err});
            if (results.length === 0) return res.json({mensaje: "el usuario no tiene flags"})

            let elem = results[0]

            res.json({
                flag1: elem.flag1,
                flag2: elem.flag2
            })
        }
    );

    connection.end();
}

function addUser (req, res) {
    let username = req.query.username;
    let password = req.query.password;
    let email = req.query.email;

    const connection = mysql.createConnection(process.env.DATABASE_URL);

    // insert new user
    connection.query(
        'INSERT INTO `users` (`name`, `password`, `email`) VALUES (?, ?, ?);',
        [username, password, email],
        function(err, results, fields) {
            console.log(results); // results contains rows returned by server
            if(err && err.code === "ER_DUP_ENTRY") return  res.json({error: "Clave de usuario duplicada"});
            if (err) return res.json({error: err});

            res.json({
                id: results.insertId,
                user: req.query.username,
                password: req.query.password,
                email: req.query.email
            })
        }
    );

    connection.end();
}

function deleteUser (req, res) {
    let id = req.query.id;

    const connection = mysql.createConnection(process.env.DATABASE_URL);

    // delete user
    connection.query(
        'DELETE FROM `users` WHERE `id` = ?;',
        [id],
        function(err, results, fields) {
            console.log(results); // results contains rows returned by server
            if(err && err.code === "ER_DUP_ENTRY") return  res.json({error: "Clave de usuario duplicada"});
            if (err) return res.json({error: err});

            res.json({
                userId: req.query.id,
                affectedRows: results.affectedRows
            })
        }
    );

    connection.end();
}

function modifyUser (req, res) {
    let newname = req.query.newname;
    let oldname = req.query.oldname;

    const connection = mysql.createConnection(process.env.DATABASE_URL);

    // modify username
    connection.query(
        'UPDATE `users` SET `name` = ? WHERE `name` = ?;',
        [newname, oldname],
        function(err, results, fields) {
            console.log(results); // results contains rows returned by server
            if(err && err.code === "ER_DUP_ENTRY") return  res.json({error: "Clave de usuario duplicada"});
            if (err) return res.json({error: err});

            res.json({
                affectedRows: results.affectedRows,
                name: req.query.newname
            })
        }
    );

    connection.end();
}

function modifyFlag (req, res) {
    let user = req.query.user;
    let flag = req.query.flag;
    let value = req.query.value;

    const connection = mysql.createConnection(process.env.DATABASE_URL);

    // modify user flag (or multiple users)
    connection.query(
        'UPDATE `app1` SET `'+ flag +'` = ? WHERE `user` IN (?);',
        [value, user],
        function(err, results, fields) {
            console.log(results); // results contains rows returned by server
            if(err && err.code === "ER_DUP_ENTRY") return  res.json({error: "Clave de usuario duplicada"});
            if (err) return res.json({error: err});

            res.json({
                affectedRows: results.affectedRows,
                username: req.query.user,
                flag: req.query.flag,
                value: req.query.value
            })
        }
    );

    connection.end();
}

function modifyOddUsersFlag (req, res) {
    let flag = req.query.flag;
    let value = req.query.value;

    const connection = mysql.createConnection(process.env.DATABASE_URL);

    // modify user flag (or multiple users)
    connection.query(
        'UPDATE `app1` SET `'+ flag +'` = ? WHERE (`user` % 2) = 0;',
        [value],
        function(err, results, fields) {
            console.log(results); // results contains rows returned by server
            if(err && err.code === "ER_DUP_ENTRY") return  res.json({error: "Clave de usuario duplicada"});
            if (err) return res.json({error: err});

            res.json({
                affectedRows: results.affectedRows,
                flag: req.query.flag,
                value: req.query.value
            })
        }
    );

    connection.end();
}

module.exports = {select, addUser, deleteUser, modifyUser, modifyFlag, modifyOddUsersFlag}