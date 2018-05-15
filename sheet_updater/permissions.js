// Folder ID's for sharing permissions
var rewrite_docs_id = "0B5MIJmkWz2mFfmJ2aFMxcXQxTERmSWFXRl9sYURQT3VfeS05WVZBZExPdTY2WlEyRUgtNTg";
var ongoing_id = "0B5MIJmkWz2mFfmFnTmMtUWJUVGRBdUdMaXh4bjBJQXZ2U1ZUMUhzYlFucnY4amRRaTdESWc";
var finished_id = "0B5MIJmkWz2mFflllWEg3ck5TS3pNYmgwZGtudFJ0dXJGWDc5RGJPTWVTTE5EVWJhaG9oZHM";
var coord_folder_id = "0B5MIJmkWz2mFfk4tWFAwVnFxTUY1WmFVMFdHanJvMm03cHZwNWpqdFJVdmxEajhNZUtLc1U";
// Range of URL's for Writer Apps
var app_url_sheet = "App Folder ID";
var app_url_range = "B2:B3";
var folder_index = 0;
var sheet_index = 1;
// Key for saving all ID's
var id_key = "URLS";
// ID Prefix
var id_prefix = "open?id=";

/**
 * Gives Google Drive permissions to the documents/folder of a writer.
 *
 * @param email  the email to give permissions to.
 */
function addWriterPerm(email)
{
    DriveApp.getFolderById(rewrite_docs_id).addViewer(email);
    DriveApp.getFolderById(ongoing_id).addEditor(email);
    DriveApp.getFolderById(finished_id).addEditor(email);
    DriveApp.getFileById(tracker_id).addEditor(email);
}

/**
 * Removes Google Drive permissions from the documents/folder of a writer.
 *
 * @param email  the email to remove permissions from.
 */
function removeWriterPerm(email)
{
    DriveApp.getFolderById(rewrite_docs_id).removeViewer(email);
    DriveApp.getFolderById(ongoing_id).removeEditor(email);
    DriveApp.getFolderById(finished_id).removeEditor(email);
    DriveApp.getFileById(tracker_id).removeEditor(email);
}

/**
 * Gives Google Drive permissions to the documents/folder of an editor.
 *
 * @param email  the email to give permissions to.
 */
function addEditorPerm(email)
{
    addWriterPerm(email);
    var all_ids = getAppIds();
    var app_ids = all_ids[all_ids.length - 1];
    DriveApp.getFolderById(app_ids[folder_index]).addViewer(email);
    DriveApp.getFileById(app_ids[sheet_index]).addEditor(email);
}

/**
 * Removes Google Drive permissions from the documents/folder of an editor.
 *
 * @param email  the email to remove permissions from.
 */
function removeEditorPerm(email)
{
    removeWriterPerm(email); // could be inefficient, but needs to be done just in case.
    // Loop through all app folders/id years and remove permissions.
    var app_ids = getAppIds();
    for (var i = 0; i < app_ids.length; i++)
    {
        try
        {
            DriveApp.getFolderById(app_ids[i][folder_index]).removeViewer(email);
        }
        catch (e) { } // If they were never a viewer, no issues.
        try
        {
            DriveApp.getFileById(app_ids[i][sheet_index]).removeEditor(email);
        }
        catch (e) { } // If they were never an editor, no issues.
    }
}

/**
 * Gives Google Drive permissions to the documents/folder of a coordinator.
 *
 * @param email  the email to give permissions to.
 */
function addCoordinatorPerm(email)
{
    DriveApp.getFolderById(rewrite_docs_id).addEditor(email);
    DriveApp.getFolderById(coord_folder_id).addEditor(email);
}

/**
 * Removes Google Drive permissions from the documents/folder of a coordinator.
 *
 * @param email  the email to remove permissions from.
 */
function removeCoordinatorPerm(email)
{
    DriveApp.getFolderById(rewrite_docs_id).removeEditor(email);
    DriveApp.getFolderById(coord_folder_id).removeEditor(email);
}

function updateAppIds()
{
    var all_ids = getAppIds();
    var current = all_ids[all_ids.length - 1];
    var new_ids = getNewAppIds();
    if (current[folder_index] == new_ids[folder_index])
    {
        if (current[sheet_index] == new_ids[sheet_index])
        {
            // If both folder and sheet URL are the same
            SpreadsheetApp.getUi().alert("The folder and sheet given are "
                + "already the most current saved.");
            return;
        }
        // If folder URL is the same, but sheet has changed, updated the sheet only.
        all_ids[all_ids.length - 1] = new_ids;
    }
    else
    {
        // If neither are the same, then add to list.
        all_ids.push(new_ids);
    }
    PropertiesService.getScriptProperties().setProperty(id_key, JSON.stringify(all_ids));
    SpreadsheetApp.getUi().alert("The App Folder and Sheet IDs were successfully updated");
}

function getAppIds()
{
    return JSON.parse(PropertiesService.getScriptProperties().getProperty(id_key));
}

function getNewAppIds()
{
    var values = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName(app_url_sheet).getRange(app_url_range).getValues();
    var folder_id = values[folder_index][0].split(id_prefix)[1];
    var sheet_id = values[sheet_index][0].split(id_prefix)[1]
    return [folder_id, sheet_id];
}
