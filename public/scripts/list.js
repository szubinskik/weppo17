window.addEventListener('load', refresh_games(''));

function f_search_submit()
{
    var phrase = document.getElementById('t_search').value;
    refresh_games(phrase);    
}

function refresh_games(phrase)
{
    var clist = document.getElementById('column_list');

    var req = new XMLHttpRequest();
    req.open('get', `/_list?title=${phrase}`, true);
    req.onreadystatechange = function()
    {
        if ( req.readyState == XMLHttpRequest.DONE )
        {
             clist.innerHTML = req.responseText;
        }
    }
    req.send();
}

function basket_add(id)
{
    var req = new XMLHttpRequest();
    req.open('put', `/_basket?id=${id}`, true);
    req.onreadystatechange = function()
    {
        if ( req.readyState == XMLHttpRequest.DONE )
        {
            update_basket();
        }
    }
    req.send();
}