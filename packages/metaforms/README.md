# Metaforms

A tool for building and managing forms in simple JSON format.


## usage:
```typescript
// build form definition on server
const definitions = metaform()
    .addTextField('name', { label: 'Name' })
        .validationRequired('Please fill it!')
    .addNumberField('age', { label: 'Age', additionalProps: 'ok' })
    .addSubmitButton('submit')

    // send to client as JSON
    res.json(definitions.toJSON()) // .toString() etc..

// then on web wait for user input
const loaded = metaformClient()
    .fromJSON(response) // .fromString()

loaded.update('name', 'value')
loaded.validate('name') // validate one field and show errorMessage next to it

loaded.validate() // validate whole form
if (loaded.isValid()) {
    await send(loaded.values())
}

// POST route on server
const submitted = definitions()
    .fillValues({ name: req.body.name, age: req.body.age })
    .validate()

    if(submitted.hasErrors()) {
        return  log(submitted.errors())
    }
    submitted.getValues() // { name: 'A', age: 4 }

```
## usage:
```typescript
import { hasError, setFieldValue, validateForm } from "metaforms";

// An example of login form, which is serialized as JSON object for easier manipulation
const loginForm = {
  email: {
    type: "email",
    label: "Email",
    placeholder: "Enter your email address",
    value: "",
    validation: [
      { type: "required", message: "Please enter your email address" },
      { type: "pattern", message: "Sorry, we do not recognise that email address", value: "^.*@.*\\..*$" }
    ]
  },
  password: {
    type: "password",
    label: "Password",
    value: "",
    validation: [
      { type: "required", message: "Please enter your password" },
    ]
  },
  submit: {
    type: "submit",
    label: "Login"
  }
};

// which we can then take and fill with values:
const formWithValues = compose(
  validateForm,
  setFieldValue("email", "my@email.com"),
  setFieldValue("password", "pass#or!")
)(loginForm);


// or read the values
getFormData(formWithValues); // will produce: { email: "my@email.com", password: "pass#or!" }
 

// or check if the form has any errors
if (hasError(formWithValues)) {
  // if does, we can remove sensitive values and send it back to frontend of our app
  const formToReturn = setFieldValue("password", "", formWithValues);
}
```


