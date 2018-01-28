function addToQueue(names)
{
    var sheet = SpreadsheetApp.openById(new_writers_id).getSheetByName(nw_none);
    var values = [];
    var startRow = sheet.getLastRow() + 1;
    var lastRow = startRow;
    sheet.insertRowsAfter(startRow - 1, names.length);
    for (i = 0; i < names.length; i++)
    {
        lastRow = startRow + i;
        values.push([
            names[i][0],
            names[i][1],
            "=getUsernames(A" + lastRow + ", B" + lastRow + ")",
            "=IF(EQ(IFERROR(QUERY(QUERY(Archive!A:B, \"SELECT B WHERE '\"&C"
                + lastRow + "&\"' CONTAINS A\", 0), \"SELECT * LIMIT 1\"), 0), 0), "
                + "IF(EQ(IFERROR(QUERY(QUERY('In Progress'!A:B, \"SELECT B "
                + "WHERE '\"&C" + lastRow + "3&\"' CONTAINS A\", 0), \"SELECT * "
                + "LIMIT 1\"), 0), 0), \"No\", \"Yes\"), \"Yes\")"
        ]);
    }
    sheet.getRange(startRow, 1, names.length, 4).setValues(values);
}
