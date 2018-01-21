

function onOpen()
{
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Refresh')
        .getRange(1,1).setValue(new Date().getTime())
}
