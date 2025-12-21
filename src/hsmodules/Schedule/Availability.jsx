import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Typography, Switch, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import client from '../../feathers';
import { ObjectContext, UserContext } from '../../context';
import { useForm } from 'react-hook-form';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import Input from '../../components/inputs/basic/Input';
import moment from 'moment';

const initialSchedule = {
  Sundays: [],
  Mondays: [],
  Tuesdays: [],
  Wednesdays: [],
  Thursdays: [],
  Fridays: [],
  Saturdays: [],
};

const initialActiveDays = {
  Sundays: false,
  Mondays: false,
  Tuesdays: false,
  Wednesdays: false,
  Thursdays: false,
  Fridays: false,
  Saturdays: false,
};

const SchedulePicker = ({ userData, onClose, initialAvailabilityData }) => {
  const { user } = useContext(UserContext);
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);
  const AvailabilityServ = client.service('availability');

  const { handleSubmit, setValue, watch, register, reset } = useForm({
    defaultValues: {
      schedule: initialSchedule,
      activeDays: initialActiveDays,
    },
  });

  const schedule = watch('schedule');
  const activeDays = watch('activeDays');

  
  const initializeScheduleData = useCallback(() => {
    
    const newSchedule = {
      Sundays: [],
      Mondays: [],
      Tuesdays: [],
      Wednesdays: [],
      Thursdays: [],
      Fridays: [],
      Saturdays: [],
    };
    
    const newActiveDays = {
      Sundays: false,
      Mondays: false,
      Tuesdays: false,
      Wednesdays: false,
      Thursdays: false,
      Fridays: false,
      Saturdays: false,
    };

    if (initialAvailabilityData && initialAvailabilityData.available) {
      
      const slotsByDay = {};
      
      initialAvailabilityData.available.forEach((slot) => {
        const dayName = moment(slot.startTime).format('dddd') + 's';
        if (!slotsByDay[dayName]) {
          slotsByDay[dayName] = [];
        }
        
        const timeSlot = {
          start: moment(slot.startTime).format('HH:mm'),
          end: moment(slot.endtime || slot.startTime).format('HH:mm'),
        };
        
       
        const isDuplicate = slotsByDay[dayName].some(existingSlot => 
          existingSlot.start === timeSlot.start && existingSlot.end === timeSlot.end
        );
        
        if (!isDuplicate) {
          slotsByDay[dayName].push(timeSlot);
        }
      });
      
      
      Object.entries(slotsByDay).forEach(([dayName, slots]) => {
        if (newSchedule[dayName]) {
          newSchedule[dayName] = slots;
          newActiveDays[dayName] = slots.length > 0;
        }
      });
    }

    return { newSchedule, newActiveDays };
  }, [initialAvailabilityData]);

  useEffect(() => {
    const { newSchedule, newActiveDays } = initializeScheduleData();
    reset({ schedule: newSchedule, activeDays: newActiveDays });
  }, [initializeScheduleData, reset]);

  const handleToggle = (key) => {
    setValue(`activeDays.${key}`, !activeDays[key]);
  };

  const handleAddTimeSlot = (key) => {
    const newSlots = [...(schedule[key] || []), { start: '', end: '' }];
    setValue(`schedule.${key}`, newSlots);
  };

  const handleRemoveTimeSlot = (key, index) => {
    const updated = schedule[key].filter((_, i) => i !== index);
    setValue(`schedule.${key}`, updated);
  };

  const onSubmit = async (data) => {
    showActionLoader();

    const newAvailabilityArray = [];

    const getNextWeekdayDate = (dayName) => {
      const today = moment();
      const dayIndex = moment().day(dayName).day(); 
      const nextDay = today.clone().day(dayIndex);

      if (nextDay.isBefore(today, 'day')) {
        nextDay.add(7, 'days');
      }
      nextDay.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }); 
      return nextDay.toDate();
    };

    Object.entries(data.activeDays).forEach(([day, isActive]) => {
      const targetDate = getNextWeekdayDate(day); 

      if (isActive) {
        const slots = data.schedule[day];
        if (slots && slots.length > 0) {
          slots.forEach((slot) => {
            if (slot.start && slot.end) {
              const startDateTime = moment(
                `${moment(targetDate).format('YYYY-MM-DD')} ${slot.start}`,
                'YYYY-MM-DD HH:mm',
              ).toDate();
              const endDateTime = moment(
                `${moment(targetDate).format('YYYY-MM-DD')} ${slot.end}`,
                'YYYY-MM-DD HH:mm',
              ).toDate();

              newAvailabilityArray.push({
                date: targetDate, 
                startTime: startDateTime,
                endtime: endDateTime,
                isBooked: false,
              });
            }
          });
        }
      }
    });

    const payload = {
      firstname: userData?.firstname,
      lastname: userData?.lastname,
      phone: userData?.phone,
      email: userData?.email,
      employeeId: user.currentEmployee._id,
      facilityId: user.currentEmployee.facilityDetail._id,
      available: newAvailabilityArray,
      unavailable: initialAvailabilityData?.unavailable || [], 
    };

    try {
      let res;
      if (initialAvailabilityData && initialAvailabilityData._id) {
        res = await AvailabilityServ.patch(
          initialAvailabilityData._id,
          payload,
        );
        console.log('Availability updated:', res);
      } else {
        res = await AvailabilityServ.create(payload);
        console.log('Availability created:', res);
      }
      onClose(); 
    } catch (error) {
      console.error('Error saving availability:', error);
    } finally {
      hideActionLoader();
    }
  };

  const renderDayBlock = (key) => (
    <Box
      key={key}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 3,
        p: 2,
        mb: 2,
        bgcolor: activeDays[key] ? '#f5faff' : '#f9f9f9',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Switch
            checked={activeDays[key]}
            onChange={() => handleToggle(key)}
            color="primary"
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {key}
          </Typography>
        </Box>
        <IconButton
          onClick={() => handleAddTimeSlot(key)}
          disabled={!activeDays[key]}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {activeDays[key] &&
        schedule[key]?.map((slot, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1,
            }}
          >
            <Input
              name={`schedule.${key}.${index}.start`}
              type="time"
              size="small"
              fullWidth
              register={register(`schedule.${key}.${index}.start`)}
            />
            <Typography>to</Typography>
            <Input
              name={`schedule.${key}.${index}.end`}
              type="time"
              size="small"
              fullWidth
              register={register(`schedule.${key}.${index}.end`)}
            />
            <IconButton onClick={() => handleRemoveTimeSlot(key, index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
    </Box>
  );

  const weekDays = [
    'Sundays',
    'Mondays',
    'Tuesdays',
    'Wednesdays',
    'Thursdays',
    'Fridays',
    'Saturdays',
  ];

  return (
    <Box sx={{ p: 1, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <GlobalCustomButton onClick={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          Save Availability
        </GlobalCustomButton>
      </Box>

      {weekDays.map((day) => renderDayBlock(day))}
    </Box>
  );
};

export default SchedulePicker;