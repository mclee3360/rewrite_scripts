var archive_name = 'Archive' // Archive sheet name.
// ID for "Synopses (Ongoing)" folder.
var progress_id = '0B5MIJmkWz2mFflllWEg3ck5TS3pNYmgwZGtudFJ0dXJGWDc5RGJPTWVTTE5EVWJhaG9oZHM';
// ID for "Synopses (Finished)" folder.
var finished_id = '0B5MIJmkWz2mFfmFnTmMtUWJUVGRBdUdMaXh4bjBJQXZ2U1ZUMUhzYlFucnY4amRRaTdESWc';

var date_col = 1;     // Column number for date claimed.
var entry_col = 2;    // Column number for the entry title.
var writer_col = 4;   // Column number for the writer.
var upload_col = 11;  // Column number for the date uploaded.
var checked_col = 13; // Column number for whether a row has been checked.

var range = 50; // Number of rows to check.

var checked = 'Y'; // Value for "Checked" column in archive if checked.
var hold_text = 'on-hold';  // Text for when an upload is on hold.

// Subject line for error-reporting emails.
var msg_subject = 'Synopsis Document Transfer Error: ';
// Email body for error-reporting emails.
var error_msg = 'The script was unable to find the following entries in the '
    + '"Synopses (Ongoing)" folder. This is likely due to the name of the '
    + 'document not matching up with the information on the tracker. Please '
    + 'move the following documents manually to the "Synopses (Finished)" '
    + 'folder.\n\n';
// The email to send error reports to
var report_email = 'mlee3360@gmail.com';
