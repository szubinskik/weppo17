function b_search_clicked()
{
    var clist = document.getElementById('column_list');
    var phrase = document.getElementById('t_search').value;

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