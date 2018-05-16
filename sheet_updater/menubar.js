/**
 * Creates menu bar options for actions.
 */
function onOpen()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var menus = [{
        name : "Add Members",
        functionName : "addMember"
    }, {
        name : "Update Username",
        functionName : "updateNames"
    }, {
        name : "Update Email",
        functionName : "updateEmail"
    }, {
        name : "Update ID",
        functionName : "updateID"
    }, {
        name : "Change Role",
        functionName : "changeRoles"
    }, null, {
        name : "Update Writer App IDs",
        functionName : "updateAppIds"
    }];
    sheet.addMenu("Actions", menus);
}

/**
 * Adds a new member(s) to the database (sheet) of Rewrite members, as well
 * as creates a spot for them on the activity list.
 */
function addMember()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(up_new);
    var lastRow = sheet.getLastRow();
    if (lastRow == 1)
    {
        SpreadsheetApp.getUi().alert("No new members listed to add");
        return;
    }
    var range = sheet.getRange(2, 1, 1, sheet.getLastColumn());
    var values = range.getValues()[0];
    for (i = 0; i < values.length; i++)
    {
        if (values[i] == "")
        {
            SpreadsheetApp.getUi().alert("All fields must be filled to add members");
            return;
        }
    }
    var user = values[name_col - 1];
    var role = values[role_col - 1];
    var id = values[id_col - 1];
    var email = values[email_col - 1];
    var appDate = values[app_col - 1];
    if (doesExist(user))
    {
        SpreadsheetApp.getUi().alert("User " + user + " already exists");
        return;
    }
    addToDatabase(user, id, role, email);
    addToActivityList(id, role, appDate);
    switch (role)
    {
        case writer_title:
            addWriterPerm(email);
            break;
        case editor_title:
            addEditorPerm(email);
            break;
        case coord_title:
            addCoordinatorPerm(email);
            break;
        default:
            break;
    }
    if (lastRow == 2)
    {
        sheet.insertRowsAfter(lastRow, 1);
    }
    sheet.deleteRow(2);
    SpreadsheetApp.getUi().alert("Successfully added " + user + " as a new member");
}

/**
 * Updates a member's username in the database and tracker. Only one at a time.
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

/**
 * Updates a user's email. Only one at a time.
 */
function updateEmail()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(up_email);
    var lastRow = sheet.getLastRow();
    if (lastRow == 1)
    {
        SpreadsheetApp.getUi().alert("No emails listed to update");
        return;
    }
    var range = sheet.getRange(2, 1, 1, sheet.getLastColumn());
    var values = range.getValues()[0];
    for (i = 0; i < values.length; i++)
    {
        if (values[i] == "")
        {
            SpreadsheetApp.getUi().alert("All fields must be filled to update email");
            return;
        }
    }
    var user = values[user_col - 1];
    var email = values[new_info_col - 1];
    if (!updateDatabaseEmail(user, email))
    {
        var error_msg = "Could not find " + user + " to " + "update email.";
        SpreadsheetApp.getUi().alert(error_msg);
        return;
    }
    if (lastRow == 2)
    {
        sheet.insertRowsAfter(lastRow, 1);
    }
    sheet.deleteRow(2);
    var msg = "Successfully updated email for " + user + " to " + email + ".";
    SpreadsheetApp.getUi().alert(msg);
}

/**
 * Updates a user's ID. Only one at a time.
 */
function updateID()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(up_id);
    var lastRow = sheet.getLastRow();
    if (lastRow == 1)
    {
        SpreadsheetApp.getUi().alert("No IDs listed to update");
        return;
    }
    var range = sheet.getRange(2, 1, 1, sheet.getLastColumn());
    var values = range.getValues()[0];
    for (i = 0; i < values.length; i++)
    {
        if (values[i] == "")
        {
            SpreadsheetApp.getUi().alert("All fields must be filled to update ID");
            return;
        }
    }
    var user = values[user_col - 1];
    var id = values[new_info_col - 1];
    var role = getUserRole(user, id);
    if (role == null)
    {
        var error_msg = "Could not find " + user + " to " + "update ID.";
        SpreadsheetApp.getUi().alert(error_msg);
        return;
    }
    if (!updateActivityId(user, id, role))
    {
        var error_msg = "Could not find " + user + " in Activity List to update"
            + " ID. Did not update in database.";
        SpreadsheetApp.getUi().alert(error_msg);
        return;
    }
    updateDatabaseId(user, id);
    if (lastRow == 2)
    {
        sheet.insertRowsAfter(lastRow, 1);
    }
    sheet.deleteRow(2);
    var msg = "Successfully updated ID for " + user + " to " + id + ".";
    SpreadsheetApp.getUi().alert(msg);
}
