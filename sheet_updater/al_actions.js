/**
 * Adds new member to the Activity List.
 *
 * @param id       the member's MAL ID.
 * @param role     the member's role.
 * @param appDate  the date the member applied.
 */
function addToActivityList(id, role, appDate)
{
    var spreadsheet = SpreadsheetApp.openById(activity_list_id);
    switch (role)
    {
        case writer_title:
            addActivity(id, appDate, spreadsheet.getSheetByName(al_writers));
            break;
        case editor_title:
            addActivity(id, appDate, spreadsheet.getSheetByName(al_editors));
            break;
        case coord_title:
            addActivity(id, appDate, spreadsheet.getSheetByName(al_coordinators));
            break;
        default:
            break;
    }
}

/**
 * Adds rows to a sheet in the activity list.
 *
 * @param id       the member's MAL ID.
 * @param appDate  the date the member applied.
 * @param sheet    the sheet to update.
 */
function addActivity(id, appDate, sheet)
{
    var last_row = sheet.getLastRow();
    sheet.insertRowAfter(last_row);
    last_row++;
    sheet.getRange("A" + last_row + ":A" + last_row).setFormulas([[getHyperlinkFunction(id)]]);
    SpreadsheetApp.flush();
    sheet.getRange("B" + last_row + ":B" + last_row).setValues([[appDate]]);
    SpreadsheetApp.flush();
    sheet.getRange("A2:E" + last_row).sort(1);
}

/**
 * Updates the activity list with a user's new MAL ID.
 *
 * @param user  the user to update.
 * @param id    the user's new ID.
 * @param role  the user's role.
 * @return if the user was found and updated successfully.
 */
function updateActivityId(user, id, role)
{
    var spreadsheet = SpreadsheetApp.openById(activity_list_id);
    var sheet;
    switch (role)
    {
        case writer_title:
            sheet = spreadsheet.getSheetByName(al_writers);
            break;
        case editor_title:
            sheet = spreadsheet.getSheetByName(al_editors);
            break;
        case coord_title:
            sheet = spreadsheet.getSheetByName(al_coordinators);
            break;
        case contrib_title:
            sheet = spreadsheet.getSheetByName(al_contributors);
            break;
        default:
            return false;
    }
    return updateActivitySheetId(user, id, sheet);
}

/**
 * Updates the ID being tracked for the user.
 *
 * @param user   the user to update ID.
 * @param id     the user's new ID.
 * @param sheet  the sheet to update on.
 * @return if the user was found and successfully updated.
 */
function updateActivitySheetId(user, id, sheet)
{
    var range = sheet.getRange(2, al_user_col, sheet.getLastRow() - 1, 1);
    var names = range.getValues();
    var formulas = range.getFormulas();
    var index = -1;
    for (i = 0; i < names.length; i++)
    {
        if (checkNames(user, names[i][0]))
        {
            index = i;
            break;
        }
    }
    if (index < 0)
    {
        return false;
    }
    formulas[i][0] = getHyperlinkFunction(id);
    range.setFormulas(formulas);
    SpreadsheetApp.flush();
    return true;
}

/**
 *
 */
function updateRole(user, old_role, new_role)
{
    var spreadsheet = SpreadsheetApp.openById(activity_list_id);
    var sheet1;
    switch (old_role)
    {
        case writer_title:
            sheet1 = spreadsheet.getSheetByName(al_writers);
            break;
        case editor_title:
            sheet1 = spreadsheet.getSheetByName(al_editors);
            break;
        case coord_title:
            sheet1 = spreadsheet.getSheetByName(al_coordinators);
            break;
        case contrib_title:
            sheet1 = spreadsheet.getSheetByName(al_contributors);
            break;
        default:
            break;
    }
    var sheet2;
    switch (new_role)
    {
        case writer_title:
            sheet2 = spreadsheet.getSheetByName(al_writers);
            break;
        case editor_title:
            sheet2 = spreadsheet.getSheetByName(al_editors);
            break;
        case coord_title:
            sheet2 = spreadsheet.getSheetByName(al_coordinators);
            break;
        case contrib_title:
            sheet2 = spreadsheet.getSheetByName(al_contributors);
            break;
        default:
            break;
    }
    if (old_role == contrib_title)
    {
        unretire(user, sheet1, sheet2);
    }
    else if (new_role == contrib_title)
    {
        retire(user, old_role, sheet1, sheet2);
    }
    else
    {
        moveRole(user, sheet1, sheet2);
    }
}

/**
 * Moves a user from one sheet to another for active roles within Rewrite.
 * Excludes Contributor role due to differences in sheet structure.
 *
 * @param user       the username of the user to move.
 * @param fromSheet  the sheet to move the user from.
 * @param toSheet    the sheet to move the user to.
 * @return whether or not the user was successfully found and moved.
 */
function moveRole(user, fromSheet, toSheet)
{
    var last_row = fromSheet.getLastRow();
    var values = fromSheet.getRange(2, 1, last_row - 1, al_last_col).getValues();
    var formulas = fromSheet.getRange(2, al_user_col, last_row - 1, 1).getFormulas();
    var index = -1;
    for (var i = 0; i < values.length; i++)
    {
        if (checkNames(user, values[i][al_user_col - 1]))
        {
            index = i;
            break;
        }
    }
    if (index < 0)
    {
        return false;
    }
    var formula = formulas[index];
    var value = values[index];
    values = fromSheet.getRange(2, 1, last_row - 1, al_last_col + 1).getValues();
    values = values.slice(0, index).concat(values.slice(index + 1));
    formulas = formulas.slice(0, index).concat(formulas.slice(index + 1));
    fromSheet.getRange(2, 1, last_row - 2, al_last_col + 1).setValues(values);
    fromSheet.getRange(2, al_user_col, last_row - 2, 1).setFormulas(formulas);
    fromSheet.deleteRow(last_row);
    last_row = toSheet.getLastRow();
    toSheet.insertRowAfter(last_row);
    last_row++;
    toSheet.getRange(last_row, 1, 1, al_last_col).setValues([value]);
    toSheet.getRange(last_row, 1, 1, 1).setFormulas([formula]);
    SpreadsheetApp.flush();
    toSheet.getRange("A2:E" + last_row).sort(1);
}

/**
 * Moves a user to the contributor sheet.
 *
 * @param user       the username of the user to move.
 * @param role       the (former) role of the user to move.
 * @param fromSheet  the sheet to move the user from.
 * @param cSheet     the sheet for contributors.
 * @return whether or not the user was successfully found and moved.
 */
function retire(user, role, fromSheet, cSheet)
{
    var last_row = fromSheet.getLastRow();
    var values = fromSheet.getRange(2, 1, last_row - 1, al_last_col).getValues();
    var formulas = fromSheet.getRange(2, al_user_col, last_row - 1, 1).getFormulas();
    var index = -1;
    for (var i = 0; i < values.length; i++)
    {
        if (checkNames(user, values[i][al_user_col - 1]))
        {
            index = i;
            break;
        }
    }
    if (index < 0)
    {
        return false;
    }
    var formula = formulas[index];
    var value = values[index];
    value = ["", value[al_date_col - 1], role, value[al_note_col - 1]];
    // Remove row from original sheet.
    values = fromSheet.getRange(2, 1, last_row - 1, al_last_col + 1).getValues();
    values = values.slice(0, index).concat(values.slice(index + 1));
    formulas = formulas.slice(0, index).concat(formulas.slice(index + 1));
    fromSheet.getRange(2, 1, last_row - 2, al_last_col + 1).setValues(values);
    fromSheet.getRange(2, al_user_col, last_row - 2, 1).setFormulas(formulas);
    fromSheet.deleteRow(last_row);
    // Add to contributor sheet.
    last_row = cSheet.getLastRow();
    cSheet.insertRowAfter(last_row);
    last_row++;
    cSheet.getRange(last_row, 1, 1, al_last_col).setValues([value]);
    cSheet.getRange(last_row, 1, 1, 1).setFormulas([formula]);
    SpreadsheetApp.flush();
    cSheet.getRange("A2:D" + last_row).sort([3, 1]);
}

/**
 * Moves a user out of the contributor sheet.
 *
 * @param user     the username of the user to move.
 * @param cSheet   the sheet for contributors.
 * @param toSheet  the sheet to move the user to.
 * @return whether or not the user was successfully found and moved.
 */
function unretire(user, cSheet, toSheet)
{
    var last_row = cSheet.getLastRow();
    var values = cSheet.getRange(2, 1, last_row - 1, al_last_col).getValues();
    var formulas = cSheet.getRange(2, al_user_col, last_row - 1, 1).getFormulas();
    var index = -1;
    for (var i = 0; i < values.length; i++)
    {
        if (checkNames(user, values[i][al_user_col - 1]))
        {
            index = i;
            break;
        }
    }
    if (index < 0)
    {
        return false;
    }
    var formula = formulas[index];
    var value = values[index];
    value = ["", value[al_date_col - 1], "", value[al_note_col - 1]];
    // Remove row from original sheet.
    values = values.slice(0, index).concat(values.slice(index + 1));
    formulas = formulas.slice(0, index).concat(formulas.slice(index + 1));
    cSheet.getRange(2, 1, last_row - 2, al_last_col).setValues(values);
    cSheet.getRange(2, al_user_col, last_row - 2, 1).setFormulas(formulas);
    cSheet.deleteRow(last_row);
    // Add to contributor sheet.
    last_row = toSheet.getLastRow();
    toSheet.insertRowAfter(last_row);
    last_row++;
    toSheet.getRange(last_row, 1, 1, al_last_col).setValues([value]);
    toSheet.getRange(last_row, 1, 1, 1).setFormulas([formula]);
    SpreadsheetApp.flush();
    toSheet.getRange("A2:E" + last_row).sort(1);
}

/**
 * Gets the formula for getting the hyperlink to the user's MAL profile.
 *
 * @param id  the user's MAL ID.
 * @return the formula.
 */
function getHyperlinkFunction(id)
{
    return "=HYPERLINK(\"https://myanimelist.net/profile/\" & VLOOKUP(" + id
        + ", {Users!$D:$D, Users!$C:$C}, 2, FALSE), VLOOKUP(" + id
        + ", {Users!$D:$D, Users!$C:$C}, 2, FALSE))";
}
