// for localhost
//const startUrl = 'https://localhost/8080:'

// for heruko 
const startUrl = 'https://go-north.herokuapp.com'

let validateLogin = `${startUrl}/api/v1/users/validate/`
let getStepsOfUser = `${startUrl}/api/v1/users/get/one?email=`
let addSteps = `${startUrl}/api/v1/users/add/steps`
let totalStep = `${startUrl}/api/v1/users/get/all/steps?email=`
let getAllUsers = `${startUrl}/api/v1/users/`
let deleteUser = `${startUrl}/api/v1/users/delete`
let updateUser = `${startUrl}/api/v1/users/update`
let updatePassword = `${startUrl}/api/v1/users/update/password`
let addUserToTeam = `${startUrl}/api/v1/teams/add/user`
let addTeamUrl = `${startUrl}/api/v1/teams/add`
let getAllTeamsUrl = `${startUrl}/api/v1/teams`
let getAllTeamOfUser = `${startUrl}/api/v1/users/getUserTeams`
let addAccount = `${startUrl}/api/v1/users/add`
let deleteUserFromTeamUrl = `${startUrl}/api/v1/users/leave/team`

