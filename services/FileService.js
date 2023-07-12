const fs = require('fs'); // filesystem 

const ReadJsonDataFromFile = (filepath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }     
      resolve(data);
    })
  });
}

const WriteJsonDataToFile = (filepath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, data, (error) => {
      if(error) {
        reject(error);
      }
      resolve(data);
    })
  })
}

module.exports = {
  ReadJsonDataFromFile,
  WriteJsonDataToFile
}