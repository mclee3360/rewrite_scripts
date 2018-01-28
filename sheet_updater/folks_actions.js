function addToFolks(members)
{
    var sheet = SpreadsheetApp.openById(folks_id).getSheetByName(folks_sheet);
    var values = [];
    var startRow = sheet.getLastRow() + 1;
    var lastRow = startRow;
    sheet.insertRowsAfter(startRow - 1, members.length);
    for (i = 0; i < members.length; i++)
    {
        lastRow = startRow + i;
        values.push([members[i][name_col - 1], "---", members[i][role_col - 1],
            members[i][email_col - 1]]);
    }
    sheet.getRange(startRow, 1, members.length, 4).setValues(values);
    sheet.getRange(2, 1, lastRow - 1, 4).sort([3, 1]);
}
