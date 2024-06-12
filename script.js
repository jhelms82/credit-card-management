$(document).ready(function() {
    // Initialize variables to keep track of totals and submission count
    let totalLimit = 0;
    let totalBalance = 0;
    let totalInterest = 0;
    let submissionCount = 0;

    // Function to update the totals in the table
    function updateTotals() {
        $('#totalLimit').text(totalLimit.toFixed(2));
        $('#totalBalance').text(totalBalance.toFixed(2));
        if (submissionCount === 0) {
            $('#averageInterest').text('N/A');
        } else {
            $('#averageInterest').text((totalInterest / submissionCount).toFixed(2) + '%');
        }

        if ($('#results tr').length <= 2) { // 1 for header, 1 for totals row
            $('#resultsContainer').hide();
        } else {
            $('#resultsContainer').show();
        }

        // Save the table data to localStorage
        saveData();
    }

    // Function to save the data to localStorage
    function saveData() {
        let tableData = [];
        $('#results tr').each(function(index, row) {
            if (index > 0 && !$(row).is('#totalsRow')) {
                let rowData = {
                    name: $(row).find('.name').text(),
                    limit: parseFloat($(row).find('.limit').text()),
                    balance: parseFloat($(row).find('.balance').text()),
                    interest: parseFloat($(row).find('.interest').text())
                };
                tableData.push(rowData);
            }
        });
        localStorage.setItem('tableData', JSON.stringify(tableData));
        localStorage.setItem('totalLimit', totalLimit);
        localStorage.setItem('totalBalance', totalBalance);
        localStorage.setItem('totalInterest', totalInterest);
        localStorage.setItem('submissionCount', submissionCount);
    }

    // Function to load the data from localStorage
    function loadData() {
        let tableData = JSON.parse(localStorage.getItem('tableData'));
        if (tableData) {
            totalLimit = parseFloat(localStorage.getItem('totalLimit'));
            totalBalance = parseFloat(localStorage.getItem('totalBalance'));
            totalInterest = parseFloat(localStorage.getItem('totalInterest'));
            submissionCount = parseInt(localStorage.getItem('submissionCount'));

            tableData.forEach(function(rowData, index) {
                let row = $('<tr></tr>').attr('id', 'row' + index);
                row.append('<td class="name">' + rowData.name + '</td>');
                row.append('<td class="limit">' + rowData.limit.toFixed(2) + '</td>');
                row.append('<td class="balance">' + rowData.balance.toFixed(2) + '</td>');
                row.append('<td class="interest">' + rowData.interest.toFixed(2) + '%</td>');

                // Add edit and delete buttons
                let actions = $('<td></td>');
                let editButton = $('<button class="edit-btn">Edit</button>').on('click', function() {
                    let currentRow = $(this).closest('tr');
                    $('#name').val(currentRow.find('.name').text());
                    $('#limit').val(parseFloat(currentRow.find('.limit').text()));
                    $('#balance').val(parseFloat(currentRow.find('.balance').text()));
                    $('#interest').val(parseFloat(currentRow.find('.interest').text()));
                    $('#editingRow').val(currentRow.attr('id'));
                });
                let deleteButton = $('<button class="delete-btn">Delete</button>').on('click', function() {
                    let currentRow = $(this).closest('tr');
                    totalLimit -= parseFloat(currentRow.find('.limit').text());
                    totalBalance -= parseFloat(currentRow.find('.balance').text());
                    totalInterest -= parseFloat(currentRow.find('.interest').text());
                    submissionCount--;

                    $(this).closest('tr').remove();
                    updateTotals();
                });
                actions.append(editButton).append(deleteButton);
                row.append(actions);

                $('#totalsRow').before(row);
            });

            updateTotals();
        }
    }

    // Load data from localStorage when the page loads
    loadData();

    // Handle form submission
    $('#contactForm').on('submit', function(event) {
        // Prevent the form from submitting normally
        event.preventDefault();

        // Get the form values
        var name = $('#name').val();
        var limit = parseFloat($('#limit').val());
        var balance = parseFloat($('#balance').val());
        var interest = parseFloat($('#interest').val());
        var editingRow = $('#editingRow').val();

        // Validate the inputs
        if (isNaN(limit) || isNaN(balance) || isNaN(interest)) {
            $('#error').text('Please enter valid numbers for limit, balance, and interest rate.');
            return;
        } else {
            $('#error').text('');
        }

        if (editingRow) {
            // Edit the existing row
            var row = $('#' + editingRow);
            totalLimit -= parseFloat(row.find('.limit').text());
            totalBalance -= parseFloat(row.find('.balance').text());
            totalInterest -= parseFloat(row.find('.interest').text());

            row.find('.name').text(name);
            row.find('.limit').text(limit.toFixed(2));
            row.find('.balance').text(balance.toFixed(2));
            row.find('.interest').text(interest.toFixed(2) + '%');

            totalLimit += limit;
            totalBalance += balance;
            totalInterest += interest;

            $('#editingRow').val('');
        } else {
            // Create a new table row for a new submission
            var row = $('<tr></tr>').attr('id', 'row' + submissionCount);

            row.append('<td class="name">' + name + '</td>');
            row.append('<td class="limit">' + limit.toFixed(2) + '</td>');
            row.append('<td class="balance">' + balance.toFixed(2) + '</td>');
            row.append('<td class="interest">' + interest.toFixed(2) + '%</td>');

            // Add edit and delete buttons
            var actions = $('<td></td>');
            var editButton = $('<button class="edit-btn">Edit</button>').on('click', function() {
                var currentRow = $(this).closest('tr');
                $('#name').val(currentRow.find('.name').text());
                $('#limit').val(parseFloat(currentRow.find('.limit').text()));
                $('#balance').val(parseFloat(currentRow.find('.balance').text()));
                $('#interest').val(parseFloat(currentRow.find('.interest').text()));
                $('#editingRow').val(currentRow.attr('id'));
            });
            var deleteButton = $('<button class="delete-btn">Delete</button>').on('click', function() {
                var currentRow = $(this).closest('tr');
                totalLimit -= parseFloat(currentRow.find('.limit').text());
                totalBalance -= parseFloat(currentRow.find('.balance').text());
                totalInterest -= parseFloat(currentRow.find('.interest').text());
                submissionCount--;

                $(this).closest('tr').remove();
                updateTotals();
            });
            actions.append(editButton).append(deleteButton);
            row.append(actions);

            $('#totalsRow').before(row);

            totalLimit += limit;
            totalBalance += balance;
            totalInterest += interest;
            submissionCount++;
        }

        // Update the totals in the table
        updateTotals();

        $('#resultsContainer').show();

        // Clear the form values
        $('#contactForm')[0].reset();
    });
});
