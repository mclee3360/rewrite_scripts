/**
 * Gets the number of synopses written by the writer that are in the tracker's
 * archive.
 *
 * @param name_cell1  the writer's current username.
 * @param name_cell2  a string of a list of the writer's former usernames (if
 *                    any), separated by a comma and space.
 * @return the number synopses written by the writer that are in the archive.
 */
function getNumWritten(name_cell1, name_cell2)
{
    var usernames = getUsernames(name_cell1, name_cell2);
    var archive = getArchiveRange();
    // Count number of synopses by user.
    var count = 0;
    for (i = 0; i < archive.length; i++)
    {
        for (j = 0; j < usernames.length; j++)
        {
            var checkWriter = ' ' + archive[i][writer - 1].toLowerCase() + ' ';
            if (checkWriter.indexOf(' ' + usernames[j] + ' ') >= 0)
            {
                count++;
            }
        }
    }
    return count;
}

/**
 * Gets the last date of activity by the writer on the tracker. Gets the latest
 * date of synopsis claimed on either the In Progress or Archive sheets of the
 * tracker.
 *
 * @param name_cell1  the writer's current username.
 * @param name_cell2  a string of a list of the writer's former usernames (if
 *                    any), separated by a comma and space.
 * @return the date of last activity.
 */
function getActivityWriter(name_cell1, name_cell2)
{
    var usernames = getUsernames(name_cell1, name_cell2);
    // Parse 'In Progress' sheet
    var inProgress = getIPRange();
    var activeDate = parseWrittenActivity("N/A", usernames, inProgress);
    // Parse 'Archive' sheet
    var archive = getArchiveRange();
    return parseWrittenActivity(activeDate, usernames, archive);
}

/**
 * Parses a given range for the latest date of a synopsis claimed by the writer.
 *
 * @param date       the latest date of activity found previously for the
 *                   writer.
 * @param usernames  an array containing all of the writer's former and current
 *                   usernames.
 * @param range      the range to parse. Columns should be in same order as
 *                   tracker.
 * @return the date of latest activity in the parsed range, or the given date
 *         of last activity if none in the parsed range are after the given
 *         date.
 */
function parseWrittenActivity(date, usernames, range)
{
    var activeDate = date;
    for (i = 0; i < range.length; i++)
    {
        for (j = 0; j < usernames.length; j++)
        {
            var checkWriter = ' ' + range[i][writer - 1].toLowerCase() + ' ';
            if (checkWriter.indexOf(' ' + usernames[j] + ' ') >= 0)
            {
                var checkDate = range[i][wDate - 1];
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
    return activeDate;
}
