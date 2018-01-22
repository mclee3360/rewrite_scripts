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

function getAppsRange2018()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(apps2018Name)
    return sheet.getRange(startRow, 1, sheet.getLastRow(), applicant).getValues();
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
