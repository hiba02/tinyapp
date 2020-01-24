//Refactor Helper Functions
const getUserByEmail = function(email, database) {
  for (const user in database) {
    if ( email === database[user].email) {
      return user;
    }
  }
  return;
};

module.exports = getUserByEmail;