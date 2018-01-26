/**
 * Gets a string list of all usernames a member has had, delimited by ' ' as
 * well as surround by ' '. All usernames are formatted to be lowercase.
 *
 * @param cell1  the cell containing the current username.
 * @param cell2  the cell containing the list of former usernames. List should
 *               be delimited by ', '.
 * @return the string list.
 */
function getUsernames(cell1, cell2)
{
    var list = " " + cell1.toLowerCase();
    if (cell2.length > 0)
    {
        var former = cell2.split(", ");
        for (i = 0; i < former.length; i++)
        {
            list += (" " + former[i].toLowerCase());
        }
    }
    return list + " ";
}
