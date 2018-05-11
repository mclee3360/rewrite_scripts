// Create trim function if it doesn't exist.
if ( typeof (String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

/**
 * Scours the tracker for all instances of the old username and replaces them
 * with the new one.
 *
 * @param old_name  the old username.
 * @param new_name  the new username.
 */
function updateTracker(old_name, new_name)
{
    var tracker = SpreadsheetApp.openById(tracker_id);
    updateTrackerSheet(tracker.getSheetByName(progress), 3, old_name, new_name);
    var archive_sheet = tracker.getSheetByName(archive)
    updateTrackerSheet(archive_sheet, 2, old_name, new_name);
    // Update Coordinator Column.
    var range = archive_sheet.getRange(2, coord_col, archive_sheet.getLastRow() - 1, 1);
    var values = range.getValues();
    for (i = 0; i < values.length; i++)
    {
        var name_list = values[i][0].split("/");
        var names = "";
        for (j = 0; j < name_list.length; j++)
        {
            if (checkNames(old_name, name_list[j]))
            {
                names += new_name;
            }
            else
            {
                names += name_list[j];
            }
            if (j != name_list.length - 1)
            {
                names += "/";
            }
        }
        values[i][0] = names;
    }
    range.setValues(values);
}

/**
 * Scours a sheet in the tracker for all instances of the old username and
 * replaces them with the new one.
 *
 * @param sheet      the sheet to check.
 * @param start_row  the row to begin checking from (to skip header rows).
 * @param old_name   the old username.
 * @param new_name   the new username.
 */
function updateTrackerSheet(sheet, start_row, old_name, new_name)
{
    var last_row = sheet.getLastRow();
    var range = sheet.getRange(start_row, writer_col, last_row - start_row + 1, 1);
    var values = range.getValues();
    for (i = 0; i < values.length; i++)
    {
        if (checkNames(old_name, values[i][0]))
        {
            values[i][0] = new_name;
        }
    }
    range.setValues(values);
    var num_col = e2_col - e1_col + 1;
    range = sheet.getRange(start_row, e1_col, last_row - start_row + 1, num_col);
    values = range.getValues();
    for (i = 0; i < values.length; i++)
    {
        if (checkNames(old_name, values[i][0]))
        {
            values[i][0] = new_name;
        }
        else if (checkNames(old_name, values[i][num_col - 1]))
        {
            values[i][num_col - 1] = new_name;
        }
    }
    range.setValues(values);
}

/**
 * Compares if two names are the same, ignoring whitespace and case insensitive.
 *
 * @param name1  the name to compare.
 * @param name2  the name to compare against.
 * @return if they are the same name.
 */
function checkNames(name1, name2)
{
    if (name1.trim().toLowerCase() == name2.trim().toLowerCase())
    {
        return true;
    }
    return false;
}
