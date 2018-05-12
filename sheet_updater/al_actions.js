/**
 * Adds new members to the Activity List.
 *
 * @param values  the rows to add.
 */
function addToActivityList(values)
{
    var writers = [];
    var editors = [];
    var coordinators = [];
    for (i = 0; i < values.length; i++)
    {
        var role = values[i][role_col - 1];
        if (role == writer_title)
        {
            writers.push(values[i]);
        }
        else if (role == editor_title)
        {
            editors.push(values[i]);
        }
        else if (role == coord_title)
        {
            coordinators.push(values[i]);
        }
    }
    var spreadsheet = SpreadsheetApp.openById(activity_list_id);
    if (writers.length > 0)
    {
        addActivity(writers, spreadsheet.getSheetByName(al_writers));
    }
    if (editors.length > 0)
    {
        addActivity(editors, spreadsheet.getSheetByName(al_editors));
    }
    if (coordinators.length > 0)
    {
        addActivity(coordinators, spreadsheet.getSheetByName(al_coordinators));
    }
}

/**
 * Adds rows to a sheet in the activity list.
 *
 * @param values  the rows to add (from the updater).
 * @param sheet   the sheet to add to.
 */
function addActivity(values, sheet)
{
    var last_row = sheet.getLastRow();
    sheet.insertRowsAfter(last_row, values.length);
    var dates = [];
    var formulas = [];
    for (i = 0; i < values.length; i++)
    {
        dates.push([values[i][app_col - 1]]);
        formulas.push([getHyperlinkFunction(values[i][id_col - 1])]);
    }
    sheet.getRange("A" + (last_row + 1) + ":A" + (last_row + values.length))
        .setFormulas(formulas);
    SpreadsheetApp.flush();
    sheet.getRange("B" + (last_row + 1) + ":B" + (last_row + values.length))
        .setValues(dates);
    SpreadsheetApp.flush();
    sheet.getRange("A2:E" + sheet.getLastRow()).sort(1);
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
