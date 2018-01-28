window.addEventListener('load', refresh_list(''));

function basket_add(id)
{
    var req = new XMLHttpRequest();
    req.open('put', `/_basket?id=${id}`, true);
    req.onreadystatechange = function()
    {
        if ( req.readyState == XMLHttpRequest.DONE )
        {
            refresh_list();
        }
    }
    req.send();
}

function basket_remove(id)
{
    var req = new XMLHttpRequest();
    req.open('delete', `/_basket?id=${id}`, true);
    req.onreadystatechange = function()
    {
        if ( req.readyState == XMLHttpRequest.DONE )
        {
            refresh_list();
        }
    }
    req.send();
}

function refresh_list()
{
    var clist = document.getElementById('basket_list');

    var req = new XMLHttpRequest();
    req.open('get', '/_blist', true);
    req.onreadystatechange = function()
    {
        if ( req.readyState == XMLHttpRequest.DONE )
        {
             clist.innerHTML = req.responseText;
        }
    }
    req.send();
}