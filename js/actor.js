function modalPopActor() {
    createModalPop('modalActor', 'cancelActor', 'actorForm', fetchActors);
}

function modalPopActorFilms() {
    fetchCategoryDropDown();
    createModalPop('modalActorFilms', 'cancelActorFilms', 'actorFilmsForm', fetchActorFilms);
}

function modalPopActorCreate() {
    createModalPop('modalActorCreate', 'cancelActorCreate', 'actorFormCreate', createActor);
}

async function createActor()
{
    clearPage();
    const first_name = document.getElementById("firstNameC").value;
    const last_name = document.getElementById("lastNameC").value;
    
    var body = JSON.stringify({
        "first_name" : first_name,
        "last_name": last_name
    });
    
    const uri = 'http://localhost/films-api/actors';
    await createData(uri, body);
}

async function fetchActorFilms()
{
      clearPage();
      const actor_Id = document.getElementById("actorID").value;
      const uri = 'http://localhost/films-api/actors/' + actor_Id + '/films';
   
      const category = document.getElementById("catDropActorFilms").value;
      const rating = document.getElementById("ratingDropActor").value;
  
      const filters = {};
  
      if(category != 'null')    
      {
          filters["category"] = category;
      }
  
      if(rating != '')
      {
          filters["rating"] = rating;
      }
  
      const actor = await getData(uri, filters);
      const checker = "actorFilms";

      if(actor != null)
      {
        parseFilms(actor, checker);
      }
}

async function fetchActors()
{
    clearPage();

    const first_name = document.getElementById("firstName").value;
    const last_name = document.getElementById("lastName").value;

    const filters = {};

    if(first_name != '')
    {
        filters["first_name"] = first_name;
    }

    if(last_name != '')
    {
        filters["last_name"] = last_name;
    }

    const uri = 'http://localhost/films-api/actors';
    const actors = await getData(uri, filters);

    if(actors != null)
    {
        parseActors(actors);
    }
}

function parseActors(actors){
    
    var rows = '';

    rows = `
                <thead>
                        <tr>
                            <th>First name</th>
                            <th>Last name</th>
                        </tr>
                </thead>
            `
        actors.data.forEach(actor => {
        rows += `
            <tr>
                <td>${actor.first_name}</td>
                <td>${actor.last_name}</td>
            </tr>
        `
    });
    var tblActors = document.getElementById("tblActors");
    tblActors.innerHTML = rows;
    
    var spActorsCounter = document.getElementById("spActorsCounter");
    spActorsCounter.innerHTML = actors.data.length;   
}