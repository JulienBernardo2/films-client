/**
 * Gets all of the languages for the drop down element
 */
async function fetchLanguages()
{
    //Sets the uri to the languages route in our films-api
    const uri = 'http://localhost/films-api/languages';

    //Gets the data back from the response
    const languages = await getData(uri);

    //Parses the languages
    parseLanguages(languages);
}

/**
 * Parses the languages into a drop down menu for our modals
 * @param {array} languages - The languages available 
 */
function parseLanguages(languages)
{
    //Gets the language drop down element from the modal
    const dropDownLang = document.getElementById("langDrop");

    // Populates the language dropdown with all of the languages
    languages.forEach(lang => {
        //Creates a new option element for the drop down
        var opt = document.createElement('option');

        //Sets the value and text of the option element to the language name.
        opt.value = `${lang.name}`;
        opt.text = `${lang.name}`;

        //Adds the option element to the language dropdown.
        dropDownLang.options.add(opt);
    });
}