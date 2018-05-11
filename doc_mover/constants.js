var archive_name = 'Archive' // Archive sheet name.
// ID for "Synopses (Ongoing)" folder.
var progress_id = '0B5MIJmkWz2mFflllWEg3ck5TS3pNYmgwZGtudFJ0dXJGWDc5RGJPTWVTTE5EVWJhaG9oZHM';
// ID for "Synopses (Finished)" folder.
var finished_id = '0B5MIJmkWz2mFfmFnTmMtUWJUVGRBdUdMaXh4bjBJQXZ2U1ZUMUhzYlFucnY4amRRaTdESWc';

var date_col = 1;     // Column number for date claimed.
var entry_col = 2;    // Column number for the entry title.
var writer_col = 4;   // Column number for the writer.
var link_col = 5;     // Column number for document link.
var upload_col = 11;  // Column number for the date uploaded.
var checked_col = 13; // Column number for whether a row has been checked.

var range = 50; // Number of rows to check.

var checked = 'Y'; // Value for "Checked" column in archive if checked.
var hold_text = 'on-hold';  // Text for when an upload is on hold.

// Ongoing synopses folder name.
var ongoing_name = "Synopses (Ongoing)";

// Subject line for error-reporting emails.
var msg_subject = 'Synopsis Document Transfer Error: ';
// Email body for error-reporting emails.
var error_msg = 'The script was unable to find or access the files for the '
    + 'following entries, either due to an irregular URL or the file was not '
    + 'in the ongoing synopses folder. Please move the following documents '
    + 'manually to the "Synopses (Finished)" folder.\n\n';
// The email to send error reports to
var report_email = 'mlee3360@gmail.com';

// Doc ID Delimiter.
var drive_id_prefix = "open?id=";
var doc_id_prefix = "/d/";
var doc_id_suffix = "/edit";
// URL Types.
var doc_url = "docs.google";
var drive_url = "drive.google";
