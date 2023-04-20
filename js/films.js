function modalPopFilms() {   
    fetchCategoryDropDown();
    fetchLanguages();
    createModalPop('modalFilms', 'cancelFilms', 'filmsForm', fetchFilms);
}

function modalPopFilm() { 
    createModalPop('modalFilm', 'cancelFilm', 'filmForm', fetchFilm);
}

async function fetchFilms()
{
    clearPage();

    const language = document.getElementById("langDrop").value;
    const category = document.getElementById("catDropFilm").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    const filters = {};

    if(title != '')
    {
        filters["title"] = title;
    }

    if(description != '')
    {
        filters["description"] = description;
    }

    if(language != 'null')
    {
        filters["language"] = language;
    }

    if(category != 'null')
    {
        filters['category'] = category;
    }

    const uri = 'http://localhost/films-api/films';
    const films = await getData(uri, filters);
    const checker = "films";
    
    if(films != null)
    {
        parseFilms(films, checker);
    }
}

async function fetchFilm()
{
    clearPage();

    const filmId = document.getElementById("filmID").value;
    const uri = 'http://localhost/films-api/films/' + filmId;

    const film = await getData(uri);
    const checker = "film";

    if(film != null)
    {
        parseFilms(film, checker);
    }
}

function parseFilms(films, checker){

    var rows = '';

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
            if(checker != 'actorFilms' && checker != 'film')
            {
                rows += `<th>Actors</th>`
            }
            if(checker == "films")
            {
                rows += `
                        <th>Language</th>
                        <th>Category</th>
                        `
            }
            if(checker == "actorFilms")
            {
                rows += `
                        <th>Category</th>
                        `
            }
            rows += `               
                        </tr>
                        </thead>
                `
    if(checker == "films") {
        films.data.forEach(film => {
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
        var spFilmsCounter = document.getElementById("spFilmsCounter");
        spFilmsCounter.innerHTML = films.data.length; 
    }

    if(checker == "film") {
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
        var spFilmCounter = document.getElementById("spFilmCounter");
        spFilmCounter.innerHTML = 1; 
    }

    if(checker == "categoryFilms") {

        var category_name = document.getElementById("categoryName");
        category_name.innerHTML = "Category: " + films.name;

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
        var spCategoryCounter = document.getElementById("spCategoryCounter");
        spCategoryCounter.innerHTML = films.film.data.length; 
    }

    if(checker == "actorFilms") {

        var actor_name = document.getElementById("actorName");
        actor_name.innerHTML = "Actor: " + films.first_name + " " + films.last_name;

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
        var spActorFilmsCounter = document.getElementById("spActorFilmsCounter");
        spActorFilmsCounter.innerHTML = films.film.data.length; 
    }
    
    var tblFilmsBody = document.getElementById("tblFilms");
    tblFilmsBody.innerHTML = rows;
}