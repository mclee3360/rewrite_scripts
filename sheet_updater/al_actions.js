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
