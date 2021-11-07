// FETCH FOR THE AUTH API
/*In order to integrate the auth API endpoints from the server with the frontend React components,
we will add methods for fetching "sign-in" and "sign-out" API endpoints here*/

//Sign-in
/*The signin method will take user sign-in data from the view component, then use fetch to make a POST
call to verify the user with the backend.
The response from the server will be returned to the component in a promise, which may provide the JWT
if sign-in was successful. The component invoking this method needs to handle the response appropriately,
such as storing the received JWT locally so it can be used when making calls to other protected API routes
from the frontend.
*/
const signin = async (user) => {
    try {
        let response = await fetch('/auth/signin/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        })
        return await response.json()
    }
    catch(err) { console.log(err) }
}

//Sign-out
/*This method will use fetch to make a GET call to the signout API endpoint on the server.*/
const signout = async () => {
    try {
        let response = await fetch('/auth/signout/', {
            method: 'GET'
        })
        return await response.json();
    }
    catch(err) { console.log(err) }
}

export { signin, signout }