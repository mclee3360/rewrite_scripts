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
    var range = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
    var values = range.getValues();
    for (i = 0; i < values.length; i++)
    {
        for (j = 0; j < values[i].length; j++)
        {
            if (values[i][j] == "")
            {
                SpreadsheetApp.getUi().alert("All fields must be filled to update usernames");
                return;
            }
        }
    }
    var errors = updateUsernames(values);
    if (errors.length > 0)
    {
        var error_msg = "Could not find the following users to update: "
        for (i = 0; i < errors.length; i++)
        {
            error_msg += ("\n - " + errors[i]);
        }
        SpreadsheetApp.getUi().alert(error_msg);
    }
    else
    {
        sheet.insertRowsAfter(lastRow, 1);
        sheet.deleteRows(2, lastRow -1);
        SpreadsheetApp.getUi().alert("Successfully updated all usernames");
    }
}
