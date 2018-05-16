/**
 * Adds new member to the database sheet.
 *
 * @param user   the member's username.
 * @param id     the member's id.
 * @param role   the member's role.
 * @param email  the member's email.
 */
function addToDatabase(user, id, role, email)
{
    var sheet = SpreadsheetApp.openById(db_id).getSheetByName(db_sheet);
    var last_row = sheet.getLastRow();
    sheet.insertRowAfter(last_row);
    last_row++;
    var new_values = [[id, role, email, "", user]];
    var formulas = [[getUsernamesFunction(last_row)]];
    sheet.getRange("A" + last_row + ":E" + last_row).setValues(new_values);
    SpreadsheetApp.flush();
    sheet.getRange("D" + last_row + ":D" + last_row).setFormulas(formulas);
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
        if (checkNames(old_name, names[i][0]))
        {
            old_name = names[i][0];
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
 * Updates a user's email in the database.
 *
 * @param user   the user to update.
 * @param email  the new email.
 * @return true if the user was found, false if not.
 */
function updateDatabaseEmail(user, email)
{
    var sheet = SpreadsheetApp.openById(db_id).getSheetByName(db_sheet);
    var last_row = sheet.getLastRow();
    // Locate row of user; return false if not found.
    var names = sheet.getRange(2, db_name_col, last_row - 1, 1).getValues();
    var row = -1;
    for (i = 0; i < names.length; i++)
    {
        if (checkNames(user, names[i][0]))
        {
            row = i;
            break;
        }
    }
    if (row < 0)
    {
        return false;
    }
    // Update email
    var email_range = sheet.getRange(2, db_email_col, last_row - 1, 1);
    var emails = email_range.getValues();
    emails[row][0] = email;
    email_range.setValues(emails);
    SpreadsheetApp.flush();
    return true;
}

/**
 * Gets a user's role.
 *
 * @param user  the user to check.
 * @return the user's role, null if the user is not found.
 */
function getUserRole(user)
{
    var sheet = SpreadsheetApp.openById(db_id).getSheetByName(db_sheet);
    var last_row = sheet.getLastRow();
    // Locate row of user; return null if not found.
    var names = sheet.getRange(2, db_name_col, last_row - 1, 1).getValues();
    var row = -1;
    for (i = 0; i < names.length; i++)
    {
        if (checkNames(user, names[i][0]))
        {
            row = i;
            break;
        }
    }
    if (row < 0)
    {
        return null;
    }
    return sheet.getRange(2, db_role_col, last_row - 1, 1).getValues()[i][0];
}

/**
 * Updates a user's MAL ID in the database.
 *
 * @param user  the user to update.
 * @param id    the user's ID.
 * @return if the user was found and updated successfully.
 */
function updateDatabaseId(user, id)
{
    var sheet = SpreadsheetApp.openById(db_id).getSheetByName(db_sheet);
    var last_row = sheet.getLastRow();
    // Locate row of user; return null if not found.
    var names = sheet.getRange(2, db_name_col, last_row - 1, 1).getValues();
    var row = -1;
    for (i = 0; i < names.length; i++)
    {
        if (checkNames(user, names[i][0]))
        {
            row = i;
            break;
        }
    }
    if (row < 0)
    {
        return false;
    }
    // Update ID and get role.
    var range = sheet.getRange(2, db_id_col, last_row - 1, 1);
    var ids = range.getValues();
    ids[row][0] = id;
    range.setValues(ids);
    SpreadsheetApp.flush();
    return true;
}

/**
 * Check if a user exists in the database.
 *
 * @param user  the username of the user to check.
 * @return if the user already exists.
 */
function doesExist(user)
{
    var sheet = SpreadsheetApp.openById(db_id).getSheetByName(db_sheet);
    var names = sheet.getRange(2, db_name_col, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < names.length; i++)
    {
        if (checkNames(user, names[i][0]))
        {
            return true;
        }
    }
    return false;
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
