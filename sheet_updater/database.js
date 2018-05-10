/**
 * Adds new members to the database sheet.
 *
 * @param values  the rows to add.
 */
function addToDatabase(values)
{
    var sheet = SpreadsheetApp.openById(db_id).getSheetByName(db_sheet);
    var last_row = sheet.getLastRow();
    sheet.insertRowsAfter(last_row, values.length);
    var current_row = last_row;
    var new_values = [];
    var formulas = [];
    for (i = 0; i < values.length; i++)
    {
        new_values.push(
            [
                values[i][id_col - 1],
                values[i][role_col - 1],
                values[i][email_col - 1],
                "",
                values[i][name_col - 1]
            ]
        );
        formulas.push([getUsernamesFunction(current_row + 1)]);
        current_row++;
    }
    sheet.getRange("A" + (last_row + 1) + ":E" + current_row).setValues(new_values);
    SpreadsheetApp.flush();
    sheet.getRange("D" + (last_row + 1) + ":D" + current_row).setFormulas(formulas);
    SpreadsheetApp.flush();
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).sort([2, 5]);
}

/**
 * Gets the formula for concatenating all versions of the user's usernames
 * (includes previous ones) into a "|" delimited string.
 *
 * @param row  the row number.
 * @return the formula.
 */
function getUsernamesFunction(row)
{
    return "=LOWER(CONCAT(CONCAT(\"|\", JOIN(\"|\", TRANSPOSE(FILTER(E" + row
        + ":Z" + row + ", E" + row + ":Z" + row + " <> \"\")))), \"|\"))";
}
