








var form = document.querySelector('#query-form');
var inputs = document.querySelectorAll('input');
var textareas = document.querySelectorAll('textarea');
var selects = document.querySelectorAll('select');
var result = document.querySelector('#result');
var resultContainer = document.querySelectorAll('.result-container')[0];
var submitForm = true;
var feildDisplayNameMapping = {
    "fname": "First name",
    "lname": "Last name",
    "gender": "Male",
    "address": "Address",
    "country": "Country",
    "mobile": "Phone number",
    "email": "Email ID",
    "password": "Password",
}

var formKeyMapping = {
    0 : "fname",
    1 : "lname",
    2 : "gender",
    3 : "address",
    4 : "country",
    5 : "mobile",
    6 : "email",
    7 : "password",
    8 : "cpassword"  
};

var formKeyErrorMapping = {
    0 : "Please enter first name",
    1 : "Please enter last name",
    2 : "Please select gender",
    3 : "Please enter address",
    4 : "Please select country",
    5 : "Please enter a 10 digit mobile number",
    6 : "Please enter email",
    7 : "Please enter password <br>"+   
        "<ul class='error-list'>" + 
            "<li>Password should have atleast one number. </li>" +
            "<li>Password should have atleast one upper case and one lower case letter." +
            "<li>Password should have atleast one special character.</li>" +
            "<li>Password should have atleast 8 characters.</li>" +
        "</ul>",
    8 : "Please check your password"  
};

var itemsToBeSkippedInOutput = [
    "cpassword",
]

var events = [
    'change',
    'keydown'
];

function showError(itemName, error) {
    var htmlNode = document.querySelector('[name=' + itemName +']')
    htmlNode.closest(".form-group").querySelector("#error").innerHTML = error;
    submitForm = false;
}

function hideError(htmlNode) {
    // var htmlNode = document.querySelector(e.target);
    htmlNode.closest(".form-group").querySelector("#error").innerHTML = '';
}


function validatePhoneNumber(phone) {
    var testRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    return testRegex.test(phone);
}

function validatePassword(password) {
    var testRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    return testRegex.test(password);
}

// handle Change for input elements
inputs.forEach(function(input) {
    events.forEach(function(event) {
        input.addEventListener(event, function() {
            hideError(input);        
        })
    });
});

// handle Change for textarea elements
textareas.forEach(function(textarea) {
    events.forEach(function(event) {
        textarea.addEventListener(event, function() {
            hideError(textarea);        
        })
    });
});

// handle Change for select elements
selects.forEach(function(select) {
    events.forEach(function(event) {
        select.addEventListener(event, function() {
            hideError(select);        
        })
    });
});

form.onsubmit = function(e) {
    e.preventDefault();
    result.innerHTML = ''
    resultContainer.style.display = "none";
    var formData = new FormData(form);
    var formDataArray = Array.from(formData);
    var formKeys = Array.from(formData.keys());
    var formValues = Array.from(formData.values());
    submitForm = true;
    // console form data
    console.log(form, formDataArray, formKeys, formValues);
    
    // Validate mobile number   
    if(!validatePhoneNumber(formValues[5])) {
        showError(formKeyMapping[5], formKeyErrorMapping[5]);
    }

    // Validate password   
    if(!validatePassword(formValues[7])) {
        showError(formKeyMapping[7], formKeyErrorMapping[7]);
    }

    // Validate confirm password
    if(!validatePassword(formValues[8]) || formValues[7] !== formValues[8]) {
        showError(formKeyMapping[8], formKeyErrorMapping[8]);
    }


    // Check for empty values
    if(formValues.includes("")) {
        formValues.forEach(function(item, index) {
            if(item.trim().length == 0) {
                showError(formKeyMapping[index], formKeyErrorMapping[index]);
            }
        });
        return;
    }

    // Prepare and show output
    if(submitForm) {
        resultContainer.style.display = "block";

        // PRINT DATA IN HTML 
        formDataArray.forEach(function(item) {
            var itemName = item[0],
                itemValue = item[1];
    
            if(!itemsToBeSkippedInOutput.includes(itemName)) {
                var row = document.createElement("tr");
                columns = "<td>" + itemName + "</td>" + "<td>" + itemValue + "</td>";        
                row.innerHTML = columns;
                result.append(row);
            }
        })
    }
}

function clearOutput() {
    result.innerHTML = '';
    resultContainer.style.display = "none";
}