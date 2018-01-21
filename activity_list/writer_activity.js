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
    // All user names to search for.
    var usernames = Array.prototype.slice.call(arguments, 1, arguments.length);
    // Parse 'In Progress' sheet
    var ipSheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName(inProgressName)
    var inProgress = ipSheet.getRange(startRow, 1, ipSheet.getLastRow(), writer)
        .getValues();
    var activeDate = parseWrittenActivity("N/A", usernames, inProgress);
    // Parse 'Archive' sheet
    var aSheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName(archiveName)
    var archive = aSheet.getRange(startRow, 1, aSheet.getLastRow(), writer)
        .getValues();
    return parseWrittenActivity(activeDate, usernames, archive);
}


function parseWrittenActivity(date, usernames, range)
{
    var activeDate = date;
    for (i = 0; i < range.length; i++)
    {
        for (j = 0; j < usernames.length; j++)
        {
            if (range[i][writer - 1] === usernames[j])
            {
                checkDate = range[i][wDate - 1];
                if (checkDate instanceof Date)
                {
                    if (activeDate == 'N/A')
                    {
                        activeDate = checkDate;
                    }
                    else
                    {
                        if (activeDate < checkDate < 0)
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
