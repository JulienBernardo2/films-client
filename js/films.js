/**
 * Initializes the films modal
 */
function modalPopFilms() 
{   
    //Gets all of the categories and adds them to the drop down element of the modal
    fetchCategoryDropDown();
    
    //Gets all of the languages and adds them to the drop down element of the modal
    fetchLanguages();

    //Creates and configures the films modal
    createModalPop('modalFilms', 'cancelFilms', 'filmsForm', fetchFilms);
}

/**
 * Initializes the film modal
 */
function modalPopFilm() 
{ 
    //Creates and configures the film modal
    createModalPop('modalFilm', 'cancelFilm', 'filmForm', fetchFilm);
}

/**
 * Gets all of the films
 * @param {int} pageNum - The page number requested
 * @param {int} pageSize - The page size requested
 */
async function fetchFilms(pageNum, pageSize)
{
    //Clears the HTML page so that everything is empty
    clearPage();

    //Gets the value of the language, category, title and description elements 
    const language = document.getElementById("langDrop").value;
    const category = document.getElementById("catDropFilm").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    
    //Creates an key value pair array of filters to be applied
    const filters = {};

    //Sets the page and page size to the current page and page size requested
    filters["page"] = pageNum;
    filters["page_size"] = pageSize;

    //Checks if the value of the key is not empty and sets the filter into the array
    if(title != '')
    {
        filters["title"] = title;
    }

    //Checks if the value of the key is not empty and sets the filter into the array
    if(description != '')
    {
        filters["description"] = description;
    }

    //Checks if the value of the key is not empty and sets the filter into the array
    if(language != 'null')
    {
        filters["language"] = language;
    }

    //Checks if the value of the key is not empty and sets the filter into the array
    if(category != 'null')
    {
        filters['category'] = category;
    }

    //Sets the uri to get all of the films
    const uri = 'http://localhost/films-api/films';

    //Gets all of the films
    const films = await getData(uri, filters);
    
    //Sets the checker
    const checker = "films";

    //Makes sure that there are films to display
    if(films != null)
    {
        //Parses the films into a table
        parseFilms(films, checker, pageNum, pageSize);
    }
}

/**
 * Gets a film
 */
async function fetchFilm()
{
    //Clears the HTML page so that everything is empty
    clearPage();

    //Gets the film id from the input element value
    const filmId = document.getElementById("filmID").value;

    //Sets the uri to get the film
    const uri = 'http://localhost/films-api/films/' + filmId;

    //Gets the film
    const film = await getData(uri);
    
    //Sets the checker
    const checker = "film";

    //Makes sure that there are films to display
    if(film != null)
    {
        //Parses the films into a table
        parseFilms(film, checker);
    }
}

/**
 * Parses the films, film, films for an actor and films for a category into a HTML table
 * @param {array} films - The actors to add
 * @param {string} checker - The type of table to be created
 * @param {string} pageNum - The requested page number
 */
function parseFilms(films, checker, pageNum){

    //Initialize an empty string variable to store the rows of the table
    var rows = '';

    //Adds the header for the table
    rows = `
                <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Release Year</th>
                            <th>Rental Duration</th>
                            <th>Rental Rate</th>
                            <th>Replacement Cost</th>
                            <th>Length</th>
                            <th>Rating</th>
                            <th>Special Features</th>
                            
            `
            //Adds the specialized header for the data that is being parsed
            if(checker != 'actorFilms' && checker != 'film')
            {
                rows += `<th>Actors</th>`
            }
            //Adds the specialized header for the data that is being parsed
            if(checker == "films")
            {
                rows += `
                        <th>Language</th>
                        <th>Category</th>
                        `
            }
            //Adds the specialized header for the data that is being parsed
            if(checker == "actorFilms")
            {
                rows += `
                        <th>Category</th>
                        `
            }

    //Closes the header        
    rows += `               
                </tr>
                </thead>
        `
    //Makes sure that the correct table format is set for when we get all of the films
    if(checker == "films") 
    {
        //Creates the pagination buttons
        buttons = createPaginationButtons(pageNum, "fetchFilms", films.films.page_size, films.films.total_pages);
        
        //Iterates through each film and adds them to a row in the table
        films.films.data.forEach(film => {
            rows += `
                <tr>
                    <td>${film.title}</td>
                    <td>${film.description}</td>
                    <td>${film.release_year}</td>
                    <td>${film.rental_duration + " days"}</td>
                    <td>${"$" + film.rental_rate}</td>
                    <td>${"$" + film.replacement_cost}</td> 
                    <td>${film.length + " min"}</td>
                    <td>${film.rating}</td>
                    <td>${film.special_features}</td>
                    <td>${film.actors}</td>
                    <td>${film.language_name}</td>
                    <td>${film.category_name}</td>
                </tr>
            `
        });

        //Gets the counter for the films button
        var spFilmsCounter = document.getElementById("spFilmsCounter");
        
        //Sets the counter to the amount of films retrieved
        spFilmsCounter.innerHTML = films.films.data.length; 
    }

    //Makes sure that the correct table format is set for when we get a film
    if(checker == "film") 
    {
        //Adds the film to a row in the table
        rows += `
            <tr>
                <td>${films.title}</td>
                <td>${films.description}</td>
                <td>${films.release_year}</td>
                <td>${films.rental_duration + " days"}</td>
                <td>${"$" + films.rental_rate}</td>
                <td>${"$" + films.replacement_cost}</td> 
                <td>${films.length + " min"}</td>
                <td>${films.rating}</td>
                <td>${films.special_features}</td>
            </tr>
        `
        //Sets the pagination buttons to empty
        buttons = "";

        //Gets the counter for the film button
        var spFilmCounter = document.getElementById("spFilmCounter");
        
        //Sets the counter to the amount of films retrieved
        spFilmCounter.innerHTML = 1; 
    }

    //Makes sure that the correct table format is set for when we get all of the films for a category
    if(checker == "categoryFilms") 
    {
        //Gets the category name element from the HTML page
        var category_name = document.getElementById("categoryName");

        //Sets the inner HTMl of the element to the category name
        category_name.innerHTML = "Category: " + films.name;

        //Creates the pagination buttons
        buttons = createPaginationButtons(pageNum, "fetchCategoryFilms", films.film.page_size, films.film.total_pages);

        //Iterates through each film and adds them to a row in the table
        films.film.data.forEach(film => {
            rows += `
                <tr>
                    <td>${film.title}</td>
                    <td>${film.description}</td>
                    <td>${film.release_year}</td>
                    <td>${film.rental_duration + " days"}</td>
                    <td>${"$" + film.rental_rate}</td>
                    <td>${"$" + film.replacement_cost}</td> 
                    <td>${film.length + " min"}</td>
                    <td>${film.rating}</td>
                    <td>${film.special_features}</td>
                    <td>${film.actors}</td>
                </tr>
            `
        });
        
        //Gets the counter for the category films button
        var spCategoryCounter = document.getElementById("spCategoryCounter");
        
        //Sets the counter to the amount of films retrieved
        spCategoryCounter.innerHTML = films.film.data.length; 
    }

    //Makes sure that the correct table format is set for when we get all of the films for an actor
    if(checker == "actorFilms") 
    {
        //Gets the actor name element from the HTML page
        var actor_name = document.getElementById("actorName");
        
        //Sets the inner HTMl of the element to the actor name
        actor_name.innerHTML = "Actor: " + films.first_name + " " + films.last_name;

        //Creates the pagination buttons
        buttons = createPaginationButtons(pageNum, "fetchActorFilms", films.film.page_size, films.film.total_pages);

        //Iterates through each film and adds them to a row in the table
        films.film.data.forEach(film => {
            rows += `
                <tr>
                    <td>${film.title}</td>
                    <td>${film.description}</td>
                    <td>${film.release_year}</td>
                    <td>${film.rental_duration + " days"}</td>
                    <td>${"$" + film.rental_rate}</td>
                    <td>${"$" + film.replacement_cost}</td> 
                    <td>${film.length + " min"}</td>
                    <td>${film.rating}</td>
                    <td>${film.special_features}</td>
                    <td>${film.category_name}</td>
                </tr>
            `
        });
        
        //Gets the counter for the actor films button
        var spActorFilmsCounter = document.getElementById("spActorFilmsCounter");
        
        //Sets the counter to the amount of films retrieved
        spActorFilmsCounter.innerHTML = films.film.data.length; 
    }
        
    //Gets the pagination element in the HTML page
    var pagination = document.getElementById("pagination");
    
    //Sets the buttons to that page
    pagination.innerHTML = buttons;  
    
    //Gets the films table element in the HTML page
    var tblFilmsBody = document.getElementById("tblFilms");
    
    //Sets the rows for that table
    tblFilmsBody.innerHTML = rows;
}