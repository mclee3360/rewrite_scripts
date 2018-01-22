/**
 * Gets the application date for the user.
 *
 * @param name_cell1  the user's current username.
 * @param name_cell2  a string of a list of the user's former usernames (if
 *                    any), separated by a comma and space.
 * @param year        the year the user submitted their application.
 * @return the date the user submitted their application as a date object.
 *         Returns a specific string detailing what went wrong if unable to be
 *         found.
 */
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

/**
 * Gets the range for the applications of the given year.
 *
 * @param year  the year to get applications from.
 * @return a range containing the data from the given year's applications.
 *         Returns an array with single element 0 if search was unsuccessful.
 */
function getAppSheet(year)
{
    if (year == 2018)
    {
        return getAppsRange2018();
    }
    return [0];
}
