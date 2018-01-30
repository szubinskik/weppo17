window.addEventListener('load', refresh_games('', ''));

function f_search_submit()
{
    var title = document.getElementById('t_title').value;
    var description = document.getElementById('t_description').value;
    refresh_games(title, description);    
}

function get_game(id)
{
    var clist = document.getElementById('game_main');

    var req = new XMLHttpRequest();
    req.open('get', `/_game?id=${id}`, true);
    req.onreadystatechange = function()
    {
        if ( req.readyState == XMLHttpRequest.DONE )
        {
             clist.innerHTML = req.responseText;
        }
    }
    req.send();
}

function refresh_games(title, description)
{
    var clist = document.getElementById('column_list');

    var req = new XMLHttpRequest();
    req.open('get', `/_list?title=${title}&description=${description}`, true);
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
    req.setRequestHeader("X-CSRF-Token", _csrftoken);
    req.onreadystatechange = function()
    {
        if ( req.readyState == XMLHttpRequest.DONE )
        {
            update_basket();
        }
    }
    req.send();
}