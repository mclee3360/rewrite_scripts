/**
 * Gets an array of the formulas needed to fill the columns of the "First
 * Timers" sheet (P for in Progress).
 *
 * @param row  the row that needs to be filled.
 * @return the array of formulas.
 */
function getPFormulas(row)
{
    return [
        '=IFERROR(' + getQueryInProgress(row, entry_col) + ', 0)',
        getQueryInProgress(row, claim_col),
        getQueryInProgress(row, e1_col),
        getQueryInProgress(row, e1_date_col),
        getQueryInProgress(row, e2_col),
        getQueryInProgress(row, e2_date_col),
        '=IF(EQ(' + getQueryInProgress(row, done_col)
            + ', "Yes"), "No", "Yes")',
        '=IF(EQ(IFERROR(' + getQueryInArchive(row, entry_col)
            + ', 0), 0), "No", "Yes")'
    ]
}

/**
 * Gets an array of the formulas needed to fill the columns of the "Finished"
 * sheet (F for Finished).
 *
 * @param row  the row that needs to be filled.
 * @return the array of formulas.
 */
function getFFormulas(row)
{
    return [
        '=IFERROR(' + getQueryInArchive(row, entry_col) + ', 0)',
        getQueryInArchive(row, claim_col),
        getQueryInArchive(row, up_col)
    ]
}

/**
 * Get the string for a query to check the local archive to see if the username
 * in the row is contained in row it is checking against, getting only the first
 * result.
 *
 * @param row          the row being checked against
 * @param to_retrieve  the column to retrieve if the condition is true.
 * @return the query string.
 */
function getQueryInArchive(row, to_retrieve)
{
    return "QUERY(" + getQueryContainsName(row, local_archive, to_retrieve)
        + ", \"SELECT * LIMIT 1\")";
}

/**
 * Get the string for a query to check the local "In Progress" sheet of tracker
 * to see if the username in the row is contained in row it is checking against,
 * getting only the first result.
 *
 * @param row          the row being checked against
 * @param to_retrieve  the column to retrieve if the condition is true.
 * @return the query string.
 */
function getQueryInProgress(row, to_retrieve)
{
    return "QUERY(" + getQueryContainsName(row, local_progress, to_retrieve)
        + ", \"SELECT * LIMIT 1\")";
}

/**
 * Get the string for a query to check a specified range in the local tracker
 * to see if the username in the row is contained in row it is checking against.
 *
 * @param row    the row being checked against
 * @param range  range to check in
 & @param toGet  the column to retrieve if the condition is true.
 * @return the query string.
 */
function getQueryContainsName(row, range, toGet)
{
    return getQuery(range, toGet, getConditionContainsName(user_col, names_col + row));
}

/**
 * Gets the string for a query.
 *
 * @param range      the range to check.
 * @param from       the column to retrieve if the condition is true.
 * @param condition  the condition to check against.
 * @return the query string.
 */
function getQuery(range, from, condition)
{
    return "QUERY(" + range + ", \"SELECT " + from  + " WHERE " + condition + "\", 0)";
}

/**
 * Get the string condition for checking against a specified cell to see if
 * the row value is contained within it.
 *
 * @param target_col  the column being checked.
 * @param cell        the cell being checked against.
 * @return the query string.
 */
function getConditionContainsName(target_col, cell)
{
    return "'\"&" + cell + "&\"' CONTAINS " + target_col;
}
