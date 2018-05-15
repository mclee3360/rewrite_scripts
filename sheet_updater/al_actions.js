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
