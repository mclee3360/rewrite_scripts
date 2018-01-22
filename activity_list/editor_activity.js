/**
 * Gets the number of phase one edits the editor has completed that are in the
 * tracker's archive.
 *
 * @param name_cell1  the editor's current username.
 * @param name_cell2  a string of a list of the editor's former usernames (if
 *                    any), separated by a comma and space.
 * @return the number of phase one edits the editor has in the archive.
 */
function getNumPhaseOne(name_cell1, name_cell2)
{
    return getNumEdits(getUsernames(name_cell1, name_cell2), 1);
}

/**
 * Gets the number of phase two edits the editor has completed that are in the
 * tracker's archive.
 *
 * @param name_cell1  the editor's current username.
 * @param name_cell2  a string of a list of the editor's former usernames (if
 *                    any), separated by a comma and space.
 * @return the number of phase two edits the editor has in the archive.
 */
function getNumPhaseTwo(name_cell1, name_cell2)
{
    return getNumEdits(getUsernames(name_cell1, name_cell2), 2);
}

/**
 * Gets the number of edits the editor has completed for a specific phase that
 * are listed in the archive of the tracker.
 *
 * @param usernames  an array containing all of the editor's former and current
 *                   usernames.
 * @param phase      the phase number being searched for. Should be 1 or 2.
 * @param return     the number of edits in the archive for the given phase.
 *                   Returns -1 if an invalid phase was given.
 */
function getNumEdits(usernames, phase)
{
    var col = 0;
    if (phase == 1)
    {
        col = p1Editor;
    }
    else if (phase == 2)
    {
        col = p2Editor;
    }
    else
    {
        return -1;
    }
    var archive = getArchiveRange();
    // Count number of synopses by user.
    var count = 0;
    for (i = 0; i < archive.length; i++)
    {
        for (j = 0; j < usernames.length; j++)
        {
            var checkEditor = ' ' + archive[i][col - 1].toLowerCase() + ' ';
            if (checkEditor.indexOf(' ' + usernames[j] + ' ') >= 0)
            {
                count++;
            }
        }
    }
    return count;
}

/**
 * Gets the last date of activity by the editor on the tracker. Gets the latest
 * date from between synopses claimed, phase 1 edits, or phase 2 edits, on
 * either the In Progress or Archive sheets of the tracker.
 *
 * @param name_cell1  the editor's current username.
 * @param name_cell2  a string of a list of the editor's former usernames (if
 *                    any), separated by a comma and space.
 * @return the date of last activity.
 */
function getActivityEditor(name_cell1, name_cell2)
{
    var usernames = getUsernames(name_cell1, name_cell2);
    // Parse 'In Progress' sheet
    var inProgress = getIPRange();
    var activeDate = parseEditorActivity("N/A", usernames, inProgress);
    // Parse 'Archive' sheet
    var archive = getArchiveRange();
    return parseEditorActivity(activeDate, usernames, archive);
}

/**
 * Parses a given range for the latest date of activity by the editor, whether
 * synopsis claim, phase 1 edit, or phase 2 edit.
 *
 * @param date       the latest date of activity found previously for the
 *                   editor.
 * @param usernames  an array containing all of the editor's former and current
 *                   usernames.
 * @param range      the range to parse. Columns should be in same order as
 *                   tracker.
 * @return the date of latest activity in the parsed range, or the given date
 *         of last activity if none in the parsed range are after the given
 *         date.
 */
function parseEditorActivity(date, usernames, range)
{
    var activeDate = date;
    for (i = 0; i < range.length; i++)
    {
        for (k = 0; k < cols.length; k++)
        {
            for (j = 0; j < usernames.length; j++)
            {
                var checkWriter = ' ' + range[i][cols[k][1] - 1].toLowerCase() + ' ';
                if (checkWriter.indexOf(' ' + usernames[j] + ' ') >= 0)
                {
                    var checkDate = range[i][cols[k][0] - 1];
                    if (checkDate instanceof Date)
                    {
                        if (activeDate == 'N/A')
                        {
                            activeDate = checkDate;
                        }
                        else
                        {
                            if (activeDate < checkDate)
                            {
                                activeDate = checkDate;
                            }
                        }
                    }
                }
            }
        }
    }
    return activeDate;
}
