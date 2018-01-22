/**
 * Gets a range of the In Progress sheet on the tracker.
 *
 * @return a range with the data from the In Progress sheet.
 */
function getIPRange()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(inProgressName)
    return sheet.getRange(startRow, 1, sheet.getLastRow(), p2Editor).getValues();
}

/**
 * Gets a range of the Archive sheet on the tracker.
 *
 * @return a range with the data from the Archive sheet.
 */
function getArchiveRange()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(archiveName)
    return sheet.getRange(startRow, 1, sheet.getLastRow(), p2Editor).getValues();
}

/**
 * Gets a range of the 2018 applications sheet.
 *
 * @return a range with the data from the 2018 Applications sheet
 */
function getAppsRange2018()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(apps2018Name)
    return sheet.getRange(startRow, 1, sheet.getLastRow(), applicant).getValues();
}

/**
 * Gets an array of all of the given usernames.
 *
 * @param name_cell1  the user's current username.
 * @param name_cell2  a string of a list of the user's former usernames (if
 *                    any), separated by a comma and space.
 * @return an array of all of the above usernames.
 */
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
