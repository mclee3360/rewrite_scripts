/**
 * Creates a Writer object, that stores information about the writer's activity.
 *
 * @param username  the writer's MAL username.
 */
function Writer(username)
{
    // Writer's username.
    this._username = username;
    // Date writer's application was submitted.
    this._appDate = null;
    // Date of last activity.
    this._activeDate = null;
    // Number of synopses written.
    this._numSynopses = 0;

    /**
     * Gets the writer's username.
     *
     * @return the username.
     */
    function getUsername()
    {
        return this._username;
    }

    /**
     * Sets the writer's username.
     *
     * @param username  the user's username.
     */
    function setUsername(username)
    {
        this._username = username;
    }

    /**
     * Gets the date writer submitted their application.
     *
     * @return the application date.
     */
    function getAppDate()
    {
        return this._appDate;
    }

    /**
     * Sets the date the writer submitted their application.
     *
     * @param appDate  the date of submission for their application.
     */
    function setAppDate(appDate)
    {
        this._appDate = appDate;
    }

    /**
     * Gets the most recent date a writer claimed a synopsis.
     *
     * @return last date of activity.
     */
    function getActiveDate()
    {
        return this._activeDate;
    }

    /**
     * Sets the date the writer last claimed a synopsis.
     *
     * @param activeDate  last date of activity
     */
    function setActiveDate(activeDate)
    {
        this._activeDate = activeDate;
    }

    /**
     * Gets the number of synopses the writer has written.
     *
     * @return number of synopses written.
     */
    function getNumSynopses()
    {
        return this._numSynopses;
    }

    /**
     * Sets the number of synopses the writer has written.
     *
     * @param num  the number of synopses written.
     */
    function setNumSynopses(num)
    {
        this._numSynopses = num;
    }
}
