$(document).ready(function () {
    var isInAgendaDayView = false;
    var selectedSlot = null;
    var eventCounter = 0;
    var selectedEvent = null;

    // variables
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

    overlay.hide();
    popupModel.hide();

    // Load events from Local Storage
    function loadEventsFromLocalStorage() {
        const events = localStorage.getItem('calendarEvents');
        return events ? JSON.parse(events) : [];
    }

    // Save events to Local Storage
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

        dayClick: function (date, jsEvent, view) {
            if (view.name == 'month') {
                $('#calendar').fullCalendar('changeView', 'agendaDay');
                $('#calendar').fullCalendar('gotoDate', date);
                isInAgendaDayView = true;

                overlay.hide();
                popupModel.hide();
            }
        },

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

                if (description.trim() !== '') {
                    selectedEvent.title = description;
                    selectedEvent.color = color;

                    $('#calendar').fullCalendar('updateEvent', selectedEvent);
                    saveEventsToLocalStorage(); // Save to Local Storage
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
