function addWriters(names)
{
    var sheet = SpreadsheetApp.openById(activity_list_id).getSheetByName(al_writers);
    addToList(sheet, names, writer_formulas);
}

function addEditors(names)
{
    var sheet = SpreadsheetApp.openById(activity_list_id).getSheetByName(al_editors);
    addToList(sheet, names, editor_formulas);
}

function addCoordinators(names)
{
    var sheet = SpreadsheetApp.openById(activity_list_id).getSheetByName(al_coordinators);
    addToList(sheet, names, coord_formulas);
}

function addContributors(names)
{
    var sheet = SpreadsheetApp.openById(activity_list_id).getSheetByName(al_contributors);
}

function addToList(sheet, names, formula)
{
    var values = [];
    var startRow = sheet.getLastRow() + 1;
    var lastRow = startRow;
    sheet.insertRowsAfter(startRow - 1, names.length);
    for (i = 0; i < names.length; i++)
    {
        lastRow = startRow + i;
        row_values = ["=HYPERLINK(\"" + profile_url + names[i][0] + "\", \""
            + names[i][0] + "\")"];
        var formulas = formula(lastRow, names[i][1]);
        for (j = 0; j < formulas.length; j++)
        {
            row_values.push(formulas[j]);
        }
        values.push(row_values);
    }
    sheet.getRange(startRow, 1, names.length, sheet.getLastColumn()).setValues(values);
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).sort(1);
}

function writer_formulas(row, oldnames)
{
    return [
        "=getAppDate(A" + row + ", G" + row + ", " + (new Date().getFullYear())
            + ", " + writer_refresh + ")",
        "=getActivityWriter(A" + row + ", G" + row + ", " + writer_refresh + ")",
        "=getNumWritten(A" + row + ", G" + row + ", " + writer_refresh + ")",
        "",
        "",
        oldnames,
        "=IF(isActive(C" + row + ", " + writer_refresh + "), \"Yes\", \"No\")",
        "No"
    ];
}

function editor_formulas(row, oldnames)
{
    return [
        "=getAppDate(A" + row + ", J" + row + ", " + (new Date().getFullYear())
            + ", " + editor_refresh + ")",
        "",
        "=getActivityEditor(A" + row + ", J" + row + ", " + editor_refresh + ")",
        "=getNumPhaseOne(A" + row + ", J" + row + ", " + editor_refresh + ")",
        "=getNumPhaseTwo(A" + row + ", J" + row + ", " + editor_refresh + ")",
        "=getNumWritten(A" + row + ", J" + row + ", " + editor_refresh + ")",
        "",
        "",
        oldnames,
        "=IF(OR(isActive(D" + row + "), isActive(C" + row + ")), \"Yes\", \"No\")",
        "No"
    ];
}

function coord_formulas(row, oldnames)
{
    return [
        "=getAppDate(A" + row + ", I" + row + ", " + (new Date().getFullYear())
            + ", " + coordinator_refresh + ")",
        "Active",
        "=getNumPhaseOne(A" + row + ", I" + row + ", " + editor_refresh + ")",
        "=getNumPhaseTwo(A" + row + ", I" + row + ", " + editor_refresh + ")",
        "=getNumWritten(A" + row + ", I" + row + ", " + editor_refresh + ")",
        "",
        "",
        oldnames
    ];
}
