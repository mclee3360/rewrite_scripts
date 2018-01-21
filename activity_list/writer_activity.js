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
