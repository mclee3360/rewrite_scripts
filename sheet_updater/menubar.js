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

function addMembers()
{
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(up_new);
    var lastRow = sheet.getLastRow();
    if (lastRow == 1)
    {
        SpreadsheetApp.getUi().alert("No new members listed to add");
        return;
    }
    var range = sheet.getRange(2, 1, lastRow - 1, email_col);
    var values = range.getValues();
    var writers = [];
    var editors = [];
    var coordinators = [];
    for (i = 0; i < values.length; i++)
    {
        var username = values[i][name_col -1];
        var role = values[i][role_col - 1];
        if (role == writer_title)
        {
            writers.push([username, ""]);
        }
        else if (role == editor_title)
        {
            editors.push([username, ""]);
        }
        else if (role == coord_title)
        {
            coordinators.push([username, ""]);
        }
    }
    var members = writers.concat(editors.concat(coordinators));
    sheet.insertRowAfter(lastRow);
    sheet.deleteRows(2, lastRow - 1);
    addToFolks(values);
    addToQueue(members);
    if (writers.length > 0)
    {
        addWriters(writers);
    }
    if (editors.length > 0)
    {
        addEditors(editors);
    }
    if (coordinators.length > 0)
    {
        addCoordinators(coordinators);
    }
    SpreadsheetApp.getUi().alert("Successfully added new members");
}
