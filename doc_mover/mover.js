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
        var row = archive[tocheck[i]];
        var entry_name = row[entry_col - 1];
        var writer = row[writer_col - 1];
        var docname = entry_name + ' (' + writer + ')';
        if (!moveDocument(docname))
        {
            missing.push(docname);
        }
    }
    updateTracker(status);
    if (missing.length > 0)
    {
        sendErrorMessage(missing);
    }
}

/**
 * Moves a document from the "Synopses (Ongoing)" folder to the
 * "Synopses (Finished)" folder.
 *
 * @param docname  the name of the document to move.
 * @return true if the document was found in the ongoing folder, false if not.
 */
function moveDocument(docname)
{
    var pFolder = getProgressFolder();
    var search = pFolder.getFilesByName(docname);
    if (search.hasNext())
    {
        var file = search.next();
        getFinishedFolder().addFile(file);
        getProgressFolder().removeFile(file);
        return true;
    }
    return false;
}

/**
 * Updates the "Checked" column of the tracker with the updated values.
 *
 * @param values  an array of the updated values.
 */
function updateTracker(values)
{
    var toUpdate = getArchive()
        .getRange(sheet.getLastRow() - range + 1, checked_col, range, 1);
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
