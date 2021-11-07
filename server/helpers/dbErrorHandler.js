/*The validation constraints that are added to the user schema fields will throw error
messages if they're violated when user data is saved to the database. To handle these
validation errors and other errors that the database may throw when we make queries to it,
we define a helper method that will return a relevant error message that can be propagated
in the request-response cycle as appropriate.
This method will parse and return the error message associated with the specific validation
error or other errors that can occur while querying MongoDB using Mongoose.
*/
const getErrorMessage = err => {
    let message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err)
                break
            default:
                message = 'Something went wrong'
        }
    }
    else {
        for (let errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }
    return message;
}

/*Errors that are not thrown because of a Mongoose validator violation will contain an
associated error code. In some cases, these errors need to be handled differently. For
example, errors caused due to a violation of the unique constraint will return an
error object that is different from Mongoose validation errors. The unique option is
not a validator but a convenient helper for building MongoDB unique indexes, so we
will add another getUniqueErrorMessage method to parse the unique constraintrelated
error object and construct an appropriate error message.
*/
const getUniqueErrorMessage = err => {
    let output
    try {
        let fieldName = err.message.substring(err.message.lastIndexOf('.$') + 2, err.message.lastIndexOf('_1'))
        output = fieldName.chartAt(0).toUpperCase() + fieldName.slice(1) + 'already exists'
    }
    catch (ex) {
        output = 'Unique field already exists'
    }
    return output;
}

export default { getErrorMessage };
 