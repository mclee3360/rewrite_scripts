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
 * Changes the current username and adds the previously current one to the list
 * of old usernames.
 *
 * @param old_name  the old username.
 * @param new_name  the new username.
 * @return whether or not the old username could be found and updated.
 */
function updateUsername(old_name, new_name)
{
    var sheet = SpreadsheetApp.openById(db_id).getSheetByName(db_sheet);
    var last_col = sheet.getLastColumn();
    var last_row = sheet.getLastRow();

    var names = sheet.getRange(2, db_name_col, last_row - 1, 1).getValues();
    var all_names_range = sheet.getRange(2, db_name_col, last_row - 1,
        last_col - db_name_col + 1);
    var all_names = all_names_range.getValues();

    // Locate row of old username; return false if not found.
    var row = -1;
    for (i = 0; i < names.length; i++)
    {
        if (names[i][0] == old_name)
        {
            row = i;
            break;
        }
    }
    if (row < 0)
    {
        return false;
    }

    // Set values in cells for old/new names. If not enough columns to add old
    // name, add another column.
    var index = 0;
    while (index < all_names[row].length)
    {
        if (all_names[row][index] == "")
        {
            all_names[row][index] = old_name;
            break;
        }
        index++;
    }
    if (index == all_names[row].length)
    {
        sheet.insertColumnsAfter(last_col, 1);
        last_col++;
        all_names_range = sheet.getRange(2, db_name_col, last_row - 1,
            sheet.getLastColumn() - db_name_col + 2);
        all_names = all_names_range.getValues();
        all_names[row][all_names[row].length - 1] = old_name;
    }
    all_names[row][0] = new_name;
    all_names_range.setValues(all_names);
    SpreadsheetApp.flush();
    sheet.getRange(2, 1, last_row - 1, last_col).sort([2, 5]);
    return true;
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
        + ":Z" + row + ", E" + row + ":" + row + " <> \"\")))), \"|\"))";
}
