/**
 * Represents the function to perform GET HTTP method requests
 * @param {string} uri - The uri to access the resource 
 * @param {array} filters - The query parameters
 * @returns - The response data  
 */
async function getData(uri, filters)
{
    //Creates the header for the request
    const reqHeaders = new Headers({
        'Content-Type': 'application/json',
        'Accept' : 'application/json'
    }); 

    //Check if there are any filters applied
    if(filters != null)
    {  
        //Gets the amount of the filters applied
        const length = Object.keys(filters).length;

        //Gets all of the keys and their values from the filters array
        const keys = Object.keys(filters);
      
        //Loops through the array of filters 
        for(let i = 0; i < length; i++)
        {
            //Gets the name of the key
            var key = keys[i];

            //Gets the value that was placed for the key
            var value = filters[key];

            //Appends a question mark to the uri when the first filter is applied
            if(i == 0)
            {
                uri += '?'
            }

            //Appends the key name and value to the uri
            uri += key + '=' + value;

            //Checks to put a & sign in the uri if there is more than one filter applied
            if(length > 1 && i < length-1){
                uri += '&';
            }
        }
    }

    //Creates the request using the GET method and header previously created
    const request = new Request(uri, {
        method : 'GET',
        headers: reqHeaders
    });

    //Gets the response
    const response = await fetch(request);

    //Checks if the response code is good and if not then it sends the appropriate message
    if(response.status === 200) {
        const data = await response.json();
        return data;
    } 
    else if (response.status === 404) {
        popUpNoContent("The ID does not exist", "error");
    } 
    else if (response.status === 204) {
        popUpNoContent("There are no values matching with the filters", "error");
    }
}

/**
 * Represents the function to perform POST HTTP method requests
 * @param {string} uri - The uri to access the resource 
 * @param {array} bodyParams - The body parameters
 * @returns - The response 
 */
async function createData(uri, bodyParams)
{
    //Creates the header for the request
    const reqHeaders = new Headers({
        'Content-Type': 'application/json',
        'Accept' : 'application/json'
    }); 

    //Creates the request using the POST method and header previously created
    const request = new Request(uri, {
        method : 'POST',
        headers: reqHeaders,
        //Turns the bodyParams array into json format
        body: JSON.stringify(bodyParams)
    });
    
    //Gets the response
    const response = await fetch(request);

    //Checks if the response code is good sends the appropriate message
    if(response.status === 201) {
        popUpNoContent("The Actor was created", "none");
        const data = await response.json();
        return data;
    }
}

/**
 * Clears the page by resetting various elements and it is used when a user sends a request
 */
function clearPage()
{
    //Gets the table elements currently displayed
    var tables = document.getElementsByName("tbl");

    //Gets the counter elements currently displayed
    var counters = document.getElementsByName("counter");

    //Gets the category name element that is displayed when user fetches films from a category
    var category_name = document.getElementById("categoryName");
    
    //Gets the actor name element that is displayed when user fetches films from an actor
    var actor_name = document.getElementById("actorName");  

    //Gets the pagination buttons that are currently displayed
    var pagination = document.getElementById("pagination");  
    
    //Sets the inner html to empty
    pagination.innerHTML = "";
    category_name.innerHTML = "";
    actor_name.innerHTML = "";

    //Loops through the tables
    for (var i = 0; i < tables.length; i++) {
        
        //For each table the inner html becomes empty
        tables[i].innerHTML = "";
    }

    //Loops through the counters
    for (var i = 0; i < counters.length; i++) {

        //For each counter the inner html becomes empty
        counters[i].innerHTML = 0;
    }
} 

/**
 * It is used to load the modal.html file into the index file so that when called the modal will appear
 */
function populateModal() 
{
    $('#modals').load('modal.html')
}

/**
 * Makes the appropriate modal appear and disappear
 * 
 * @param {string} modalId - The ID of the modal element
 * @param {string} cancelId - The ID of the cancel button element for that modal
 * @param {string} formId - The ID of the form element for that modal
 * @param {Function} func - The function to be called when the form is submitted for that modal
 */
function createModalPop(modalId, cancelId, formId, func) 
{
    //Gets the modal based on the ID
    const modal = $('#' + modalId);

    //Gets the cancel button for that modal based on the ID
    const cancel = $('#' + cancelId);

    //Displays the modal
    modal.addClass('open' );
    
    //Checks if the modal is displayed and puts the blurred effect on the background
    if (modal.hasClass('open' ) ) {
        $('.container' ).addClass('blur' );
    }

    //Attaches an event handler to the form's submit event
    $('#' + formId).on('submit', event => {

        //Prevents the form from being submitted when the modal appears
        event.preventDefault();
        
        //Validates the form to make sure the data entered in the filters is correct
        var isValid = validateForm(formId);

        //Submits the form if the filters are valid
        if(isValid)
        {
            //Performs the function and passes it the page and pagesize
            func(1, 10);

            //Hides the modal from being seen 
            modal.removeClass( 'open' );

            //Removes the blurred effect from the page
            $( '.container' ).removeClass( 'blur' );
        }
    });

    //Attaches an event handler for when the cancel button is clicked
    cancel.on('click', function(){
        //Closes the modal
        modal.removeClass( 'open' );
        
        //Removes the blurred effect of the page
        $( '.container' ).removeClass( 'blur' );
    });
}

/**
 * Validates a form based on specific input requirements
 * @param {string} form - The form to be validated
 * @returns  The if the state of the form values are accepted or not
 */
function validateForm(form)
{
    //Gets the form element from the html doc
    var form = document.forms[form];

    //Gets all of the input elements from the form
    var inputs = form.getElementsByTagName("input");

    //Regex for only accepting alphabetical values
    var patternOnlyAlpha = /^[a-zA-Z\s]*$/;

    //Regex for only accepting full numbers greater than 0
    var patternOnlyInt = /^[1-9]\d*$/;

    //The boolean for when a form is valid or not
    var isValid = true;

    //Loops through the inputs to check if they are valid
    for (var i = 0; i < inputs.length; i++) {
        
        //Gets the current input element
        var input = inputs[i];

        //Gets the value of the input
        var value = input.value;

        //Gets an error element for that input
        var errorCheck = document.getElementById(input.id + "error");
        
        //If the input IDs match any of these then it checks the values if the values are valid
        if(input.id == "title" || input.id == "description" || input.id == "firstName" || input.id == "lastName") 
        {
            //Makes sure the value is alphabetical and not empty
            if(!value.match(patternOnlyAlpha) && value != '')
            {
                //If it is invalid then it adds the error message to the input when the form is submitted
                createErrorMessage(input, "Please enter an alphabetical value.");
                
                //Sets the form to invalid
                isValid = false;
            }
            //Checks if there is already an error for the input 
            else if(errorCheck)
            {
                //Deletes the current error so when the form is resubmitted it will show the new error if there is one
                deleteErrorMessage(input);
            }
        }

        //If the input IDs match any of these then it checks the values if the values are valid
        if(input.id == "fromLength" || input.id == "toLength")
        {
            //Makes sure the value is only a full number and not empty
            if(!value.match(patternOnlyInt) && value != '')
            {
                //If it is invalid then it adds the error message to the input when the form is submitted
                createErrorMessage(input, "Please enter a full number greater than 0.");
                
                //Sets the form to invalid
                isValid = false;
            } 
            //Checks if there is already an error for the input 
            else if(errorCheck)
            {
                //Deletes the current error so when the form is resubmitted it will show the new error if there is one
                deleteErrorMessage(input);
            }
        } 

        //If the input IDs match any of these then it checks the values if the values are valid
        if(input.id == "filmID" || input.id == "actorID")
        {
            //Makes sure the value is only a full number and not empty
            if(value == "" || !value.match(patternOnlyInt))
            {
                //If it is invalid then it adds the error message to the input when the form is submitted
                createErrorMessage(input, "Please enter a full number greater than 0.");
                
                //Sets the form to invalid
                isValid = false;
            } 
            //Checks if there is already an error for the input 
            else if(errorCheck)
            {
                //Deletes the current error so when the form is resubmitted it will show the new error if there is one
                deleteErrorMessage(input);
            }
        }

        //If the form is the films category then it checks if the form is valid
        if(form.id == "categoryForm")
        {
            //Gets the category drop down element from the form
            var catDropDown = document.getElementById("catDropCat");

            //Gets an error element for that drop down
            var errorCheckCat = document.getElementById(catDropDown.id + "error");

            //Makes sure that the value of the form is not null
            if(catDropDown.value == "null")
            {
                //If it is invalid then it adds the error message to the input when the form is submitted
                createErrorMessage(catDropDown, "Please select a category.");
                
                //Sets the form to invalid
                isValid = false;
            } 
            //Checks if there is already an error for the input 
            else if(errorCheckCat)
            {
                //Deletes the current error so when the form is resubmitted it will show the new error if there is one
                deleteErrorMessage(input);
            }
        }
        
        //If the form is the create actor then it checks if the form is valid
        if(form.id == "actorFormCreate")
        {
            //Makes sure that the value of the input is not empty and is an alphabetical value
            if(value == "" || !value.match(patternOnlyAlpha))
            {
                //If it is invalid then it adds the error message to the input when the form is submitted
                createErrorMessage(input, "Please enter an alphabetical value.");
                
                //Sets the form to invalid
                isValid = false;
            } 
            //Checks if there is already an error for the input 
            else if(errorCheck)
            {
                //Deletes the current error so when the form is resubmitted it will show the new error if there is one
                deleteErrorMessage(input);
            }
        }
    }

    //Returns if the form is valid or not
    return isValid;
}

/**
 * Creates an error message for displaying incorrect input values
 * @param {HTMLElement} input - The input element
 * @param {string} text - The error text to display
 */
function createErrorMessage(input, text)
{
    //Deletes any existing error messages
    deleteErrorMessage(input);

    //Makes the input box red
    input.style.border = "1px solid red";

    //Creates a label element for the error
    var errorLabel = document.createElement("label");

    //Sets the id for the label
    errorLabel.setAttribute("id", input.id + "error");

    //Sets the color for the error text
    errorLabel.style.color = "red";

    //Sets the text
    errorLabel.textContent = text;

    //Inserts the error label right after the input element, as a sibling node.
    input.parentNode.insertBefore(errorLabel, input.nextSibling);
}

/**
 * Deletes any error label that is linked with an input element
 * @param {HTMLElement} input - The input element
 */
function deleteErrorMessage(input)
{
    //Sets the input box back to grey
    input.style.border = "1px solid #ccc";

    //Gets the error label element which is for the input
    var errorLabel = document.getElementById(input.id + "error");

    //If there is a label element then it removes it
    if(errorLabel)
    {
        errorLabel.parentNode.removeChild(errorLabel);
    }
}

/**
 * Pops up a message depending on the type of response code that was sent back
 * @param {string} text - The text to be displayed
 * @param {string} checker - The type of message that should be shown
 */
function popUpNoContent(text, checker)
{ 
    //Clears all pre-existing messages being shown
    alertify.dismissAll();

    //Sets the position for the message and type
    alertify.set('notifier', 'position', 'top-center');

    //If the message should be an error then it 
    //sets the message to an error type and if its not then it sets the message to a success type
    if(checker == "error")
    {
        alertify.error(text);     
    } else {
        alertify.success(text);     
    } 
};

/**
 * Updates the pagination settings
 * @param {Function} method - The method to be called  
 * @param {string} checker - The type of button that was clicked
 * @param {int} pageNum - The current page number
 * @param {int} pageSize - The current page size
 * @param {int} newPageSize - The new page size requested
 * @param {int} maxPage - The last page number from the response data
 */
function pagination(method, pageNum, checker, pageSize, newPageSize, maxPage)
{  
    //Checks if the button pressed was the next page button 
    if(checker == "next")
    {
        //Checks if the page number is the same as the last page from the response
        if(pageNum == maxPage)
        {
            //Sends an error message
            popUpNoContent("This is the last page", "error");
        }
        //Increases the page number
        else {
            pageNum++;
        }
    }

    //Checks if the button pressed was the previous page button 
    if(checker == "previous")
    {
        //Checks if the page number is 1
        if(pageNum == 1)
        {
            //Sends an error message
            popUpNoContent("This is the first page", "error");
        }
        //Decreases the page number
        else {
            pageNum--;
        }
    }

    //Checks if there is a new page size requested
    if(newPageSize != "none")
    {
        //Sets the current page size back to 0
        pageSize = 0;

        //Sets the current page number to the first page
        pageNum = 1;

        //Sets the current page size to the new one that was requested
        pageSize = parseInt(newPageSize);
    }

    //Performs the method while sending the new page number and page size
    method(pageNum, pageSize);
}

/**
 * Creates the pagination buttons
 * @param {int} pageNum - The current page number
 * @param {Function} method - The method to be called
 * @param {int} pageSize - The current page size
 * @param {int} totalPages - The total amount of pages from the response data
 * @returns The pagination options to be displayed on the HTML page
 */
function createPaginationButtons(pageNum, method, pageSize, totalPages)
{
    // Initialize an empty string variable to store the buttons of the table
    buttons = '';

    //Adds the next, previous buttons with the page size drop down menu
    buttons += `<button type="button" onclick="pagination(${method}, ${pageNum}, 'next', ${pageSize}, 'none', ${totalPages})"  class="btn btn-secondary" style="margin-right: 2%;">Next page</button>`
    buttons += `<button type="button" onclick="pagination(${method}, ${pageNum}, 'previous', ${pageSize}, 'none')" class="btn btn-secondary" style="margin-right: 2%;">Previous page</button>`
    
    buttons += 
                `
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                        Page size
                    </button>
                    <div class="dropdown-menu">
                        <button class="dropdown-item" type="button" onClick="pagination(${method}, ${pageNum}, 'none', ${pageSize}, '10')">10</button>
                        <button class="dropdown-item" type="button" onClick="pagination(${method}, ${pageNum}, 'none', ${pageSize}, '20')">20</button>
                        <button class="dropdown-item" type="button" onClick="pagination(${method}, ${pageNum}, 'none', ${pageSize}, '30')">30</button>
                        <button class="dropdown-item" type="button" onClick="pagination(${method}, ${pageNum}, 'none', ${pageSize}, '40')">40</button>
                        <button class="dropdown-item" type="button" onClick="pagination(${method}, ${pageNum}, 'none', ${pageSize}, '50')">50</button>
                    </div>
                `

    //Returns the button element to be displayed
    return buttons;
}