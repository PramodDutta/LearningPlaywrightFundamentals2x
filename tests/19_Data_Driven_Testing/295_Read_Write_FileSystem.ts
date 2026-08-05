const fs = require('fs');
import path from 'path';

const filePath = path.join(__dirname, '293_Users.json');
        console.log('File path:', filePath);
const fileData = fs.readFileSync(filePath,'utf-8');

const userData = JSON.parse(fileData);
console.log(userData.username);

// Writing Data to a JSON File

const user = {
  name: "Pramod",
  role: "QA Trainer"
};

const jsonData = JSON.stringify(user);

fs.writeFileSync("output.json", jsonData);
console.log("JSON file created successfully");