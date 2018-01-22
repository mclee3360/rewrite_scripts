function getAppDate(name_cell1, name_cell2, year)
{
    var usernames = getUsernames(name_cell1, name_cell2);
    var apps = getAppSheet(year);
    if (apps.length == 1)
    {
        return "Cannot Find App Sheet for Given Year";
    }
    for (i = 0; i < apps.length; i++)
    {
        for (j = 0; j < usernames.length; j++)
        {
            var checkUser = ' ' + apps[i][applicant - 1].toLowerCase() + ' ';
            if (checkUser.indexOf(' ' + usernames[j] + ' ') >= 0)
            {
                return apps[i][appDate - 1];
            }
        }
    }
    return "Cannot Find App";
}

function getAppSheet(year)
{
    if (year == 2018)
    {
        return getAppsRange2018();
    }
    return [0];
}
