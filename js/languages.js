async function fetchLanguages()
{
    const uri = 'http://localhost/films-api/languages';
    const languages = await getData(uri);
    parseLanguages(languages);
}

function parseLanguages(languages)
{
    const dropDownLang = document.getElementById("langDrop");

    languages.forEach(function(lang){
        var opt = document.createElement('option');
        opt.value = `${lang.name}`;
        opt.text = `${lang.name}`;       
        dropDownLang.options.add(opt);
    });
}