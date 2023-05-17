/**
 * Initializes the actor modal
 */
function modalPopActor() 
{
    
    //Creates and configures the actor modal
    createModalPop('modalActor', 'cancelActor', 'actorForm', fetchActors);
}

/**
 * Initializes the actor films modal
 */
function modalPopActorFilms() 
{
    
    //Gets all of the categories and adds them to the drop down element of the modal
    fetchCategoryDropDown();
    
    //Creates and configures the actor films modal
    createModalPop('modalActorFilms', 'cancelActorFilms', 'actorFilmsForm', fetchActorFilms);
}

/**
 * Initializes the actor create modal
 */
function modalPopActorCreate() 
{
    //Creates and configures the actor create modal
    createModalPop('modalActorCreate', 'cancelActorCreate', 'actorFormCreate', createActor);
}

/**
 * Posts an actor
 */
async function createActor()
{
    //Clears the HTML page so that everything is empty
    clearPage();

    //Gets the value of the first name and last name input elements from the modal
    const first_name = document.getElementById("firstNameC").value;
    const last_name = document.getElementById("lastNameC").value;
    
    //Creates a key value pair array to form the body of the POST request
    var body = [{ first_name: first_name, last_name: last_name }];
    
    //Sets the uri to post an actor
    const uri = 'http://localhost/films-api/actors';

    //Creates the request
    await createData(uri, body);
}

/**
 * Gets all of the films for an actor
 * @param {int} pageNum - The page number requested 
 * @param {int} pageSize - The page size requested
 */
async function fetchActorFilms(pageNum, pageSize)
{
    //Clears the HTML page so that everything is empty
    clearPage();
    
    //Gets the value of the rating and category elements 
    const category = document.getElementById("catDropActorFilms").value;
    const rating = document.getElementById("ratingDropActor").value;

    //Creates an key value pair array of filters to be applied
    const filters = {};
    
    //Sets the page and page size to the current page and page size requested
    filters["page"] = pageNum;
    filters["page_size"] = pageSize;

    //Checks if the value of the key is not empty and sets the filter into the array
    if(category != 'null')    
    {
        filters["category"] = category;
    }

    //Checks if the value of the key is not empty and sets the filter into the array
    if(rating != '')
    {
        filters["rating"] = rating;
    }
    
    //Gets the actor id from the input element value
    const actor_Id = document.getElementById("actorID").value;

    //Sets the uri to get all of the films for the specified actor
    const uri = 'http://localhost/films-api/actors/' + actor_Id + '/films';

    //Gets all of the films for the specified actor
    const actor = await getData(uri, filters);

    //Sets the checker
    const checker = "actorFilms";

    //Makes sure that there are films to display
    if(actor != null)
    {
        //Parses the films into a table
        parseFilms(actor, checker, pageNum);
    }
}

/**
 * Gets all of the actors
 * @param {int} pageNum - The page number requested
 * @param {int} pageSize - The page size requested 
 */
async function fetchActors(pageNum, pageSize)
{
    //Clears the HTML page so that everything is empty
    clearPage();

    //Gets the value of the first name and last name elements 
    const first_name = document.getElementById("firstName").value;
    const last_name = document.getElementById("lastName").value;

    //Creates an key value pair array of filters to be applied
    const filters = {};

    //Sets the page and page size to the current page and page size requested
    filters["page"] = pageNum;
    filters["page_size"] = pageSize;

    //Checks if the value of the key is not empty and sets the filter into the array
    if(first_name != '')
    {
        filters["first_name"] = first_name;
    }

    //Checks if the value of the key is not empty and sets the filter into the array
    if(last_name != '')
    {
        filters["last_name"] = last_name;
    }

    //Sets the uri to get all of the actors
    const uri = 'http://localhost/films-api/actors';

    //Gets all of the actors
    const actors = await getData(uri, filters);

    //Makes sure that there are actors to display
    if(actors != null)
    {
        //Parses the actors into a table
        parseActors(actors, pageNum);
    }
}

/**
 * Parses the actors into a HTML table
 * @param {array} actors - The actors to add
 * @param {string} pageNum - The requested page number
 */
function parseActors(actors, pageNum)
{  
    //Initialize an empty string variable to store the rows of the table
    var rows = '';
    
    //Creates the pagination buttons
    buttons = createPaginationButtons(pageNum, "fetchActors", actors.page_size, actors.total_pages);

    //Adds the header for the table
    rows = `
                <thead>
                        <tr>
                            <th>First name</th>
                            <th>Last name</th>
                        </tr>
                </thead>
            `
        //Iterates through each actor and adds them to a row in the table
        actors.data.forEach(actor => {
        rows += `
            <tr>
                <td>${actor.first_name}</td>
                <td>${actor.last_name}</td>
            </tr>
        `
    });

    //Gets the pagination element in the HTML page
    var pagination = document.getElementById("pagination");
    
    //Sets the buttons to that page
    pagination.innerHTML = buttons;

    //Gets the actor table element in the HTML page
    var tblActors = document.getElementById("tblActors");

    //Sets the rows for that table
    tblActors.innerHTML = rows;
    
    //Gets the counter for the actors button
    var spActorsCounter = document.getElementById("spActorsCounter");

    //Sets the counter to the amount of actors retrieved
    spActorsCounter.innerHTML = actors.data.length;   
}