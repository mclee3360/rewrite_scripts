// The email to send the reports to.
var report_email = 'mlee3360@gmail.com';

/**
 * Initializes the script properties to the values inside the function. Use only
 * if there was an error searching for the last checked row in the archive. Set
 * row_num with the correct row number and row_entry with the title of the series.
 * Run directly in the script IDE on the sheet.
 */
function initProperties()
{
    var row_num_key = 'Row Number';
    var row_num = 'ENTER_ROW_NUMBER_HERE';
    var row_entry_key = 'Row Entry';
    var row_entry = 'ENTER_SERIES_TITLE_HERE';

    var properties = PropertiesService.getScriptProperties();
    properties.setProperty(row_num_key, row_num);
    properties.setProperty(row_entry_key, row_entry);
}

/**
 * The trigger action to be performed that checks the archive and moves documents.
 *
 * If unable to find the last-checked entry as saved in the script properties from
 * the previous session, sends an error report to the report email.
 *
 * If no rows were checked because no new rows were added since the last check,
 * sends a report email detailing that that's what happened.
 *
 * If there have been rows added, looks at each row. If that entry is on hold,
 * it does nothing and notes it down in the report email.
 * It searches for the documents using the series title and writer name in the
 * tracker, searching for TITLE (AUTHOR). If it cannot find the document using
 * that name, it notes as such in the report email, and the document must be
 * found and moved manually. If the document is found, it will move it from the
 * "Ongoing" folder into the "Finished" folder and note in the report email that
 * it was successfully transferred.
 */
function trigger()
{
    var row_num_key = 'Row Number';
    var row_entry_key = 'Row Entry';
    var start_row = confirmStartRow(row_num_key, row_entry_key);
    // Could not find the last-checked entry.
    if (start_row == 0)
    {
        var row_num = PropertiesService.getScriptProperties().getProperty(row_num_key);
        var entry = PropertiesService.getScriptProperties().getProperty(row_entry_key);
        var message = 'The script was unable to find the last checked entry. '
            + 'Please check the tracker and reinitialize the last checked entry '
            + 'with the correct row number.\n\n'
            + 'Row Number Checked: ' + row_num + '\n'
            + 'Entry Checked for: ' + entry;
        sendMeMail(message, 'Error in Synopsis Document Transfer: ' + getToday());
        return;
    }
    var num_rows = getArchive().getLastRow();
    // No new rows have been added to the archive since the last check.
    if (num_rows < start_row)
    {
        var row_num = PropertiesService.getScriptProperties().getProperty(row_num_key);
        var entry = PropertiesService.getScriptProperties().getProperty(row_entry_key);
        var message = 'No new rows have been added to the archive since the last '
            + 'check. No documents were moved.\n\n'
            + 'Row Number Checked: ' + row_num + '\n'
            + 'Entry Checked for: ' + entry;
        sendMeDefMail(message);
        return;
    }

    var range = num_rows - start_row + 1; // The number of rows to check.
    var entry_col = 2;   // Column number for the entry title.
    var writer_col = 4;  // Column number for the writer.
    var upload_col = 11; // Column number for the date uploaded.
    var rows = getArchive().getRange(start_row, 1, range, upload_col).getValues();
    // Arrays to store what action was taken for each entry for the email report.
    // Should be a 2D array with each row being [rownum, entry_name].
    var moved = [];
    var onhold = [];
    var missing = [];

    for (i = 0; i < range; i++)
    {
        var entry_name = rows[i][entry_col - 1];
        var writer = rows[i][writer_col - 1];
        var docname = entry_name + ' (' + writer + ')';
        // If the synopsis is on hold, don't move. Just alert in email.
        if (rows[i][upload_col - 1] == 'on-hold')
        {
            onhold.push([(start_row + i).toString(), docname]);
        }
        else
        {
            var search = getIPSearch(docname);
            // If the document cannot be found in the ongoing synopses folder,
            // just record info and move to next row.
            if (!search.hasNext())
            {
                missing.push([(start_row + i).toString(), docname]);
            }
            else
            {
                moved.push([(start_row + i).toString(), docname]);
                // Move file to Finished Synopses folder
                var file = search.next();
                getFinishedFolder().addFile(file);
                getIPFolder().removeFile(file);
            }
        }
        // Set the last checked row in the script properties to the new values.
        if (i == range - 1)
        {
            PropertiesService.getScriptProperties().setProperty(
                row_num_key, (start_row + i).toString()
            );
            PropertiesService.getScriptProperties().setProperty(
                row_entry_key, entry_name
            );
        }
    }
    // Construct email report message.
    // Only add if there were entries transferred.
    var moved_list = '';
    if (moved.length > 0)
    {
        moved_list = 'The following entries were successfully transferred from '
            + 'the "Ongoing" folder to the "Finished" folder: \n';
        for (i = 0; i < moved.length; i++)
        {
            var listing = '\tRow ' + moved[i][0] + ', "' + moved[i][1] + '"\n';
            moved_list += listing;
        }
        moved_list += '\n';
    }
    // Only add if there were entries missing.
    var miss_list = '';
    if (missing.length > 0)
    {
        miss_list = 'The following entries were unable to be found in the '
            + '"Ongoing" folder. A likely cause is that the document name did '
            + 'not match the format of TITLE (AUTHOR). Please double check that '
            + 'the document exists and manually move it to the "Finished" folder. '
            + 'The affected entries are as follows: \n';
        for (i = 0; i < missing.length; i++)
        {
            var listing = '\tRow ' + missing[i][0] + ', "' + missing[i][1] + '"\n';
            miss_list += listing;
        }
        miss_list += '\n';
    }
    // Only add if there were entries on hold.
    var hold_list = '';
    if (onhold.length > 0)
    {
        hold_list = 'The following entries are currently on hold so were left '
            + 'untouched. Please manually move the documents to the "Finished" '
            + 'folder after they are no longer on hold. The affected entries are '
            + 'as follows: \n';
        for (i = 0; i < onhold.length; i++)
        {
            var listing = '\tRow ' + onhold[i][0] + ', "' + onhold[i][1] + '"\n';
            hold_list += listing;
        }
        hold_list += '\n';
    }
    // Where check started and ended for reference of future checks.
    var init_entry = 'Search began on Row ' + start_row + ', "'
        + rows[0][entry_col - 1] + '".\n'
        + 'Last checked entry was Row '
        + PropertiesService.getScriptProperties().getProperty(row_num_key)
        + ', "' + PropertiesService.getScriptProperties().getProperty(row_entry_key)
        + '".\n\n';
    sendMeDefMail(init_entry + moved_list + miss_list + hold_list);
}

/**
 * Makes sure that the row number of the last-checked row in the most recent
 * trigger is still in the same row number by cross-checking with the entry's
 * title. If not, searches the 5 rows before and 5 rows after to look for it.
 *
 * @param row_num_key    the key value of the script property that contains the
 *                       last checked row number.
 * @param row_entry_key  the key value of the script property that contains the
 *                       title of the entry on the last checked row.
 * @return  the correct last-checked row + 1 (the row to begin the new check).
 *          Returns 0 if the entry cannot be found.
 */
function confirmStartRow(row_num_key, row_entry_key)
{
    var title_col = 2; // Column number of the entry title.
    var buffer = 5; // The search buffer in case the row was moved.
    var range = (buffer * 2) + 1 // The number of rows to grab for the buffer.

    var row_num = parseInt(PropertiesService.getScriptProperties().getProperty(row_num_key));
    var entry = PropertiesService.getScriptProperties().getProperty(row_entry_key);
    var entries = getArchive().getRange(row_num - buffer, title_col, range, 1)
        .getValues();

    if (entries[buffer][0] == entry) // Last-checked entry still on same row.
    {
        return row_num + 1; // New row number for the trigger to begin on.
    }
    else // Last-checked entry has moved to a different row.
    {
        for (i = 0; i < range; i++)
        {
            if (entries[i][0] == entry)
            {
                PropertiesService.getScriptProperties().setProperty(
                    row_num_key,
                    (row_num + (i - buffer)).toString()
                )
                return row_num + (i - buffer) + 1;
            }
        }
        return 0; // Search failed. Use for error reporting.
    }
}

/**
 * Sends email to the report address with a given message and default subject.
 *
 * @param message  the body of the email.
 */
function sendMeDefMail(message)
{
    sendMeMail(message, 'Synopsis Document Transfer Report: ' + getToday());
}

/**
 * Sends email to the report address with a given message and subject line.
 *
 * @param message  the body of the email.
 * @param subject  the subject line of the email.
 */
function sendMeMail(message, subject)
{
    message = 'Synopsis Document Transfer Report: ' + getToday() + '\n\n' + message;
    MailApp.sendEmail(report_email, subject, message);
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

/**
 * Gets the 'Archive' sheet in the Synopses Tracker.
 *
 * @return  the 'Archive' sheet.
 */
function getArchive()
{
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Archive');
}

/**
 * Gets the folder with the synopses in progress.
 *
 * @return  the folder containing the ongoing synopses.
 */
function getIPFolder()
{
    var root = DriveApp.getRootFolder();
    var rewrite = root.getFoldersByName('MAL Rewrite Docs').next();
    return rewrite.getFoldersByName('Synopses (Ongoing)').next();
}

/**
 * Gets the file iterator with the results of searching the ongoing synopses
 * folder for the given document name.
 *
 * @param docname  the name of the document to search for.
 * @return  the FileIterator with the results of the search.
 */
function getIPSearch(docname)
{
    return getIPFolder().getFilesByName(docname)
}

/**
 * Gets the folder with the finished synopses.
 *
 * @return  the folder containing the finished synopses.
 */
function getFinishedFolder()
{
    var root = DriveApp.getRootFolder();
    var rewrite = root.getFoldersByName('MAL Rewrite Docs').next();
    return rewrite.getFoldersByName('Synopses (Finished)').next();
}

/**
 * Gets the file iterator with the results of searching the finished synopses
 * folder for the given document name.
 *
 * @param docname  the name of the document to search for.
 * @return  the FileIterator with the results of the search.
 */
function getFinishedSearch(docname)
{
    return getFinishedFolder().getFilesByName(docname)
}
