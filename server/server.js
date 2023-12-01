const express = require('express')
const bodyParser = require('body-parser')
const oracledb = require('oracledb')
const app = express()

const dbConfig = {
    user: 'mkr',
    password: '2404',
    connectString: 'localhost:1521',
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/signup', async (req, res) => {
    const {name, email, password, role} = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        const check_user = await connection.execute(
            `SELECT * FROM users WHERE email = :email AND password = :password`,
            {email, password}
        );

        if (check_user.rows.length > 0) {
            res.status(400).json({error: 'Can`t create new user! Email already used.'});
        } else {
            await connection.execute(
                `INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)`,
                {name, email, password, role},
                {autoCommit: true}
            );
            console.log(`Received data: Name - ${name}, Email - ${email}, Password - ${password}`);

            await connection.close();

            res.status(200).json({message: 'Data received and stored successfully!'});
        }

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.post('/login', async (req, res) => {
        const {email, password} = req.body;

        try {
            const connection = await oracledb.getConnection(dbConfig);
            const result = await connection.execute(
                `SELECT * FROM users WHERE email = :email AND password = :password`,
                {email, password}
            );

            if (result.rows.length > 0) {
                const userData = {
                    name: result.rows[0][1],
                    email: result.rows[0][2],
                    password: result.rows[0][3],
                    role: result.rows[0][4]
                };
                res.status(200).json({message: 'Success logging', user: userData});
            } else {
                res.status(400).json({error: 'Incorrect login or password'});
            }

            await connection.close();
        } catch
            (error) {
            console.error('Error:', error.message);
            res.status(500).send('Internal Server Error');
        }
    }
);

app.post('/change-password', async (req, res) => {
    const {email, newPassword} = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `UPDATE users SET password = :newPassword WHERE email = :email RETURNING password INTO :newPasswordOut`,
            {newPassword, email, newPasswordOut: {type: oracledb.STRING, dir: oracledb.BIND_OUT}}
        );
        await connection.commit();
        await connection.close();

        const updatedPassword = result.outBinds.newPasswordOut;
        res.status(200).json({message: 'Password changed successfully!', newPassword: updatedPassword});
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.get('/get-users', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT name, email, role FROM users`
        );

        const users = result.rows.map(row => ({
            name: row[0],
            email: row[1],
            role: row[2],
        }));
        await connection.close();

        res.status(200).json({ users });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/change-role', async (req, res) => {
    const { email, newRole } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
            `UPDATE users SET role = :newRole WHERE email = :email`,
            { newRole, email },
            { autoCommit: true }
        );

        await connection.close();

        res.status(200).json({ message: 'Role changed successfully!' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/delete-user', async (req, res) => {
    const { email } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
            `DELETE FROM users WHERE email = :email`,
            { email },
            { autoCommit: true }
        );
        await connection.close();

        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3001, () => {
    console.log("Server started success on port 3001")
})
