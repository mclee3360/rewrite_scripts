/**
 * Creates a Writer object, that stores information about the writer's activity.
 * All dates should be strings formatted as MM/DD/YYYY.
 *
 * @param username  the writer's MAL username.
 */
function Writer(username)
{
    // Writer's username.
    this._username = username;
    // Date writer's application was submitted.
    this._appDate = null;
    // Date of last claimed synopsis.
    this._lastWriteDate = null;
    // Number of synopses written.
    this._numSynopses = 0;

    /**
     * Gets the date of last activity by the writer.
     *
     * @return the date of last activity.
     */
    this.getActiveDate = function()
    {
        return this.getLastWriteDate();
    }
    
    /**
     * Gets the writer's username.
     *
     * @return the username.
     */
    this.getUsername = function()
    {
        return this._username;
    }

    /**
     * Sets the writer's username.
     *
     * @param username  the user's username.
     */
    this.setUsername = function(username)
    {
        this._username = username;
    }

    /**
     * Gets the date writer submitted their application.
     *
     * @return the application date.
     */
    this.getAppDate = function()
    {
        return this._appDate;
    }

    /**
     * Sets the date the writer submitted their application.
     *
     * @param date  the date of submission for their application.
     */
    this.setAppDate = function(date)
    {
        this._appDate = date;
    }

    /**
     * Gets the most recent date a writer claimed a synopsis.
     *
     * @return last date of activity.
     */
    this.getLastWriteDate = function()
    {
        return this._lastWriteDate;
    }

    /**
     * Sets the date the writer last claimed a synopsis.
     *
     * @param date  date of last claim
     */
    this.setLastWriteDate = function(date)
    {
        this._lastWriteDate = date;
    }

    /**
     * Gets the number of synopses the writer has written.
     *
     * @return number of synopses written.
     */
    this.getNumSynopses = function()
    {
        return this._numSynopses;
    }

    /**
     * Sets the number of synopses the writer has written.
     *
     * @param num  the number of synopses written.
     */
    this.setNumSynopses = function(num)
    {
        this._numSynopses = num;
    }
}
