import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { Box, Typography, Grid } from '@mui/material';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import client from '../../feathers';
import { UserContext } from '../../context';
import moment from 'moment';
import ModalBox from '../../components/modal';
import Input from '../../components/inputs/basic/Input';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import Textarea from '../../components/inputs/basic/Textarea';
import SchedulePicker from './Availability';
import { CalendarMonthOutlined } from '@mui/icons-material';

const localizer = momentLocalizer(moment);

export default function CalendarApp() {
  const [events, setEvents] = useState([]);
  const AvailabilityServ = client.service('availability');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [scheduleModal, setScheduleModal] = useState(false);

  // Store the *single* availability record here
  const [employeeAvailability, setEmployeeAvailability] = useState(null);
  // Track if initial fetch is complete
  const [initialAvailabilityFetched, setInitialAvailabilityFetched] = useState(false);

  const [dialogMode, setDialogMode] = useState('create');
  const [currentEvent, setCurrentEvent] = useState(null);

  const { user } = useContext(UserContext);

  // Fetch initial availability data only once
  useEffect(() => {
    const fetchInitialAvailability = async () => {
      if (!user.currentEmployee || initialAvailabilityFetched) return;

      try {
        const query = {
          facilityId: user.currentEmployee.facilityDetail._id,
          employeeId: user.currentEmployee._id,
        };
        const res = await AvailabilityServ.find({ query });

        if (res.data && res.data.length > 0) {
          // Assuming there's only one availability record per employee
          setEmployeeAvailability(res.data[0]);
          const unavailabilityEvents = res.data[0].unavailable?.map((unavail) => ({
            id: unavail._id,
            title: unavail.reason || 'Unavailable',
            start: new Date(unavail.startTime),
            end: new Date(unavail.endtime),
            isAvailability: false,
          })) || [];
          setEvents(unavailabilityEvents);
        } else {
          setEmployeeAvailability(null); // No existing record
        }
        setInitialAvailabilityFetched(true); // Mark as fetched
      } catch (error) {
        console.error('Error fetching initial availability:', error);
      }
    };

    fetchInitialAvailability();

    // Setup real-time listeners for updates
    const handleServerEvent = (data) => {
      // If the update is for the current employee's availability record, update state
      if (data.employeeId === user.currentEmployee._id) {
          setEmployeeAvailability(data); // Update the main availability record
          const unavailabilityEvents = data.unavailable?.map((unavail) => ({
              id: unavail._id,
              title: unavail.reason || 'Unavailable',
              start: new Date(unavail.startTime),
              end: new Date(unavail.endtime),
              isAvailability: false,
          })) || [];
          setEvents(unavailabilityEvents);
      }
    };

    AvailabilityServ.on('created', handleServerEvent);
    AvailabilityServ.on('updated', handleServerEvent);
    AvailabilityServ.on('patched', handleServerEvent);
    AvailabilityServ.on('removed', handleServerEvent);

    return () => {
      AvailabilityServ.off('created', handleServerEvent);
      AvailabilityServ.off('updated', handleServerEvent);
      AvailabilityServ.off('patched', handleServerEvent);
      AvailabilityServ.off('removed', handleServerEvent);
    };
  }, [user, initialAvailabilityFetched]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReason('');
    setStartDate('');
    setEndDate('');
    setSelectedDate(null);
    setDialogMode('create');
    setCurrentEvent(null);
  };

  const handleSave = async () => {
    const startDateTime = moment(startDate);
    const endDateTime = moment(endDate);

    if (!startDateTime.isValid() || !endDateTime.isValid()) {
      console.error('Invalid date format. Please check start and end dates.');
      return;
    }

    try {
      if (dialogMode === 'edit' && currentEvent) {
        const updatedUnavailable = employeeAvailability.unavailable.map(
          (unavail) =>
            unavail._id === currentEvent.id
              ? {
                  ...unavail,
                  date: startDateTime.toDate(),
                  startTime: startDateTime.toDate(),
                  endtime: endDateTime.toDate(),
                  reason: reason || 'Unavailable',
                }
              : unavail,
        );
        await AvailabilityServ.patch(employeeAvailability._id, {
          unavailable: updatedUnavailable,
        });
        console.log('Unavailability updated:', currentEvent.id);
      } else {
        const newUnavailableData = {
          date: startDateTime.toDate(),
          startTime: startDateTime.toDate(),
          endtime: endDateTime.toDate(),
          reason: reason || 'Unavailable',
        };

        if (employeeAvailability) {
          const currentUnavailable = employeeAvailability.unavailable || [];
          const updatedUnavailable = [...currentUnavailable, newUnavailableData];
          await AvailabilityServ.patch(employeeAvailability._id, {
            unavailable: updatedUnavailable,
          });
        } else {
          // If no existing availability record, create one
          await AvailabilityServ.create({
            employeeId: user.currentEmployee._id,
            facilityId: user.currentEmployee.facilityDetail._id,
            unavailable: [newUnavailableData],
            available: [], // Initialize available as empty if creating new
          });
          console.log('Availability record and unavailability created:', newUnavailableData);
        }
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving unavailability:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (currentEvent && !currentEvent.isAvailability && employeeAvailability) {
        const updatedUnavailable = employeeAvailability.unavailable.filter(
          (unavail) => unavail._id !== currentEvent.id,
        );
        await AvailabilityServ.patch(employeeAvailability._id, {
          unavailable: updatedUnavailable,
        });
        console.log('Unavailability deleted:', currentEvent.id);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleToggleEditMode = () => {
    setDialogMode('edit');
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedDate(moment(start).format('YYYY-MM-DD'));
    setStartDate(moment(start).format('YYYY-MM-DD'));
    setEndDate(moment(end).format('YYYY-MM-DD'));
    setReason('');
    setDialogMode('create');
    setCurrentEvent(null);
    setOpenDialog(true);
  };

  const handleSelectEvent = (event) => {
    if (!event.isAvailability) {
      setCurrentEvent(event);
      setReason(event.title);
      setSelectedDate(moment(event.start).format('YYYY-MM-DD'));
      setStartDate(moment(event.start).format('YYYY-MM-DD'));
      setEndDate(moment(event.end).format('YYYY-MM-DD'));
      setDialogMode('view');
      setOpenDialog(true);
    }
  };

  const handleEventDrop = async ({ event, start, end }) => {
    if (!event.isAvailability && employeeAvailability) {
      try {
        const updatedUnavailable = employeeAvailability.unavailable.map(
          (unavail) =>
            unavail._id === event.id
              ? {
                  ...unavail,
                  date: start.toISOString(),
                  startTime: start.toISOString(),
                  endtime: end.toISOString(),
                }
              : unavail,
        );
        await AvailabilityServ.patch(employeeAvailability._id, {
          unavailable: updatedUnavailable,
        });
        // State will be updated by the Feathers real-time listener
      } catch (error) {
        console.error('Error updating unavailability on drop:', error);
      }
    }
  };

  const handleEventResize = async ({ event, start, end }) => {
    if (!event.isAvailability && employeeAvailability) {
      try {
        const updatedUnavailable = employeeAvailability.unavailable.map(
          (unavail) =>
            unavail._id === event.id
              ? {
                  ...unavail,
                  date: start.toISOString(),
                  startTime: start.toISOString(),
                  endtime: end.toISOString(),
                }
              : unavail,
        );
        await AvailabilityServ.patch(employeeAvailability._id, {
          unavailable: updatedUnavailable,
        });
        // State will be updated by the Feathers real-time listener
      } catch (error) {
        console.error('Error updating unavailability on resize:', error);
      }
    }
  };

  // Callback to update employeeAvailability after SchedulePicker saves
  const handleSchedulePickerSave = useCallback((updatedRecord) => {
    setEmployeeAvailability(updatedRecord);
    setScheduleModal(false); // Close the modal after saving
  }, []);

  const eventPropGetter = useMemo(
    () => (event) => {
      let newStyle = {
        backgroundColor: '#F44336',
        color: 'white',
        borderRadius: '4px',
        border: 'none',
      };
      return {
        style: newStyle,
      };
    },
    [],
  );

  const Event = useMemo(
    () =>
      ({ event }) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.85rem',
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: 'inherit' }}
            >
              {moment(event.start).format('MMM D, YY')} -{' '}
              {moment(event.end).format('MMM D, YY')}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: 'inherit',
              }}
            >
              {event.title}
            </Typography>
          </Box>
        );
      },
    [],
  );

  return (
    <>
      <Box
        style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}
      >
        <GlobalCustomButton onClick={() => setScheduleModal(true)}>
          <CalendarMonthOutlined fontSize="small" sx={{ mr: 1 }} />
          {employeeAvailability ? 'View Availability' : 'Add Availability'}
        </GlobalCustomButton>
      </Box>

      <Box
        p={3}
        sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', flexGrow: 1 }}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          selectable
          resizable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          eventPropGetter={eventPropGetter}
          components={{
            event: Event,
          }}
        />

        <ModalBox
          open={openDialog}
          width="40%"
          onClose={handleCloseDialog}
          header={
            dialogMode === 'create'
              ? 'Add Unavailability'
              : dialogMode === 'view'
                ? 'View Unavailability'
                : 'Edit Unavailability'
          }
        >
          {dialogMode === 'create' ? (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Input
                  label="Start Date"
                  type="date"
                  value={startDate || ''}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  label="End Date"
                  type="date"
                  value={endDate || ''}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Textarea
                  label="Reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for unavailability"
                />
              </Grid>
            </Grid>
          ) : (
            <Box>
              {dialogMode === 'view' && (
                <>
                  <Typography variant="h6">{currentEvent?.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    From:{' '}
                    {moment(currentEvent?.start).format('MMMM Do, h:mm a')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    To: {moment(currentEvent?.end).format('MMMM Do, h:mm a')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Reason: {currentEvent?.title}
                  </Typography>
                </>
              )}

              {dialogMode === 'edit' && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Input
                      label="Start Date"
                      type="date"
                      value={startDate || ''}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Input
                      label="End Date"
                      type="date"
                      value={endDate || ''}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Textarea
                      label="Reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </Grid>
                </Grid>
              )}

              <Grid container spacing={2} sx={{ mt: 2 }}>
                {dialogMode === 'view' && (
                  <Grid item>
                    <GlobalCustomButton
                      onClick={handleToggleEditMode}
                      variant="contained"
                    >
                      Edit
                    </GlobalCustomButton>
                  </Grid>
                )}

                {(dialogMode === 'view' || dialogMode === 'edit') && (
                  <Grid item>
                    <GlobalCustomButton onClick={handleDelete} color="error">
                      Delete
                    </GlobalCustomButton>
                  </Grid>
                )}

                <Grid item>
                  <GlobalCustomButton onClick={handleCloseDialog}>
                    Cancel
                  </GlobalCustomButton>
                </Grid>

                {dialogMode === 'edit' && (
                  <Grid item>
                    <GlobalCustomButton
                      onClick={handleSave}
                      variant="contained"
                    >
                      Update
                    </GlobalCustomButton>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
          {dialogMode === 'create' && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item>
                <GlobalCustomButton onClick={handleCloseDialog}>
                  Cancel
                </GlobalCustomButton>
              </Grid>
              <Grid item>
                <GlobalCustomButton onClick={handleSave} variant="contained">
                  Save
                </GlobalCustomButton>
              </Grid>
            </Grid>
          )}
        </ModalBox>

        <ModalBox
          width="40%"
          open={scheduleModal}
          onClose={() => setScheduleModal(false)}
          header="Manage Availability"
        >
          
          {(employeeAvailability !== undefined || initialAvailabilityFetched) && (
            <SchedulePicker
              userData={user?.currentEmployee}
              initialAvailabilityData={employeeAvailability} 
              onClose={handleSchedulePickerSave} 
            />
          )}
        </ModalBox>
      </Box>
    </>
  );
}