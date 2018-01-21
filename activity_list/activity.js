// Sheet IDs and names
var inProgressName = 'Synopses in Progress';
var archiveName = 'Archive';
// Row Numbers
var startRow = 2;
// Column Numbers
var wDate = 1;
var writer = 4;
var p1Date = 7;
var p1Editor = 8;
var p2Date = 9;
var p2Editor = 10;

function getActivityWriter(refresher, username)
{
    var ipSheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName(inProgressName)
    // Parse 'In Progress' sheet
    var inProgress = ipSheet.getRange(startRow, 1, ipSheet.getLastRow(), writer)
        .getValues();
    var activeDate = 'N/A'
    for (i = 0; i < inProgress.length; i++)
    {
        for (j = 1; j < arguments.length; j++)
        {
            if (inProgress[i][writer - 1] === arguments[j])
            {
                checkDate = inProgress[i][wDate - 1];
                if (checkDate.toString().length > 0)
                {
                    checkDate = (checkDate.getMonth() + 1).toString() + '/'
                        + checkDate.getDate().toString() + '/'
                        + checkDate.getFullYear().toString();
                    if (activeDate == 'N/A')
                    {
                        activeDate = checkDate;
                    }
                    else
                    {
                        if (compareDate(activeDate, checkDate) < 0)
                        {
                            activeDate = checkDate;
                        }
                    }
                }
            }
        }
    }
    // Parse 'Archive' sheet
    var aSheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName(archiveName)
    var archive = aSheet.getRange(startRow, 1, aSheet.getLastRow(), writer)
        .getValues();
    for (i = 0; i < archive.length; i++)
    {
        for (j = 1; j < arguments.length; j++)
        {
            Logger.log(arguments[j])
            if (archive[i][writer - 1] === arguments[j])
            {
                checkDate = archive[i][wDate - 1];
                if (checkDate.toString().length > 0)
                {
                    checkDate = (checkDate.getMonth() + 1).toString() + '/'
                        + checkDate.getDate().toString() + '/'
                        + checkDate.getFullYear().toString();
                    if (activeDate == 'N/A')
                    {
                        activeDate = checkDate;
                    }
                    else
                    {
                        if (compareDate(activeDate, checkDate) < 0)
                        {
                            activeDate = checkDate;
                        }
                    }
                }
            }
        }
    }
    return activeDate;
}
