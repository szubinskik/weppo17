window.addEventListener('load', refresh_games(''));

function b_search_clicked()
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