$(document).ready(function () {
    console.log('Document ready, initializing FullCalendar...');
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultView: 'month',
        editable: false,
        selectable: false,
        events: []
    });
});
