function update_basket()
{
    var clist = document.getElementById('basket_navbar');

    var req = new XMLHttpRequest();
    req.open('get', '/_bnavbar', true);
    req.onreadystatechange = function()
    {
        if ( req.readyState == XMLHttpRequest.DONE )
        {
             clist.innerHTML = req.responseText;
        }
    }
    req.send();
}