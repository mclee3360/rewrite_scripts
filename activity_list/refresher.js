function refresh()
{
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Refresh')
        .getRange(1,1).setValue(new Date().getTime())
}

function onOpen()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var entries = [{
        name : "Refresh",
        functionName : "refresh"
    }];
    sheet.addMenu("Refresh", entries);
}
