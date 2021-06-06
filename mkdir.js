const fs = require("fs")

fs.mkdir("/home/vagrant/testDir", function(err) {
  if (err) {
    console.log(err)
  } else {
    console.log("New directory successfully created.")
  }
})