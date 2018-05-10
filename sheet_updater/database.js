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
 * @param values  the rows from the sheet updater to update.
 * @return a list of usernames that could not be found.
 */
function updateUsernames(values)
{
    var sheet = SpreadsheetApp.openById(db_id).getSheetByName(db_sheet);
    var last_col = sheet.getLastColumn();
    var last_row = sheet.getLastRow();
    var names_range = sheet.getRange(2, db_name_col, sheet.getLastRow() - 1, 1);
    var names = names_range.getValues();
    var all_names_range = sheet.getRange(2, db_name_col, sheet.getLastRow() - 1,
        sheet.getLastColumn() - db_name_col + 1);
    var all_names = all_names_range.getValues();
    var errors = [];
    var made_change = false;
    for (i = 0; i < values.length; i++)
    {
        var old_name = values[i][old_name_col - 1];
        var new_name = values[i][new_name_col - 1];
        var index = -1;
        for (j = 0; j < names.length; j++)
        {
            if (names[j][0] == old_name)
            {
                index = j;
                break;
            }
        }
        if (index < 0)
        {
            errors.push(old_name);
        }
        else
        {
            all_names[index][0] = new_name;
            var is_space = false;
            for (j = 0; j < all_names[index].length; j++)
            {
                if (all_names[index][j] == "")
                {
                    all_names[index][j] = old_name;
                    is_space = true;
                    made_change = true;
                    break;
                }
            }
            if (!is_space)
            {
                if (made_change)
                {
                    all_names_range.setValues(all_names);
                    SpreadsheetApp.flush();
                }
                sheet.insertColumnsAfter(last_col, 1);
                last_col++;
                all_names_range = sheet.getRange(2, db_name_col, sheet.getLastRow() - 1,
                    sheet.getLastColumn() - db_name_col + 2);
                all_names = all_names_range.getValues();
                all_names[index][0] = new_name;
                all_names[index][all_names[index].length - 1] = old_name;
                made_change = true;
            }
        }
    }
    all_names_range.setValues(all_names);
    SpreadsheetApp.flush();
    return errors;
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
