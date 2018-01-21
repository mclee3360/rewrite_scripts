function getNumWritten(refresher, username)
{
    // All user names to search for.
    var usernames = Array.prototype.slice.call(arguments, 1, arguments.length);
    var archive = getArchiveRange();
    // Count number of synopses by user.
    var count = 0;
    for (i = 0; i < archive.length; i++)
    {
        for (j = 0; j < usernames.length; j++)
        {
            var checkWriter = ' ' + archive[i][writer - 1] + ' ';
            if (checkWriter.indexOf(' ' + usernames[j] + ' ') >= 0)
            {
                count++;
            }
        }
    }
    return count;
}

function getActivityWriter(refresher, username)
{
    // All user names to search for.
    var usernames = Array.prototype.slice.call(arguments, 1, arguments.length);
    // Parse 'In Progress' sheet
    var inProgress = getIPRange();
    var activeDate = parseWrittenActivity("N/A", usernames, inProgress);
    // Parse 'Archive' sheet
    var archive = getArchiveRange();
    return parseWrittenActivity(activeDate, usernames, archive);
}

function parseWrittenActivity(date, usernames, range)
{
    var activeDate = date;
    for (i = 0; i < range.length; i++)
    {
        for (j = 0; j < usernames.length; j++)
        {
            var checkWriter = ' ' + range[i][writer - 1] + ' ';
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
