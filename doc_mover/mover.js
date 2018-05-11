/**
 * Scans the last few rows in the Tracker's archive, moving documents from the
 * "Synopses (Ongoing)" folder to the "Synopses (Finished)" folder if the
 * row had not already been previously checked.
 *
 * On hold entries are not moved until they are no longer on hold.
 *
 * If a document cannot be found in the ongoing folder, then an error message
 * is sent to the reporting email (see Constants).
 */
function trigger()
{
    var sheet = getArchive();
    var archive = sheet.getRange(sheet.getLastRow() - range + 1, 1, range, checked_col)
        .getValues();
    var urls = linkURL(sheet.getRange(sheet.getLastRow() - range + 1, link_col, range, 1));

    var status = [];
    var tocheck = [];
    var onhold = [];
    var missing = [];

    for (i = 0; i < range; i++)
    {
        var state = archive[i][checked_col - 1];
        status.push([state]);
        if (state != checked)
        {
            var hold_status = archive[i][upload_col - 1];
            if (hold_status == hold_text)
            {
                onhold.push(i);
            }
            else
            {
                if (archive[i][entry_col - 1] != '')
                {
                    tocheck.push(i);
                    status[status.length - 1] = [checked];
                }
            }
        }
    }

    for (i = 0; i < tocheck.length; i++)
    {
        var id = getId(urls[tocheck[i]][0]);
        if (!moveDocument(id))
        {
            missing.push(archive[tocheck[i]][entry_col - 1]);
        }
    }
    updateTracker(status);
    if (missing.length > 0)
    {
        sendErrorMessage(missing);
    }
}

/**
 * Returns the URL of a hyperlinked cell, if it's entered with hyperlink command.
 * Supports ranges
 *
 * @param extract_range  the range of cells containing the hyperlinks.
 */
function linkURL(extract_range) {
  var formulas = extract_range.getFormulas();
  var output = [];
  for (var i = 0; i < formulas.length; i++) {
    var row = [];
    for (var j = 0; j < formulas[0].length; j++) {
      var url = formulas[i][j].match(/=hyperlink\("([^"]+)"/i);
      row.push(url ? url[1] : '');
    }
    output.push(row);
  }
  return output
}

/**
 * Gets the Google Drive file ID of a file from its URL.
 *
 * @param url  the URL from which to extract the ID.
 * @return the file ID.
 */
function getId(url)
{
    if (url.indexOf(doc_url) > -1)
    {
        return url.split(doc_id_prefix)[1].split(doc_id_suffix)[0];
    }
    else if (url.indexOf(drive_url) > -1)
    {
        return url.split(drive_id_prefix)[1];
    }
    return "";
}

/**
 * Moves a document from the "Synopses (Ongoing)" folder to the
 * "Synopses (Finished)" folder.
 *
 * @param id  the file ID
 * @return true if the document was successfully added to finished folder,
 *         false if not.
 */
function moveDocument(id)
{
    try
    {
        var file = DriveApp.getFileById(id);
        getFinishedFolder().addFile(file);
        getProgressFolder().removeFile(file);
        return true;
    }
    catch (e)
    {
        return false;
    }
}

/**
 * Updates the "Checked" column of the tracker with the updated values.
 *
 * @param values  an array of the updated values.
 */
function updateTracker(values)
{
    var sheet = getArchive();
    var toUpdate = sheet.getRange(sheet.getLastRow() - range + 1, checked_col, range, 1);
    toUpdate.setValues(values);
}

/**
 * Sends an email to the reporting email (see Constants) with a list of
 * documents that the script was unable to find in the ongoing folder when
 * attempting to move them to the finished folder.
 *
 * @param names  the list of document names of documents unable to be found.
 */
function sendErrorMessage(names)
{
    var subject = msg_subject + getToday();
    var msg = error_msg;
    for (i = 0; i < names.length; i++)
    {
        msg += '\t' + names[i] + '\n';
    }
    MailApp.sendEmail(report_email, subject, msg);
}

/**
 * Gets the Archive sheet in the Synopses Tracker.
 *
 * @return the Archive sheet.
 */
function getArchive()
{
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(archive_name);
}

/**
 * Gets the "Synopses (Ongoing)" folder.
 *
 * @return the folder.
 */
function getProgressFolder()
{
    return DriveApp.getFolderById(progress_id);
}

/**
 * Gets the "Synopses (Finished)" folder.
 *
 * @return the folder.
 */
function getFinishedFolder()
{
    return DriveApp.getFolderById(finished_id);
}

/**
 * Gets a string of the current day, month, and year as YYYY-MM-DD.
 *
 * @return a string of the current date.
 */
function getToday()
{
    var date = new Date();
    var day = date.getDate().toString();
    if (day.length == 1)
    {
        day = '0' + day;
    }
    var mon = (date.getMonth() + 1).toString();
    if (mon.length == 1)
    {
        mon = '0' + mon;
    }
    var year = date.getFullYear().toString();
    return year + '-' + mon + '-' + day;
}
