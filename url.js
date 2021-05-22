// for localhost
const startUrl = 'http://localhost:8080'

// for heruko 
//const startUrl = 'heroku'

let validateLogin = `${startUrl}/api/v1/users/validate/`
let getStepsOfUser = `${startUrl}/api/v1/users/get/one?email=`
let addSteps = `${startUrl}/api/v1/users/add/steps`
let totalStep = `${startUrl}/api/v1/users/get/all/steps?email=`
let getAllUsers = `${startUrl}/api/v1/users/`
let deleteUser = `${startUrl}/api/v1/users/delete`
let updateUser = `${startUrl}/api/v1/users/add`
let updatePassword = `${startUrl}/api/v1/users/update/password`
