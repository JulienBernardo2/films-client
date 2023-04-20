async function getData(uri, filters){
    const reqHeaders = new Headers({
        'Content-Type': 'application/json',
        'Accept' : 'application/json'
    }); 

    if(filters != null)
    {  
        const length = Object.keys(filters).length;
        const keys = Object.keys(filters);
        
        if(length > 0)
        {           
            for(let i = 0; i < length; i++)
            {
                var key = keys[i];
                var value = filters[key];

                if(i == 0)
                {
                    uri += '?'
                }

                uri += key + '=' + value;

                if(length > 1 && i < length){
                    uri += '&';
                }
            }
        }
    }

    const request = new Request({
        method : 'GET',
        headers: reqHeaders
    });

    const response = await fetch(uri, request);

    if(response.status === 200) {
        const data = await response.json();
        return data;
    } else if (response.status === 404) {
        popUpNoContent("The ID does not exist");
    } else if (response.status === 204) {
        popUpNoContent("There are no values matching with the filters");
    }
}

async function createData(uri, bodyParams){
    const reqHeaders = new Headers({
        'Content-Type': 'application/json',
        'Accept' : 'application/json'
    }); 

    const request = new Request({
        method : 'POST',
        headers: reqHeaders,
        body: bodyParams
    });
    console.log(request);
    const response = await fetch(uri, request);

    if(response.status === 200) {
        popUpNoContent("The Actor was created");
        const data = await response.json();
        return data;
    }
}

function clearPage()
{
    var tables = document.getElementsByName("tbl");
    var counters = document.getElementsByName("counter");
    var category_name = document.getElementById("categoryName");
    var actor_name = document.getElementById("actorName");  
    
    category_name.innerHTML = "";
    actor_name.innerHTML = "";

    for (var i = 0; i < tables.length; i++) {
        tables[i].innerHTML = "";
    }

    for (var i = 0; i < counters.length; i++) {
        counters[i].innerHTML = 0;
    }
} 

//Used to add the modal html to the index file
function populateModal() {
    $('#modals').load('modal.html')
}

function createModalPop(modalId, cancelId, formId, func) {
    const modal = $('#' + modalId);
    const cancel = $('#' + cancelId);

    $('#' + formId).on('submit', event => {
        event.preventDefault();
        
        var isValid = validateForm(formId);

        if(isValid)
        {
            func();
            modal.hide();
            modal.removeClass( 'open' );
            $( '.container' ).removeClass( 'blur' );
        }
    });

    modal.show();
    modal.addClass('open' ); 
    if (modal.hasClass('open' ) ) {
        $('.container' ).addClass('blur' );
    }

    cancel.on('click', function(){
       modal.hide();
       modal.removeClass( 'open' );
       $( '.container' ).removeClass( 'blur' );
    });
    
  }

function validateForm(form)
{
    var form = document.forms[form];
    var inputs = form.getElementsByTagName("input");
    var patternOnlyAlpha = /^[a-zA-Z\s]*$/;
    var patternOnlyInt = /^[1-9]\d*$/;
    var isValid = true;

    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var value = input.value;
        var errorCheck = document.getElementById(input.id + "error");

        if(input.id == "title" || input.id == "description" || input.id == "firstName" || input.id == "lastName") {
            if(!value.match(patternOnlyAlpha) && value != '')
            {
                createErrorMessage(input, "Please enter an alphabetical value.");
                isValid = false;
            } else if(errorCheck){
                deleteErrorMessage(input);
            }
        }
        if(input.id == "fromLength" || input.id == "toLength")
        {
            if(!value.match(patternOnlyInt) && value != '')
            {
                createErrorMessage(input, "Please enter a full number greater than 0.");
                isValid = false;
            } else if(errorCheck){
                deleteErrorMessage(input);
            }
        } 

        if(input.id == "filmID" || input.id == "actorID")
        {
            if(value == "" || !value.match(patternOnlyInt))
            {
                createErrorMessage(input, "Please enter a full number greater than 0.");
                isValid = false;
            } else if(errorCheck){
                deleteErrorMessage(input);
            }
        }

        if(form.id == "categoryForm")
        {
            var catDropDown = document.getElementById("catDropCat");
            var errorCheckCat = document.getElementById(catDropDown.id + "error");

            if(catDropDown.value == "null")
            {
                createErrorMessage(catDropDown, "Please select a category.");
                isValid = false;
            } else if(errorCheckCat){
                deleteErrorMessage(catDropDown);
            }
        }
        
        if(input.id == "firstNameC" || input.id == "lastNameC")
        {
            if(value == "")
            {
                createErrorMessage(input, "Please enter a first and last name.");
                isValid = false;
            } else if(!value.match(patternOnlyAlpha))
            {
                createErrorMessage(input, "Please enter an alphabetical value.");
                isValid = false;
            } else if(errorCheck){
                deleteErrorMessage(input);
            }
        }
    }
    return isValid;
}

function createErrorMessage(input, text)
{
    var errorLabel = document.getElementById(input.id + "error");
    if(errorLabel == null)
    {
        input.style.border = "1px solid red";
        var errorLabel = document.createElement("label");
        errorLabel.setAttribute("id", input.id + "error");
        errorLabel.style.color = "red";
        errorLabel.textContent = text;
        input.parentNode.insertBefore(errorLabel, input.nextSibling);
    }
}

function deleteErrorMessage(input)
{
    input.style.border = "1px solid #ccc";
    var errorLabel = document.getElementById(input.id + "error");
    errorLabel.parentNode.removeChild(errorLabel);
}

function popUpNoContent(text){
    alertify.dismissAll();
    alertify.set('notifier', 'position', 'top-center');
    alertify.error(text);        
};