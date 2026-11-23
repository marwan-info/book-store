require ('dotenv').config();
const bcrypt = require('bcrypt');
const db= require('./config/db');

(async () =>{
    const hash = await bcrypt.hash('admin123',10);
    await db.query(`
        INSERT INTO users (name, email , password, role)
        VALUES ('Admin','admin@store.com',?,'admin')
        ON DUPLICATE KEY UPDATE role = 'admin'`,[hash]
    );
    console.log('Admin redy : admin@store.com / admin123');
    process.exit();
})();

