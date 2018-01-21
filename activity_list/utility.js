function getIPRange()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(inProgressName)
    return sheet.getRange(startRow, 1, sheet.getLastRow(), p2Editor).getValues();
}

function getArchiveRange()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(archiveName)
    return sheet.getRange(startRow, 1, sheet.getLastRow(), p2Editor).getValues();
}

function getUsernames(cell1, cell2)
{
    var names = [cell1.toLowerCase()];
    if (cell2.length > 0)
    {
        var othernames = cell2.split(", ");
        for (i = 0; i < othernames.length; i++)
        {
            names.push(othernames[i].toLowerCase());
        }
    }
    return names;
}

/**
 * Compares two date strings formatted as 'MM/DD/YYYY'.
 *
 * @param d1  the date being compared.
 * @param d2  the date being compared to.
 * @return a negative value if d1 < d2, a positive value if d1 > d2; 0 if
 *         they are equivalent.
 */
function compareDate(d1, d2)
{
    if (d1 == d2)
    {
        return 0;
    }
    var d1split = d1.split('/');
    var d2split = d2.split('/');
    // Compare years.
    var d1year = parseInt(d1split[2]);
    var d2year = parseInt(d2split[2]);
    if (d1year < d2year)
    {
        return -1;
    }
    else if (d1year > d2year)
    {
        return 1;
    }
    // Compare months.
    var d1mon = parseInt(d1split[0]);
    var d2mon = parseInt(d2split[0]);
    if (d1mon < d2mon)
    {
        return -1;
    }
    else if (d1mon > d2mon)
    {
        return 1;
    }
    // Compare days.
    var d1day = parseInt(d1split[1]);
    var d2day = parseInt(d2split[1]);
    if (d1day < d2day)
    {
        return -1;
    }
    else if (d1day > d2day)
    {
        return 1;
    }
    return 0;
}
