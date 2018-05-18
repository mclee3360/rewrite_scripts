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
        functionName : "updateRole"
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
    if (doesExist(id))
    {
        SpreadsheetApp.getUi().alert("User with ID " + id + " already exists");
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
    var old_email = getUserEmail(user);
    if (!updateDatabaseEmail(user, email))
    {
        var error_msg = "Could not find " + user + " to " + "update email.";
        SpreadsheetApp.getUi().alert(error_msg);
        return;
    }
    var role = getUserRole(user);
    switch (role)
    {
        case writer_title:
            removeWriterPerm(old_email);
            addWriterPerm(email);
            break;
        case editor_title:
            removeEditorPerm(old_email);
            addEditorPerm(email);
            break;
        case coord_title:
            removeCoordinatorPerm(old_email);
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

/**
 * Updates a user's role, updating their permissions as well. One at a time.
 */
function updateRole()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(up_role);
    var lastRow = sheet.getLastRow();
    if (lastRow == 1)
    {
        SpreadsheetApp.getUi().alert("No roles listed to update");
        return;
    }
    var range = sheet.getRange(2, 1, 1, sheet.getLastColumn());
    var values = range.getValues()[0];
    for (i = 0; i < values.length; i++)
    {
        if (values[i] == "")
        {
            SpreadsheetApp.getUi().alert("All fields must be filled to update role");
            return;
        }
    }
    var user = values[user_col - 1];
    var old_role = values[old_role_col - 1];
    var new_role = values[new_role_col - 1];
    if (old_role == new_role)
    {
        SpreadsheetApp.getUi().alert("New role cannot be the same as old role.");
        return;
    }
    var current_role = getUserRole(user);
    if (current_role == null)
    {
        var error_msg = "Could not find " + user + " in database to update"
            + " role. Did not update in Activity List.";
        SpreadsheetApp.getUi().alert(error_msg);
        return;
    }
    if (old_role != current_role)
    {
        old_role = current_role;
    }
    updateDatabaseRole(user, new_role);
    updateActivityRole(user, old_role, new_role);
    var email = getUserEmail(user);
    switch (old_role)
    {
        case writer_title:
            removeWriterPerm(email);
            break;
        case editor_title:
            removeEditorPerm(email);
            break;
        case coord_title:
            removeCoordinatorPerm(email);
            break;
        default:
            break;
    }
    switch (new_role)
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
    var msg = "Successfully updated role for " + user + " to " + new_role + ".";
    SpreadsheetApp.getUi().alert(msg);
}
