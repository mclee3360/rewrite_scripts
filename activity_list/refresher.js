function daily_refresh()
{
    refresh_writer();
    refresh_editor();
    refresh_coord();
}

function refresh_writer()
{
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Refresh')
        .getRange(1,2,1,1).setValue(new Date().getTime())
}

function refresh_editor()
{
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Refresh')
        .getRange(2,2,1,1).setValue(new Date().getTime())
}

function refresh_coord()
{
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Refresh')
        .getRange(3,2,1,1).setValue(new Date().getTime())
}

function refresh_retired()
{
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Refresh')
        .getRange(4,2,1,1).setValue(new Date().getTime())
}

function onOpen()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var entries = [{
        name : "Refresh Writers",
        functionName : "refresh_writer"
    }, {
        name : "Refresh Editors",
        functionName : "refresh_editor"
    }, {
        name: "Refresh Coordinators",
        functionName : "refresh_coord"
    }, {
        name: "Refresh Retirees",
        functionName: "refresh_retired"
    }];
    sheet.addMenu("Refresh", entries);
}
