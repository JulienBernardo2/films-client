/**
 * Initializes the category modal
 */
function modalPopCategory() 
{   
    //Gets all of the categories and adds them to the drop down element of the modal
    fetchCategoryDropDown();

    //Creates and configures the category modal
    createModalPop('modalCategory', 'cancelCategory', 'categoryForm', fetchCategoryFilms);
}

/**
 * Gets all of the categories for the drop down element
 */
async function fetchCategoryDropDown()
{
    //Sets the uri to the category route in our films-api
    const uri = 'http://localhost/films-api/categories';
    
    //Gets the data back from the response
    const category = await getData(uri);
    
    //Parses the categories
    parseCategoriesDropDown(category);
}

/**
 * Parses the categories into a drop down menu for our modals
 * @param {array} category - The categories to add
 */
function parseCategoriesDropDown(category)
{
    //Gets the dropdown elements for films, actor films, and categories
    const dropDownFilm = document.getElementById("catDropFilm");
    const dropDownActorFilm = document.getElementById("catDropActorFilms");
    const dropDownCat = document.getElementById("catDropCat");

    //Gets the modal elements for categories and films
    var modalCat = $('#modalCategory');
    var modalFilm = $('#modalFilms');

    //Populates the dropdown elements with the categories
    category.forEach(cat=>{
        //Creates a new option element for the drop down
        var opt = document.createElement('option');
        
        //Sets the text for the option to the category name
        opt.text = `${cat.name}`;
        
        //Checks if the current modal that is displayed is the category films
        if(modalCat.hasClass('open' ))
        {
            //Sets the value of the option to the category id
            opt.value = `${cat.category_id}`;
            
            //Adds the option to the drop down
            dropDownCat.options.add(opt);
        }
        //Checks if the current modal that is displayed is the films
        else if(modalFilm.hasClass('open' )) 
        {
            //Sets the value of the option to the category name
            opt.value = `${cat.name}`;
            
            //Adds the option to the drop down
            dropDownFilm.options.add(opt);
        }
        //Sets the options for the actor films modal
        else {
            opt.value = `${cat.name}`;
            dropDownActorFilm.options.add(opt);
        } 
    });
}

/**
 * Gets all of the films for a category
 * @param {int} pageNum - The page number requested
 * @param {int} pageSize - The page size requested
 */
async function fetchCategoryFilms(pageNum, pageSize)
{
    //Clears the HTML page so that everything is empty
    clearPage();

    //Gets the value of the fromLength, toLength and rating elements 
    const fromLength = document.getElementById("fromLength").value;
    const toLength = document.getElementById("toLength").value;
    const rating = document.getElementById("ratingDropCat").value;

    //Creates an key value pair array of filters to be applied
    const filters = {};

    //Sets the page and page size to the current page and page size requested
    filters["page"] = pageNum;
    filters["page_size"] = pageSize;

    //Checks if the value of the key is not empty and sets the filter into the array
    if(fromLength != '')    
    {
        filters["fromLength"] = fromLength;
    }

    //Checks if the value of the key is not empty and sets the filter into the array
    if(toLength != '')
    {
        filters["toLength"] = toLength;
    }

    //Checks if the value of the key is not empty and sets the filter into the array
    if(rating != '')
    {
        filters["rating"] = rating;
    }

    //Gets the category id from the selected value in the category drop down element
    const catId = document.getElementById("catDropCat").value;

    //Sets the uri to get all of the films for the specified category
    const uri = 'http://localhost/films-api/categories/' + catId + '/films';

    //Gets all of the films for the specified category
    const category = await getData(uri, filters);
    
    //Sets the checker
    const checker = "categoryFilms";
    
    //Makes sure that there are films to display
    if(category != null)
    {
        //Parses the films into a table
        parseFilms(category, checker, pageNum);
    }
}