/**
 * Creates an Editor object, a subclass of a Writer, that includes
 * editor-specific information.
 * All dates should be strings formatted as MM/DD/YYYY.
 *
 * @param username  the editor's username on MAL.
 */
function Editor(username)
{
    // Inherit from Writer class.
    Writer.call(this, username);
    Editor.prototype = Object.create(Writer.prototype);
    Editor.prototype.constructor = Editor;

    // The number of phase one edits.
    this._numPhaseOne = 0;
    // The number of phase two edits.
    this._numPhaseTwo = 0;
    // Date of last edit.
    this._lastEditDate = null;

    /**
     * Gets the date of last activity by the editor.
     *
     * @return the date of last activity.
     */
    this.getActiveDate = function()
    {
        // Dates should be formatted as 'MM/DD/YYYY'
        var writeDate = this.getLastWriteDate();
        var editDate = this.getLastEditDate();
        // Check for null values.
        if (writeDate == null)
        {
            return editDate;
        }
        else if (editDate == null)
        {
            return writeDate;
        }
        if (compareDate(writeDate, editDate) > 0)
        {
            return writeDate;
        }
        else
        {
            return editDate;
        }
    }

    /**
     * Gets the number of phase one edits claimed.
     *
     * @return number of phase one edits.
     */
    this.getNumPhaseOne = function()
    {
        return this._numPhaseOne;
    }

    /**
     * Sets the number of phase one edits claimed.
     *
     * @param num  the number of phase one edits claimed.
     */
    this.setNumPhaseOne = function(num)
    {
        this._numPhaseOne = num;
    }

    /**
     * Gets the number of phase two edits claimed.
     *
     * @return number of phase two edits.
     */
    this.getNumPhaseTwo = function()
    {
        return this._numPhaseTwo;
    }

    /**
     * Sets the number of phase two edits claimed.
     *
     * @param num  the number of phase two edits claimed.
     */
    this.setNumPhaseTwo = function(num)
    {
        this._numPhaseTwo = num;
    }

    /**
     * Gets the date of the last edit claimed.
     *
     * @return date of last edit.
     */
    this.getLastEditDate = function()
    {
        return this._lastEditDate;
    }

    /**
     * Sets the date of the last edit claimed.
     *
     * @param date  the date of last edit.
     */
    this.setLastEditDate = function(date)
    {
        this._lastEditDate = date;
    }
}
