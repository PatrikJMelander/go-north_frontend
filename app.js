/* -------------------------------- HOME -------------------------------- */
$('.profile-sign-out').click(()=> {
    window.location.href='../../index.html'
})

$('#validate-sign-in').click(() => {
    validateSignIn()
})

$('#new-user').click(() => {
    swal("BOOM!", "Go to postman to add new user", "warning");
})

$('#nav-sign-in').click(() => {
    if (JSON.parse(sessionStorage.getItem('loggedIn')) === null){
        $('#loginModal').modal('show')
    }
})

/**
 * checks if there is any user in sessionStorage and
 * changes Sign in button apperance after that
 */
const checkIfLoggedIn = () => {
    const isLoggedIn = JSON.parse(sessionStorage.getItem('loggedIn'))
    
    if(isLoggedIn == null){
        $('#nav-sign-in').text('Sign in');
        
    }else {
        setNavLinksToActive()
        $('#nav-sign-in').text('Sign out');
        $('#nav-sign-in').attr('data-bs-target', '')
        $('#nav-sign-in').click(signOut)
    }
}

/**
 * validate input from the user against user information in database
 * if succsess sets loggedin user to sessionstorage
 */
const validateSignIn = () => { 
    const email = $('#sign-in-email')
    const password = $('#sign-in-password')
    
    axios.get(`${validateLogin}login?email=${email.val()}&password=${password.val()}`)
    .then(resp => {
        sessionStorage.setItem('loggedIn', JSON.stringify(resp.data));
        checkIfLoggedIn()
        $('#loginModal').modal('hide')
        email.val('')
        password.val('')
    })
    .catch(() => {
        swal("Warning", "wrong email \nor password!", "warning");
    })
}

/**
 * remove loggedin user from sessionstorage
 */
const signOut = () => {
    $('#nav-sign-in').text('Sign in');
    sessionStorage.removeItem('loggedIn')
    setNavLinksToActive()
    $('#nav-sign-in').attr('data-bs-target', '#loginModal')
}

/**
 * activate or deactivate navlinks if a user is logged in
 */
const setNavLinksToActive = () => {
    const profile = $('#navbarDropdown')
    const highscore = $('#nav-highscore')
    const teamHighscore = $('#nav-team-highscore')

    if(JSON.parse(sessionStorage.getItem('loggedIn'))){
        profile.addClass('active')
        highscore.addClass('active')
        teamHighscore.addClass('active')
        profile.removeClass('disabled')
        highscore.removeClass('disabled')
        teamHighscore.removeClass('disabled')
    }else {
        profile.addClass('disabled')
        highscore.addClass('disabled')
        teamHighscore.addClass('disabled')
        profile.removeClass('active')
        highscore.removeClass('active')
        teamHighscore.removeClass('active')
    }
}

/* -------------------------------- PROFILE INFORMATION -------------------------------- */

$('#update').click(() => {
    updateUserInfo();
})

$('#update-password').click(() => {
    updateUserPassword();
})

$('#delete-user').click(() => {
    swal({
        title: "Warning!",
        text: "Are you sure you wanna delete your account?",
        icon: "warning",
        buttons: ["No, I wanna keep racing", "Yes" ],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            swal({
                text: 'Please enter your password',
                content: "input",
                button: {
                  text: "Done",
                  closeModel: false,
                },
              })
              .then(input => {
                deleteAccount(input)
              })
        } else {
          swal("Good! Keep on walking!");
        }
      });
})



/**
 * deletes a user from the database if email and password matches user
 * then remove user from sessionStorage and sends user to homescreen
 * @param {String} password 
 */
 const deleteAccount = (password) => {
    const userEmail = JSON.parse(sessionStorage.getItem('loggedIn')).email
    

    axios.get(`${deleteUser}?email=${userEmail}&password=${password}`)
    .then(resp => {
        console.log(resp);
        swal("Your account has been deleted. We are sad to see you go, but we will be here and waiting for you when you wanna get back into it!", {
        icon: "success",
        })
        .then(()=> {
            sessionStorage.removeItem('loggedIn')
            window.location.href = "../../../";
        })
    })
    .catch(err => {
        console.log(err.response)
        swal("Wrong password, please try again", {
            icon: "error",
          })
    })
}

/**
 * fills inputfields with user information from sessionStorage
 */
const fillUserInfo = () => {
    const user = JSON.parse(sessionStorage.getItem('loggedIn'))
    $('#firstname').val(user.firstName)
    $('#lastname').val(user.lastName)
    $('#email').val(user.email)
}

/**
 * updates user information
 */
const updateUserInfo = () => {
    axios.post(updateUser, {
        "firstName": $('#firstname').val(),
        "lastName": $('#lastname').val(),
        "email": $('#email').val()
    })
    .then(resp => {
        sessionStorage.setItem('loggedIn', JSON.stringify(resp.data))
        swal("Account updated.", {
            icon: "success",
        })
    })
    .catch(() => {
        swal("Something went wrong, try again.", {
            icon: "warning",
        })
    })
}

const updateUserPassword = () => {
    const user = JSON.parse(sessionStorage.getItem('loggedIn'))
    const newPassword = $('#new-Password')
    const confirmPassword = $('#confirm-Password')

    if(newPassword.val() === confirmPassword.val()){
        axios.get(`${updatePassword}?email=${user.email}&password=${newPassword.val()}`)
        .then(() => {
            newPassword.val('')
            confirmPassword.val('')
            swal("Password updated", {
                icon: "success",
            })
        })
        .catch(() => {
            swal("Something went wrong, try again.", {
                icon: "warning",
            })
        })
    }else{
        swal("Password doesn't match, try again.", {
            icon: "warning",
        })
        confirmPassword.val('')
    }
}



/* -------------------------------- PROFILE SCORE -------------------------------- */

$('#add-steps').click(() => {
    const steps = $('#score-add-steps').val()
    const selectDate = $('#date-selector').val()
    addStepsToDate(steps, selectDate)
})

$('#see-steps-at-date').click(() => {
    clearFields()
    const selectDate = $('#date-selector-2').val()
    getStepsFromDb(selectDate);  
})

/**
 * get total steps of logged in user
 */
const getTotalNumberOfStepsFromUser = () => {
    axios.get(`${totalStep}${JSON.parse(sessionStorage.getItem('loggedIn')).email}`)
    .then(resp => {
        $('#profile-your-score').text(resp.data.toLocaleString(
            "sv-SE",
            {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            }
        ));
    })
}

/**
 * hides steps GUI for user
 */
const hideStepsAtDate = () => {
    $('#number-of-steps-at-date').hide()
}

/**
 * add 100 last days to datepicker
 */
const addDateToPicker = () => {
    let d = new Date();
    
    for (let index = 0; index < 100; index++) {   
        $('#date-selector').append(`
        <option value="${d.toLocaleDateString()}">${d.toLocaleDateString()}</option>
        `)
        $('#date-selector-2').append(`
        <option value="${d.toLocaleDateString()}">${d.toLocaleDateString()}</option>
        `)
        d.setDate(d.getDate()-1);
    }
}

/**
 * clears input fields 
 */
const clearFields = () => {
    $('#score-date-select').text('')
    $('#score-show-total-step-at-date').text('')
}

/**
 * get steps of current logged in customer from database
 * based on the date picked
 * @param {String} date 
 */
const getStepsFromDb = (date) => {
    const userEmail = JSON.parse(sessionStorage.getItem('loggedIn')).email;
    let stepsFromDb;
    
    axios.get(`${getStepsOfUser}${userEmail}`)
    .then(resp => {
        sessionStorage.setItem('loggedIn', JSON.stringify(resp.data));
        stepsFromDb = findStepsOfDate(resp.data, date)
    })
    .then(() => {
        setStepAtDateGui(stepsFromDb,date)
    })
}

/**
 * set GUI for step at date
 * @param {Number} stepsFromDb 
 * @param {String} date 
 */
const setStepAtDateGui = (stepsFromDb, date) => {
    if(stepsFromDb){
        $('#score-date-select').text(date)
        $('#score-show-total-step-at-date').text(stepsFromDb.toLocaleString(
            "sv-SE",
            {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            }
        ))
        $('#number-of-steps-at-date').show()
    }else {
        $('#score-date-select').text(date)
        $('#score-show-total-step-at-date').text('no steps register on that date')
        $('#number-of-steps-at-date').show()
    }
}

/**
 * finds number of steps of the user by date
 * @param {User} user 
 * @param {String} date 
 * @returns Number of steps
 */
const findStepsOfDate = (user, date) => {
    for (const iterator of user.steps) {
        if(iterator.date == date){
            return iterator.steps;
        }
    }
    return null;
}

/**
 * add steps to current logged in user
 * @param {Number} steps 
 * @param {String} date 
 */
const addStepsToDate = (steps, date) => {
    if(steps == null || steps == '' || !date.match(/^\d/)){
        swal("Warning", "You need to select a date and\nput in number of steps to\nregister your steps", "warning");
    }else {
        $('#score-add-steps').val('')
        $('#date-selector').val('Date')
        
        axios.post(`${addSteps}?steps=${steps}&date=${date}`, JSON.parse(sessionStorage.getItem('loggedIn')))
        .then(resp => {
            sessionStorage.setItem('loggedIn', JSON.stringify(resp.data));
            swal("Well Done!", `You added ${steps} steps to ${date}`, "success");
        })
        .then(() => getTotalNumberOfStepsFromUser())
    }
}

/* -------------------------------- PROFILE TEAM -------------------------------- */

$('#join-team-btn').click(() => {
    addTeamsToContainer();
})


$('#add-team-btn').click(() => {
    $('#addTeamModal').modal('show')
})

$('#add-new-team').click(() => {
    addTeam();
})

const checkIfUserHasTeam = () => {
    // get from db if user has team
    const hasTeam = true
    if(hasTeam){
        $('#has-team').show()
    }else {
        $('#has-team').hide()
    }
}

const addTeamsToContainer = () => {
    $('#teams-container').html('')

    axios.get(getAllTeamsUrl)
    .then(resp => {
        resp.data.forEach(team => {
            $('#teams-container').append(`
            <div class=" col-10 m-3 p-2 pt-1 border border-2 border-secondary rounded-3">
                <h6 class="display-6">Team:</h6>
                <p id="join-team-name">${team.teamName}</p>
                <button type="button" class="btn btn-primary" id="${team.teamName}" onclick="selectTeamToJoin(${team.teamName})">Join team</button>
            </div>
        `)
        })
    })

    
}

const addTeam = () => {
    const newTeamName = $('#new-team-name').val()

    axios.post(addTeamUrl, { "teamName": newTeamName})
    .then(resp => {
        swal("Success", `You created ${resp.data.teamName}`, "success")
        .then(() => {
            $('#addTeamModal').modal('hide')
        });
    })
    .catch((err) => {
        swal("Warning", err.response.data.message, "warning");
    })
}

const selectTeamToJoin = (e) => {
    
    const teamName = e.id;
    const userEmail = JSON.parse(sessionStorage.getItem('loggedIn')).email;

    axios.post(`${addUserToTeam}?userEmail=${userEmail}&teamName=${teamName}`)
    .then(resp => {
        swal("Success", `You joined ${resp.data.teamName}`, "success")
    })
    .catch((err) => {
        swal("Warning", err.response.data.message, "warning");
    })

}

const renderTeamInformation = () => {
    let teamContainer = $('#has-team');
    const userEmail = JSON.parse(sessionStorage.getItem('loggedIn')).email;
    const totalSteps = "123 123 123"

    axios.get(`${getAllTeamOfUser}?email=${userEmail}`)
    .then(resp => {
        teamContainer = renderTeamName(teamContainer, resp.data.teamName);
        teamContainer = renderSteps(teamContainer, totalSteps);
    })
}

const renderTeamName = (container, teamName) => {
    return container.html(`
     <div class="row">
          <div class="mb-3 mt-3 pt-1">
            <h3>Team:</h3>
            <h4 id="profile-team-name">${teamName}</h4>
          </div>
     `)
}

const renderSteps = (container, steps) => {
    return container.html(`
    <div class="mb-3">
        <h6>Total steps:</h6>
        <p><span id="profile-team-score">${steps}</span> steps</p>
    </div>
    `)
}

const renderTeamMember = (container, members) => {
    container.html(`
    <div>
    <hr>
    <h4>Members</h4>
  </div>
  <div class="container">
    <div class="row g-0">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Total steps</th>
          </tr>
        </thead>
        <tbody>
    `)

    members.each((index, value) => {
        container.html(`
        <tr>
        <th scope="row">${index + 1}</th>
        <td>${value.name + " " + value.lastName}</td>
        <td>${getTotalStepScore(value)}</td>
      </tr>
        `)
    })

    container.html(`
            </tbody>
            </table>
            </div>
        </div>
    </div>
    `)
   
}
      

/* -------------------------------- HIGHSCORE -------------------------------- */

let sizaOfHighscoreList = 10

$('#btn-10').click(()=> {
    sizaOfHighscoreList = 10
    $('#filter-btn').html('Top 10')
    fillHighScoreList()
})

$('#btn-20').click(()=> {
    sizaOfHighscoreList = 20
    $('#filter-btn').html('Top 20')
    fillHighScoreList()
})

$('#btn-all').click(()=> {
    sizaOfHighscoreList = 1000000
    $('#filter-btn').html('Top All')
    fillHighScoreList()
})

const fillHighScoreList = () => {

    
    $('#highscore-container').html('')

    let highScoreList = []

    axios.get(`${getAllUsers}`)
    .then(resp => {
        resp.data.forEach((user,index) => {
            let totalsteps = getTotalStepScore(user)
            highScoreList.push({
                "name": user.firstName + ' ' + user.lastName,
                "steps": totalsteps
            })
        })
        
    })
    .then(() => {
        sortPriceDecending(highScoreList)
        .slice(0,sizaOfHighscoreList)
        .forEach((user,index) => {
            $('#highscore-container').append(`
            <tr>
                <th scope="row">${index + 1}</th>
                <td>${user.name}</td>
                <td>${user.steps.toLocaleString(
                    "sv-SE",
                    {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                    }
                )}</td>
          </tr>
            `)
        })
    })   
}

const sortPriceDecending = (list) => { return list.sort((a, b) => parseFloat(b.steps) - parseFloat(a.steps))}

const getTotalStepScore = (user) => {
    let totalSteps = 0; 
    for (const iterator of user.steps) {
        totalSteps += parseInt(iterator.steps)
    }
    return totalSteps
}

/* -------------------------------- TEAM HIGHSCORE -------------------------------- */
