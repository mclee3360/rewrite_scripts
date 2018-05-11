/**
 * Creates menu bar options for actions.
 */
function onOpen()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var menus = [{
        name: "Add Members",
        functionName : "addMembers"
    }, {
        name: "Update Usernames",
        functionName : "updateNames"
    }, {
        name: "Change Roles",
        functionName: "changeRoles"
    }];
    sheet.addMenu("Actions", menus);
}

/**
 * Adds a new member(s) to the database (sheet) of Rewrite members, as well
 * as creates a spot for them on the activity list.
 */
function addMembers()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(up_new);
    var lastRow = sheet.getLastRow();
    if (lastRow == 1)
    {
        SpreadsheetApp.getUi().alert("No new members listed to add");
        return;
    }
    var range = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
    var values = range.getValues();
    for (i = 0; i < values.length; i++)
    {
        for (j = 0; j < values[i].length; j++)
        {
            if (values[i][j] == "")
            {
                SpreadsheetApp.getUi().alert("All fields must be filled to add members");
                return;
            }
        }
    }
    addToDatabase(values);
    addToActivityList(values);
    sheet.insertRowsAfter(lastRow, 1);
    sheet.deleteRows(2, lastRow -1);
    SpreadsheetApp.getUi().alert("Successfully added new members");
}

/**
 * Updates members' usernames in the database.
 */
function updateNames()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(up_user);
    var lastRow = sheet.getLastRow();
    if (lastRow == 1)
    {
        SpreadsheetApp.getUi().alert("No usernames listed to update");
        return;
    }
    var range = sheet.getRange(2, 1, 1, sheet.getLastColumn());
    var values = range.getValues()[0];
    for (i = 0; i < values.length; i++)
    {
        if (values[i] == "")
        {
            SpreadsheetApp.getUi().alert("All fields must be filled to update usernames");
            return;
        }
    }
    var old_name = values[old_name_col - 1];
    var new_name = values[new_name_col - 1];
    if (!updateUsername(old_name, new_name))
    {
        var error_msg = "Could not find " + old_name + " to " + "update username.";
        SpreadsheetApp.getUi().alert(error_msg);
        return;
    }
    updateTracker(old_name, new_name);
    if (lastRow == 2)
    {
        sheet.insertRowsAfter(lastRow, 1);
    }
    sheet.deleteRow(2);
    var msg = "Successfully updated username for " + old_name + " to " + new_name + ".";
    SpreadsheetApp.getUi().alert(msg);
}
