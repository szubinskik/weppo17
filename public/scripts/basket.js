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
