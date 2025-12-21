import { Box, Grid, IconButton, Tab, Tabs } from '@mui/material';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import GlobalCustomButton from '../../../../components/buttons/CustomButton';
import CustomSelect from '../../../../components/inputs/basic/Select';
import { useForm } from 'react-hook-form';
import Input from '../../../../components/inputs/basic/Input';
import CustomTable from '../../../../components/customtable';
import client from '../../../../feathers';
import { ObjectContext, UserContext } from '../../../../context';
import { toast } from 'react-toastify';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CustomConfirmationDialog from '../../../../components/confirm-dialog/confirm-dialog';
import { PageWrapper } from '../../../app/styles';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AddCircleOutline } from '@mui/icons-material';
import EmployeeSearch from '../../../helpers/EmployeeSearch';

export default function TargetCreate({ handleGoBack }) {
  const { control, register, setValue, watch, handleSubmit, reset } = useForm({
    defaultValues: {
      targetType: 'Lead Target',
      durationType: '',
      startDate: '',
      endDate: '',
    },
  });
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [targets, setTargets] = useState([]);
  const targetServer = client.service('crmtarget');
  const employeeServer = client.service('employee');
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [docToDel, setDocToDel] = useState({});
  const watchedTargetType = watch('targetType');
  const watchedDurationType = watch('durationType');
  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');
  const [currentTab, setCurrentTab] = useState(0);
  const [isNewTargetMode, setIsNewTargetMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isSingleEmployeeMode, setIsSingleEmployeeMode] = useState(false);
  const [isAllEmployeeMode, setIsAllEmployeeMode] = useState(false);
  const [isOrganizationMode, setIsOrganizationMode] = useState(false);
  const [isFilterModeActive, setIsFilterModeActive] = useState(true);

  const [enabledNewTargetColumns, setEnabledNewTargetColumns] = useState({
    'Lead Target': false,
    'Opportunity Target': false,
    'Sales Activity Target': false,
    'Organization Target': false,
  });

  useEffect(() => {
    if (!isNewTargetMode && !isSingleEmployeeMode && !isAllEmployeeMode && !isOrganizationMode) {
      setIsFilterModeActive(true);
    } else {
      setIsFilterModeActive(false);
    }
  }, [isNewTargetMode, isSingleEmployeeMode, isAllEmployeeMode, isOrganizationMode]);

  const handleGetPractitioner = (practitioner) => {
    setSelectedEmployee(practitioner);
    
    if (isSingleEmployeeMode) {
      const employeeData = {
        _id: practitioner._id,
        employeeName:
          `${practitioner?.firstname} ${practitioner?.lastname}` || 'Unknown',
      };
      const categoriesForCurrentTab = targetTypeMap[currentTab].categories;

      categoriesForCurrentTab.forEach((category) => {
        const categorySlug = category.replace(/\s/g, '_').toLowerCase();
        employeeData[`prevValue_${categorySlug}`] = 0;
        employeeData[`currValue_${categorySlug}`] = 0;
        employeeData[`newValue_${categorySlug}`] = '';
      });

      setTargets([employeeData]);
    }
  };

  const targetTypeMap = {
    0: {
      type: 'Lead Target',
      categories: ['Number of Leads', 'Value of Leads'],
    },
    1: {
      type: 'Opportunity Target',
      categories: ['Number of Opportunity', 'Value of Opportunity'],
    },
    2: {
      type: 'Sales Activity Target',
      categories: [
        'Number of Cold Outreaches',
        'Number of Discovery Meetings',
        'Number of Stakeholder Presentation',
        'Number of Negotiations',
      ],
    },
    3: {
      type: 'Organization Target',
      categories: [
        'Target Leads',
        'Target Value Of Leads',
        'Target Opportunities',
        'Target Customers Closed',
        'Target Value Of Sales',
        'Target Cold Outreaches',
        'Target Discovery Meetings',
        'Target Stakeholder Presentations',
        'Target Contract Negotiations',
        'Retention Performance',
        'Target Companies Renewed',
        'Target Value Renewed',
        'Target Organic Growth',
        '90 Days Feedback meetings',
        '180 days Feedback meetings',
        'Pre-renewal Meetings',
        '3- Months Notice sent',
        '2- Months Notice Sent',
        '1- Month Notice Sent',
        'Complaint Resolved',
        'Complaint Unresolved',
      ],
    }
  };

  const handleAddNewTargetForSingleEmployee = () => {
    const currentTabType = watchedTargetType;
    if (enabledNewTargetColumns[currentTabType]) {
      toast.info(
        `"New Target" columns are already added for ${currentTabType}.`,
      );
      return;
    }
    setEnabledNewTargetColumns((prev) => ({
      ...prev,
      [currentTabType]: true,
    }));
    setIsNewTargetMode(true);
    setIsSingleEmployeeMode(true);
    setIsAllEmployeeMode(false);
    setIsOrganizationMode(false);
    setTargets([]); 
    setSelectedEmployee(null); 
  };

  const handleAddOrganizationEntry = () => {
    const currentTabType = watchedTargetType;
    if (enabledNewTargetColumns[currentTabType]) {
      toast.info(
        `"New Target" columns are already added for ${currentTabType}.`,
      );
      return;
    }
    setEnabledNewTargetColumns((prev) => ({
      ...prev,
      [currentTabType]: true,
    }));
    setIsNewTargetMode(true);
    setIsOrganizationMode(true);
    setIsSingleEmployeeMode(false);
    setIsAllEmployeeMode(false);
    setSelectedEmployee(null);
    
    // Create organization target entries
    const organizationTargets = targetTypeMap[currentTab].categories.map((category, index) => {
      const categorySlug = category.replace(/\s/g, '_').toLowerCase();
      return {
        _id: `org_${index}`,
        employeeName: category, // Use category name as the "Name"
        [`prevValue_${categorySlug}`]: 0,
        [`currValue_${categorySlug}`]: 0,
        [`newValue_${categorySlug}`]: '',
      };
    });
    
    setTargets(organizationTargets);
    fetchAllEmployees();
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    const newTargetType = targetTypeMap[newValue].type;
    setValue('targetType', newTargetType);

    setEnabledNewTargetColumns((prev) => ({
      ...prev,
      [watchedTargetType]: false,
      [newTargetType]: false,
    }));

    // Reset modes when switching tabs
    setIsOrganizationMode(false);
    setIsSingleEmployeeMode(false);
    setIsAllEmployeeMode(false);
    setIsNewTargetMode(false);
    
    // Only fetch employees for non-organization targets
    if (newTargetType !== 'Organization Target') {
      fetchAllEmployees();
    }
    // } else {
    //   // Fetch organization targets when switching to Organization Target tab
    //   fetchAllEmployees();
    // }
  };

  const fetchAllEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const facilityId = user.currentEmployee.facilityDetail._id;

      // Handle Organization Target separately
      if (watchedTargetType === 'Organization Target') {
        const query = {
          facility: facilityId,
          targettype: watchedTargetType,
          $limit: 5000,
          $sort: {
            createdAt: -1,
          },
        };

        if (isFilterModeActive) { 
          if (watchedStartDate) {
            query.startDate = watchedStartDate;
          }
          if (watchedEndDate) {
            query.endDate = watchedEndDate;
          }
        }

        const respTargets = await targetServer.find({
          query: query,
        });

        const categoriesForCurrentTab = targetTypeMap[currentTab].categories;
        
        const organizationTargets = categoriesForCurrentTab.map((category, index) => {
          const categorySlug = category.replace(/\s/g, '_').toLowerCase();
          
          // Find the latest target for this category
          const latestTarget = respTargets.data.find(
            (t) => t.targetcategory === category
          );

          return {
            _id: `org_${index}`,
            employeeName: category,
            [`prevValue_${categorySlug}`]: latestTarget?.prevValue || 0,
            [`currValue_${categorySlug}`]: latestTarget?.currValue || 0,
            [`newValue_${categorySlug}`]: '',
          };
        });

        setTargets(organizationTargets);
        setLoading(false);
        return;
      }

      // Handle employee targets (existing logic)
      let employeesToDisplay = [];

      if (isSingleEmployeeMode && selectedEmployee) {
        employeesToDisplay = [selectedEmployee];
      } else if (!isSingleEmployeeMode) {
        const respEmployees = await employeeServer.find({
          query: {
            facility: facilityId,
            $limit: 1000,
            $sort: {
              firstname: 1,
              department: "sales"
            },
          },
        });
        employeesToDisplay = respEmployees.data;
      } else {
        setTargets([]);
        setLoading(false);
        return;
      }

      const query = {
        facility: facilityId,
        targettype: watchedTargetType,
        $limit: 5000,
        $sort: {
          createdAt: -1,
        },
      };

      if (isFilterModeActive) { 
        if (watchedStartDate) {
          query.startDate = watchedStartDate;
        }
        if (watchedEndDate) {
          query.endDate = watchedEndDate;
        }
      }

      const respTargets = await targetServer.find({
        query: query,
      });

      const employeesWithTargets = employeesToDisplay.map((employee) => {
        const employeeData = {
          _id: employee._id,
          employeeName:
            `${employee?.firstname} ${employee?.lastname}` || 'Unknown',
        };
        const categoriesForCurrentTab = targetTypeMap[currentTab].categories;

        categoriesForCurrentTab.forEach((category) => {
          const categorySlug = category.replace(/\s/g, '_').toLowerCase();
          const fullTargetCategoryName = `Target ${category}`;

          const latestTarget = respTargets.data.find(
            (t) =>
              t.employeeId === employee._id &&
              t.targetcategory === fullTargetCategoryName,
          );

          employeeData[`prevValue_${categorySlug}`] =
            latestTarget?.prevValue || 0;
          employeeData[`currValue_${categorySlug}`] =
            latestTarget?.currValue || 0;
          employeeData[`newValue_${categorySlug}`] = '';
        });
        return employeeData;
      });

      setTargets(employeesWithTargets);
    } catch (error) {
      toast.error('Error fetching employees or targets: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [
    user,
    watchedTargetType,
    watchedDurationType,
    watchedStartDate,
    watchedEndDate,
    currentTab,
    isFilterModeActive, 
    isSingleEmployeeMode,
    selectedEmployee,
  ]);

  useEffect(() => {
    if (watchedTargetType !== 'Organization Target') {
      fetchAllEmployees();
    } else if (isFilterModeActive || (isSingleEmployeeMode && selectedEmployee)) { 
      fetchAllEmployees();
    }
  }, [
    fetchAllEmployees,
    watchedDurationType,
    watchedStartDate,
    watchedEndDate,
    isFilterModeActive, 
    isSingleEmployeeMode,
    selectedEmployee,
  ]);

  const handleDelete = async (obj) => {
    await targetServer
      .remove(obj._id)
      .then((resp) => {
        toast.success('Successfully deleted target');
        setConfirmDialog(false);
        fetchAllEmployees();
      })
      .catch((err) => {
        toast.error('Error deleting target ' + err);
        setConfirmDialog(false);
      });
  };

  const handleConfirmDelete = (doc) => {
    setDocToDel(doc);
    setConfirmDialog(true);
  };

  const handleCancelConfirm = () => {
    setDocToDel({});
    setConfirmDialog(false);
  };

  const handleAddNewTargetCategory = () => {
    const currentTabType = watchedTargetType;
    if (enabledNewTargetColumns[currentTabType]) {
      toast.info(
        `"New Target" columns are already added for ${currentTabType}.`,
      );
      return;
    }
    setEnabledNewTargetColumns((prev) => ({
      ...prev,
      [currentTabType]: true,
    }));
    setIsNewTargetMode(true);
    setIsSingleEmployeeMode(false);
    setIsAllEmployeeMode(true);
    setIsOrganizationMode(false);
    setSelectedEmployee(null); 
    fetchAllEmployees();
  };

  const handleCancel = () => {
    setEnabledNewTargetColumns({
      'Lead Target': false,
      'Opportunity Target': false,
      'Sales Activity Target': false,
      'Organization Target': false,
    });
    setIsNewTargetMode(false);
    setIsSingleEmployeeMode(false);
    setIsAllEmployeeMode(false);
    setIsOrganizationMode(false);
    setSelectedEmployee(null);
    
    if (watchedTargetType !== 'Organization Target') {
      fetchAllEmployees();
    } else {
      fetchAllEmployees(); 
    }
  };

  const handleSubmitTargets = async (data) => {
    showActionLoader();
    try {
      const facId = user.currentEmployee.facilityDetail._id;
      const createdById = user._id;
      const createdByName = `${user.firstname} ${user.lastname}`;
      const durationType = data.durationType;
      const startDate = data.startDate;
      const endDate = data.endDate;

      const targetsToCreate = [];
      const currentTabEntry = targetTypeMap[currentTab];
      const categoriesForCurrentTab = currentTabEntry
        ? currentTabEntry.categories
        : [];

      if (isOrganizationMode) {
        // Handle organization targets
        for (const row of targets) {
          const categoryName = row.employeeName; // This is the category name for organization
          const categorySlug = categoryName.replace(/\s/g, '_').toLowerCase();

          const newValueKey = `newValue_${row._id}_${categorySlug}`;
          const enteredNewValue = enabledNewTargetColumns[watchedTargetType]
            ? parseFloat(data[newValueKey]) || 0
            : 0;

          if (enteredNewValue > 0) {
            const existingTargetForCategory = await targetServer.find({
              query: {
                targetcategory: categoryName, // Use the category name directly as stored
                targettype: watchedTargetType,
                facility: facId,
                $limit: 1,
                $sort: { createdAt: -1 },
              },
            });

            const previousCurrentValue =
              existingTargetForCategory.data.length > 0
                ? existingTargetForCategory.data[0].currValue
                : 0;

            targetsToCreate.push({
              facility: facId,
              employeeId: facId,
              targetcategory: categoryName, 
              targettype: watchedTargetType,
              currValue: enteredNewValue,
              prevValue: previousCurrentValue,
              durationType: durationType,
              startDate: startDate,
              endDate: endDate,
              createdByName,
              createdById,
            });
          }
        }
      } else {
       
        for (const row of targets) {
          const employeeId = row._id;
          const employeeName = row.employeeName;

          for (const category of categoriesForCurrentTab) {
            const categorySlug = category.replace(/\s/g, '_').toLowerCase();
            const targetCategory = `Target ${category}`;

            const newValueKey = `newValue_${row._id}_${categorySlug}`;
            const enteredNewValue = enabledNewTargetColumns[watchedTargetType]
              ? parseFloat(data[newValueKey]) || 0
              : 0;

            if (enteredNewValue > 0) {
              const existingTargetForCategory = await targetServer.find({
                query: {
                  employeeId: employeeId,
                  targetcategory: targetCategory,
                  targettype: watchedTargetType,
                  $limit: 1,
                  $sort: { createdAt: -1 },
                },
              });

              const previousCurrentValue =
                existingTargetForCategory.data.length > 0
                  ? existingTargetForCategory.data[0].currValue
                  : 0;
              targetsToCreate.push({
                facility: facId,
                employeeName: employeeName,
                employeeId: employeeId,
                targetcategory: targetCategory,
                targettype: watchedTargetType,
                currValue: enteredNewValue,
                prevValue: previousCurrentValue,
                durationType: durationType,
                startDate: startDate,
                endDate: endDate,
                createdByName,
                createdById,
              });
            }
          }
        }
      }

      if (targetsToCreate.length === 0) {
        toast.info(
          "No new targets to save. Please enter values in 'New Target' columns.",
        );
        hideActionLoader();
        return;
      }

      await Promise.all(
        targetsToCreate.map((targetData) => targetServer.create(targetData)),
      );
      toast.success('Targets successfully submitted');

      const formFieldsToReset = {};
      targets.forEach((row) => {
        if (isOrganizationMode) {
          const categorySlug = row.employeeName.replace(/\s/g, '_').toLowerCase();
          formFieldsToReset[`newValue_${row._id}_${categorySlug}`] = '';
        } else {
          categoriesForCurrentTab.forEach((category) => {
            const categorySlug = category.replace(/\s/g, '_').toLowerCase();
            formFieldsToReset[`newValue_${row._id}_${categorySlug}`] = '';
          });
        }
      });
      reset(formFieldsToReset, { keepDefaultValues: true });

      setEnabledNewTargetColumns((prev) => ({
        ...prev,
        [watchedTargetType]: false,
      }));

      setIsNewTargetMode(false);
      setIsSingleEmployeeMode(false);
      setIsAllEmployeeMode(false);
      // setIsOrganizationMode(false);
      
      if (watchedTargetType !== 'Organization Target') {
        fetchAllEmployees();
      } else {
        fetchAllEmployees(); // Also fetch organization targets to refresh the display
      }
    } catch (error) {
      toast.error('Error submitting targets: ' + error.message);
    } finally {
      hideActionLoader();
    }
  };

  const getTargetColumns = () => {
    const columns = [
      {
        name: 'S/N',
        key: 'sn',
        description: 'Serial Number',
        selector: (row, i) => i + 1,
        sortable: true,
        width: '60px',
      },
      {
        name: isOrganizationMode || watchedTargetType === 'Organization Target' ? 'Names' : 'Employee Name',
        key: 'employee_name',
        description: isOrganizationMode || watchedTargetType === 'Organization Target' ? 'Names' : 'Employee Name',
        selector: (row) => row?.employeeName,
        sortable: true,
        width: '180px',
      },
    ];

    const currentTabEntry = targetTypeMap[currentTab];
    const isNewTargetColumnsEnabled = enabledNewTargetColumns[watchedTargetType];

    if (isOrganizationMode || watchedTargetType === 'Organization Target') {
      // For organization targets, show Previous Target, Current Target, and New Target columns
      columns.push({
        name: 'Previous Target',
        key: 'prev_target',
        description: 'Previous Target',
        selector: (row) => {
          const categorySlug = row.employeeName.replace(/\s/g, '_').toLowerCase();
          const value = row[`prevValue_${categorySlug}`] || 0;
          return new Intl.NumberFormat().format(value);
        },
        sortable: true,
        width: '150px',
      });

      columns.push({
        name: 'Current Target',
        key: 'curr_target',
        description: 'Current Target',
        cell: (row) => {
          const categorySlug = row.employeeName.replace(/\s/g, '_').toLowerCase();
          const newValueKey = `newValue_${row._id}_${categorySlug}`;
          const displayedValue = isNewTargetColumnsEnabled
            ? watch(newValueKey) || 0
            : row[`currValue_${categorySlug}`] || 0;

          return (
            <span>
              {new Intl.NumberFormat().format(displayedValue)}
            </span>
          );
        },
        sortable: false,
        width: '150px',
      });

      if (isNewTargetColumnsEnabled) {
        columns.push({
          name: 'New Target',
          key: 'new_target',
          description: 'New Target',
          cell: (row) => {
            const categorySlug = row.employeeName.replace(/\s/g, '_').toLowerCase();
            const valueKey = `newValue_${row._id}_${categorySlug}`;
            return (
              <Input
                {...register(valueKey)}
                value={watch(valueKey) || ''}
                type="number"
                onChange={(e) => setValue(valueKey, e.target.value)}
                style={{ width: '100px' }}
                placeholder="Enter new value"
              />
            );
          },
          sortable: false,
          width: '200px',
        });
      }
    } else {
      // Original logic for employee targets
      const categoriesForCurrentTab = currentTabEntry ? currentTabEntry.categories : [];

      categoriesForCurrentTab.forEach((category) => {
        const categoryLabel = category;
        const categorySlug = category.replace(/\s/g, '_').toLowerCase();
        const isValueTarget = category.toLowerCase().includes('value');

        columns.push({
          name: `Previous Target ${categoryLabel}`,
          key: `prev_${categorySlug}`,
          description: `Previous Target ${categoryLabel}`,
          selector: (row) => {
            const value = row[`prevValue_${categorySlug}`] || 0;
            return isValueTarget ? new Intl.NumberFormat().format(value) : value;
          },
          sortable: true,
          width: '250px',
        });

        columns.push({
          name: `Current Target ${categoryLabel}`,
          key: `curr_${categorySlug}`,
          description: `Current Target ${categoryLabel}`,
          cell: (row) => {
            const newValueKey = `newValue_${row._id}_${categorySlug}`;
            const displayedValue = isNewTargetColumnsEnabled
              ? watch(newValueKey) || 0
              : row[`currValue_${categorySlug}`] || 0;

            return (
              <span>
                {isValueTarget
                  ? new Intl.NumberFormat().format(displayedValue)
                  : displayedValue}
              </span>
            );
          },
          sortable: false,
          width: '250px',
        });

        if (isNewTargetColumnsEnabled) {
          columns.push({
            name: `New Target ${categoryLabel}`,
            key: `new_${categorySlug}`,
            description: `New Target ${categoryLabel}`,
            cell: (row) => {
              const valueKey = `newValue_${row._id}_${categorySlug}`;
              return (
                <Input
                  {...register(valueKey)}
                  value={watch(valueKey) || ''}
                  type={isValueTarget ? 'text' : 'number'}
                  onChange={(e) => setValue(valueKey, e.target.value)}
                  style={{ width: '100px' }}
                  placeholder="Enter new value"
                />
              );
            },
            sortable: false,
            width: '250px',
          });
        }
      });
    }

    columns.push({
      name: 'Action',
      selector: (row) => (
        <IconButton size="small" onClick={() => handleConfirmDelete(row)}>
          <DeleteOutlineIcon fontSize="small" sx={{ color: 'red' }} />
        </IconButton>
      ),
      width: '80px',
    });

    return columns;
  };

  return (
    <Box sx={{ height: '90vh', overflow: 'auto' }}>
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={handleCancelConfirm}
        confirmationAction={() => handleDelete(docToDel)}
        message={`Are you sure you want to delete this target entry?`}
      />
      <PageWrapper style={{ flexDirection: 'column', padding: '0.6rem 1rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <h2 style={{ margin: '0 10px', fontSize: '0.95rem' }}>
            Create Target
          </h2>
        </Box>

        <Box
          sx={{
            width: '100%',
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="target type tabs"
            indicatorColor="transparent"
            textColor="primary"
          >
            {Object.values(targetTypeMap).map((item, index) => {
              const buttonColor = {
                'Lead Target': 'primary',
                'Sales Activity Target': 'secondary',
                'Opportunity Target': 'success',
                'Organization Target': 'warning'
              }[item.type];

              return (
                <GlobalCustomButton
                  key={index}
                  onClick={(e) => handleTabChange(e, index)}
                  sx={{ textTransform: 'none', margin: '0 5px' }}
                  variant={currentTab === index ? 'outlined' : 'contained'}
                  color={buttonColor}
                >
                  {item.type}
                </GlobalCustomButton>
              );
            })}
          </Tabs>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {watchedTargetType === 'Organization Target' ? (
              <GlobalCustomButton
                variant="contained"
                onClick={handleAddOrganizationEntry}
              >
                <AddCircleOutline
                  fontSize="small"
                  sx={{ marginRight: '5px' }}
                />
               Add Organization Entry
              </GlobalCustomButton>
            ) : (
              <>
                {isSingleEmployeeMode ? null : (
                  <GlobalCustomButton
                    variant="contained"
                    onClick={handleAddNewTargetCategory}
                  >
                    <AddCircleOutline
                      fontSize="small"
                      sx={{ marginRight: '5px' }}
                    />
                    Bulk Entry
                  </GlobalCustomButton>
                )}

                {isAllEmployeeMode ? null : (
                  <GlobalCustomButton
                    variant="contained"
                    onClick={handleAddNewTargetForSingleEmployee}
                  >
                    <AddCircleOutline
                      fontSize="small"
                      sx={{ marginRight: '5px' }}
                    />
                    Single Entry
                  </GlobalCustomButton>
                )}
              </>
            )}
            
            {isNewTargetMode && (
              <GlobalCustomButton
                variant="contained"
                color="error"
                onClick={handleCancel}
              >
                Cancel
              </GlobalCustomButton>
            )} 
          </Box>
        </Box>

        <Grid container spacing={2} mb={3}>
          {isSingleEmployeeMode && watchedTargetType !== 'Organization Target' && (
            <Grid item xs={12} sm={12} md={4}>
              <EmployeeSearch getSearchfacility={handleGetPractitioner} />
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={4}>
            <CustomSelect
              options={['Weekly', 'Monthly', 'Yearly']}
              label="Duration Type"
              control={control}
              name="durationType"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Input
              register={register('startDate', {
                required: 'Start Date is required',
              })}
              label="Start Date"
              type="date"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Input
              register={register('endDate', {
                required: 'End Date is required',
              })}
              label="End Date"
              type="date"
            />
          </Grid>
        </Grid>

        <Box sx={{ width: '100%', overflow: 'auto', mt: 3 }}>
          <CustomTable
            title={''}
            columns={getTargetColumns()}
            data={targets}
            pointerOnHover
            highlightOnHover
            striped
            progressPending={loading}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <GlobalCustomButton
            variant="contained"
            onClick={handleSubmit(handleSubmitTargets)}
          >
            Save Target
          </GlobalCustomButton>
        </Box>
      </PageWrapper>
    </Box>
  );
}