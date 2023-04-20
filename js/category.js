function modalPopCategory() {   
    fetchCategoryDropDown();
    createModalPop('modalCategory', 'cancelCategory', 'categoryForm', fetchCategoryFilms);
}

async function fetchCategoryDropDown()
{
    const uri = 'http://localhost/films-api/categories';
    const category = await getData(uri);
    parseCategoriesDropDown(category);
}

function parseCategoriesDropDown(category)
{
    const dropDownFilm = document.getElementById("catDropFilm");
    const dropDownActorFilm = document.getElementById("catDropActorFilms");
    const dropDownCat = document.getElementById("catDropCat");
    var modalCat = $('#modalCategory');
    var modalFilm = $('#modalFilms');

    category.forEach(cat=>{
        var opt = document.createElement('option');
        opt.text = `${cat.name}`;
        if(modalCat.hasClass('open' ))
        {
            opt.value = `${cat.category_id}`;
            dropDownCat.options.add(opt);
        }
        else if(modalFilm.hasClass('open' )) 
        {
            opt.value = `${cat.name}`;
            dropDownFilm.options.add(opt);
        }
        else {
            opt.value = `${cat.name}`;
            dropDownActorFilm.options.add(opt);
        } 
    });
}

async function fetchCategoryFilms()
{
    clearPage();
    const catId = document.getElementById("catDropCat").value;
    const uri = 'http://localhost/films-api/categories/' + catId + '/films';

    const fromLength = document.getElementById("fromLength").value;
    const toLength = document.getElementById("toLength").value;
    const rating = document.getElementById("ratingDropCat").value;

    const filters = {};

    if(fromLength != '')    
    {
        filters["fromLength"] = fromLength;
    }

    if(toLength != '')
    {
        filters["toLength"] = toLength;
    }

    if(rating != '')
    {
        filters["rating"] = rating;
    }

    const category = await getData(uri, filters);
    const checker = "categoryFilms";
    
    if(category != null)
    {
        parseFilms(category, checker);
    }
}

