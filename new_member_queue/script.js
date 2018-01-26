/**
 * On opening the spreadsheet, fills any empty rows on the first column of the
 * local copy of the tracker with the formatted writer username for searching.
 *
 * @param e  the event object.
 */
function onOpen(e)
{
    fillRows(local_archive_name);
    fillRows(local_progress_name);
}

/**
 * Scans the spreadsheet for any rows to move between sheets.
 */
function scanSheet()
{
    scanFinished(scanFirstTimers(scanNoneWritten()));
}

/**
 * Scans the "None Written" sheet to check for any rows to move to the "First
 * Timers" sheet.
 *
 * @return a 2D array, each element being a username array (specified in
 *         addUser()), or an empty 2D array if no rows need to be moved.
 */
function scanNoneWritten()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(none_name);
    return removeUsers(sheet, sheet.getLastColumn(), "Yes");
}

/**
 * Adds in rows for the users given, then scans the "First Timers" sheet to
 * check for any rows to move to the "Finished" sheet.
 *
 * @param new_names  a 2D array, with each element being a username array
 *                   (specified in addUser()).
 * @return a 2D array, each element being a username array (specified in
 *         addUser()), or an empty 2D array if no rows need to be moved.
 */
function scanFirstTimers(new_names)
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ongoing_name);
    if (new_names[0].length > 0)
    {
        addUsers(sheet, new_names, getPFormulas);
        sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn())
            .sort(5);
        SpreadsheetApp.flush();
    }
    return removeUsers(sheet, sheet.getLastColumn(), "Yes");
}

/**
 * Adds in rows for the users given on the "Finished" sheet.
 *
 * @param new_names  a 2D array, with each element being a username array
 *                   (specified in addUser()).
 */
function scanFinished(new_names)
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(finished_name);
    if (new_names[0].length > 0)
    {
        addUsers(sheet, new_names, getFFormulas);
        sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).sort(1);
        SpreadsheetApp.flush();
    }
}

/**
 * Adds rows for a list of given users on a specific sheet.
 *
 * @param sheet      the sheet to add the users to.
 * @param new_names  a 2D array, with each element being a username array.
 *                   A username array is as follows:
 *                   [Username, string containing list of former usernames
 *                    delimited by ', ', string containing list of all usernames
 *                    in lower case delimited by ' ' and surround by ' ']
 *                   eg. ["Glacialis", "Mimorin", " glacialis mimorin "]
 * @param form_func  a function with one parameter that returns an array of
 *                   the formulas needed to fill the columns beyond the
 *                   usernames for the given row.
 */
function addUsers(sheet, new_names, form_func)
{
    var last_row = sheet.getLastRow();
    var last_col = sheet.getLastColumn();
    var names = [];
    var formulas = [];
    for (i = 0; i < new_names.length; i++)
    {
        last_row++;
        names.push([new_names[i][0], new_names[i][1], new_names[i][2]]);
        formulas.push(form_func(last_row));
    }
    var start_row = sheet.getLastRow() + 1;
    sheet.insertRowsAfter(sheet.getLastRow(), new_names.length);
    var num_rows = last_row - start_row + 1;
    sheet.getRange(start_row, 1, num_rows, 3).setValues(names);
    sheet.getRange(start_row, 4, num_rows, last_col - 3).setFormulas(formulas);
    SpreadsheetApp.flush();
}

/**
 * Removes a row from a given sheet based on a given criteria.
 *
 * @param sheet     the sheet to check.
 * @param col       the column to check values against.
 * @param criteria  the value that, if the given column's value equals it, will
 *                  mark the row for removal.
 * @return a 2D array of username arrays for the row removed.
 */
function removeUsers(sheet, col, criteria)
{
    var last_row = sheet.getLastRow();
    var last_col = sheet.getLastColumn();
    var values = sheet.getRange(2, 1, last_row - 1, last_col).getValues();
    var toMove = [];
    var toDelete = [];
    for (i = 0; i < values.length; i++)
    {
        if (values[i][col - 1] == criteria)
        {
            toMove.push([values[i][0], values[i][1], values[i][2]]);
            toDelete.push(i + 2);
        }
    }
    for (i = 0; i < toDelete.length; i++)
    {
        sheet.deleteRow(toDelete[i]);
    }
    if (toMove.length == 0)
    {
        toMove.push([]);
    }
    return toMove;
}

/**
 * Fills the empty rows of the first column on the local copies of the tracker
 * with functions that format the usernames into lower case and surrounded by
 * a space (' ').
 *
 * @param sheet_name  the name of the sheet to fill.
 */
function fillRows(sheet_name)
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
    var range = sheet.getRange(1, 1, sheet.getLastRow());
    var formulas = range.getFormulas();
    var changed = false;
    for (i = 0; i < formulas.length; i++)
    {
        if (formulas[i][0] === "")
        {
            formulas[i][0] = "=CONCAT(\" \", CONCAT(LOWER(C" + (i + 1) + "), \" \"))"
            changed = true;
        }
    }
    if (changed)
    {
        range.setFormulas(formulas);
        SpreadsheetApp.flush();
    }
}
