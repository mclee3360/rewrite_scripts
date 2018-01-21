function refresh_writer()
{
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Refresh')
        .getRange(1,1,1,1).setValue(new Date().getTime())
}

function refresh_editor()
{
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Refresh')
        .getRange(1,2,1,1).setValue(new Date().getTime())
}

function onOpen()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var entries = [{
        name : "Refresh",
        functionName : "refresh_writer"
    }, {
        name : "Refresh Editors",
        functionName : "refresh_editor"
    }];
    sheet.addMenu("Refresh", entries);
}
