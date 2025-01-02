$(document).ready(function () {
    var isInAgendaDayView = false;
    var selectedSlot = null;
    var eventCounter = 0;
    var selectedEvent = null;

    // initialise variables
    var overlay = $('<div id="overlay"></div>').appendTo('body');
    var popupModel = $('<div id="popupModel">\
            <div class="model-header">Enter Event Details</div>\
            <input type="text" id="descriptionInput" placeholder="Enter description for the selected slot...">\
            <input type="color" id="colorPicker">\
            <button id="submitDescriptionBtn" class="fc-button">Save</button>\
            <button id="deleteEventBtn" class="fc-button" style="display:none;">Delete Event</button>\
            <button id="cancelButton" class="fc-button">Cancel</button>\
            <div id="errorMessage" style="color: red; display: none;">Please enter a description for the event.</div>\
        </div>').appendTo('body');

    // to hide these 2 initially, only show when adding events
    overlay.hide();
    popupModel.hide();

    // to load events from local storage
    function loadEventsFromLocalStorage() {
        const events = localStorage.getItem('calendarEvents');
        return events ? JSON.parse(events) : [];
    }

    // to save events to local storage
    function saveEventsToLocalStorage() {
        const currentEvents = $('#calendar').fullCalendar('clientEvents').map(event => ({
            id: event._id,
            title: event.title,
            start: event.start.format(),
            end: event.end ? event.end.format() : null,
            color: event.color,
            description: event.description
        }));
        localStorage.setItem('calendarEvents', JSON.stringify(currentEvents));
    }

    // format to show calender in main page
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultView: 'month',
        editable: true,
        selectable: true,
        events: loadEventsFromLocalStorage(),

        //when selecting a 'date' in the month page, it navigates to the 'day' page
        dayClick: function (date, jsEvent, view) {
            if (view.name == 'month') {
                $('#calendar').fullCalendar('changeView', 'agendaDay');
                $('#calendar').fullCalendar('gotoDate', date);
                isInAgendaDayView = true;

                overlay.hide();
                popupModel.hide();
            }
        },

        //drag to SELECT slots
        select: function (start, end) {
            selectedSlot = { start: start, end: end };

            overlay.show();
            popupModel.show();
            $('#errorMessage').hide();
            $('#descriptionInput').val('');
            $('#colorPicker').val('#000000');
            $('#deleteEventBtn').hide();

            $('#submitDescriptionBtn').off('click').on('click', function () {
                var description = $('#descriptionInput').val();
                var color = $('#colorPicker').val() || '#000000';

                if (description.trim() !== '') {
                    $('#calendar').fullCalendar('renderEvent', {
                        id: 'event-' + eventCounter++,
                        title: description,
                        start: selectedSlot.start,
                        end: selectedSlot.end,
                        color: color,
                        description: description
                    });

                    saveEventsToLocalStorage(); // Save to Local Storage
                    overlay.hide();
                    popupModel.hide();
                } else {
                    $('#errorMessage').show();
                }
            });

            $('#cancelButton').off('click').on('click', function () {
                overlay.hide();
                popupModel.hide();
            });

            overlay.off('click').on('click', function () {
                overlay.hide();
                popupModel.hide();
            });
        },

        eventClick: function (event, jsEvent, view) {
            selectedEvent = event;

            overlay.show();
            popupModel.show();
            $('#descriptionInput').val(event.title);
            $('#colorPicker').val(event.color);
            $('#deleteEventBtn').show();

            $('#submitDescriptionBtn').off('click').on('click', function () {
                var description = $('#descriptionInput').val();
                var color = $('#colorPicker').val() || '#000000';

                // to check if descriptions is filled for the event
                if (description.trim() !== '') {
                    selectedEvent.title = description;
                    selectedEvent.color = color;

                    $('#calendar').fullCalendar('updateEvent', selectedEvent);
                    saveEventsToLocalStorage(); // saves to local storage
                    overlay.hide();
                    popupModel.hide();
                } else {
                    $('#errorMessage').show();
                }
            });

            $('#deleteEventBtn').off('click').on('click', function () {
                $('#calendar').fullCalendar('removeEvents', selectedEvent._id);
                saveEventsToLocalStorage(); // Save to Local Storage
                overlay.hide();
                popupModel.hide();
            });

            $('#cancelButton').off('click').on('click', function () {
                overlay.hide();
                popupModel.hide();
            });
        }
    });
});
