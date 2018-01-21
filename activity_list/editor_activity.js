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
