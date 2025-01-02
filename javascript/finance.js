$(document).ready(function () {
    // to retrieve saved content from local storage
    function loadEntriesFromLocalStorage(categoryId) {
        const entries = localStorage.getItem(categoryId);
        return entries ? JSON.parse(entries) : [];
    }

    // save entries to local storage
    function saveEntriesToLocalStorage(categoryId, entries) {
        localStorage.setItem(categoryId, JSON.stringify(entries));
    }

    // add a new entry to the list
    function addEntryToList(categoryId, description, amount, date) {
        const entries = loadEntriesFromLocalStorage(categoryId);
        entries.push({ description, amount: parseFloat(amount), date });
        saveEntriesToLocalStorage(categoryId, entries); // save the new entry to local storage
        updateList(categoryId); // update list after adding
        updateOverallTotal();  // update overall total
    }

    // calculate and display totals for a category
    function updateCategoryTotal(categoryId) {
        const entries = loadEntriesFromLocalStorage(categoryId);
        // to calculate total
        const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
        $(`#total-${categoryId}`).text(`Total: $${total.toFixed(2)}`);
    }

    // update the list and total for a category
    function updateList(categoryId) {
        const entries = loadEntriesFromLocalStorage(categoryId);
        const list = $(`#list-${categoryId}`);
        list.empty();

        // show the latest 3 entries (reverse order so that the most recent is at the top)
        const latestEntries = entries.slice(-3).reverse();
        latestEntries.forEach((entry, index) => {
            list.append(
                `<li>
                    ${entry.date} - ${entry.description} - $${entry.amount.toFixed(2)}
                    <button class="delete-btn" data-category="${categoryId}" data-index="${entries.length - 3 + index}">x</button>
                </li>`
            );
        });
        updateCategoryTotal(categoryId); // Update category total
        attachDeleteHandlers();         // Attach delete functionality
    }

    // update overall total across all categories
    function updateOverallTotal() {
        const categories = ['food', 'transport', 'shopping', 'miscellaneous', 'others'];
        let overallTotal = 0;

        categories.forEach(category => {
            const entries = loadEntriesFromLocalStorage(category);
            overallTotal += entries.reduce((sum, entry) => sum + entry.amount, 0);
        });

        $('#overall-total').text(`Overall Total: $${overallTotal.toFixed(2)}`);
    }

    // to delete an entry in the list
    function attachDeleteHandlers() {
        $('.delete-btn').off('click').on('click', function () {
            const categoryId = $(this).data('category');
            const index = $(this).data('index');

            const entries = loadEntriesFromLocalStorage(categoryId);
            entries.splice(index, 1); // remove the entry at the specified index

            saveEntriesToLocalStorage(categoryId, entries); // save updated list to local storage
            updateList(categoryId); // update the displayed list
            updateOverallTotal();  // update overall total
        });
    }

    // "See More" button click
    function handleSeeMore(categoryId) {
        const entries = loadEntriesFromLocalStorage(categoryId);
        const list = $(`#list-${categoryId}`);
        list.empty(); // clear existing entries

        // show all entries 
        entries.reverse().forEach((entry, index) => {
            list.append(
                `<li>
                    ${entry.date} - ${entry.description} - $${entry.amount.toFixed(2)}
                    <button class="delete-btn" data-category="${categoryId}" data-index="${index}">x</button>
                </li>`
            );
        });

        $(`#seeMore-${categoryId}`).hide();
        attachDeleteHandlers();
    }

    // save entry
    function handleSaveEntry(categoryId) {
        const description = $(`#description-${categoryId}`).val().trim();
        const amount = $(`#amount-${categoryId}`).val().trim();
        const date = $(`#date-${categoryId}`).val(); // fetch the selected date

        if (!date || !description || !amount) {
            alert('Please select a date, enter a description and amount!');
            return;
        }

        addEntryToList(categoryId, description, amount, date); // save the entry
        $(`#description-${categoryId}`).val(''); // clear inputs
        $(`#amount-${categoryId}`).val('');
        $(`#date-${categoryId}`).val('');
    }

    // initialize the page
    const categories = ['food', 'transport', 'shopping', 'miscellaneous', 'others'];
    categories.forEach(category => {
        updateList(category); // load and display the most recent 3 entries
    });


    updateOverallTotal(); // calculate and display overall total

    $(document).on('click', '.save-btn', function () {
        const categoryId = $(this).closest('.categories').attr('id');
        handleSaveEntry(categoryId);
    });

    $(document).on('click', '.see-more-btn', function () {
        const categoryId = $(this).closest('.categories').attr('id');
        handleSeeMore(categoryId);
    });
});
