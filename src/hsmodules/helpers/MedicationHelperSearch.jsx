/* eslint-disable */
import React, { useState, useContext, useEffect, useRef } from 'react'
import client from '../../feathers'
import { UserContext, ObjectContext } from '../../context'
import { toast } from 'react-toastify'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

export default function MedicationHelperSearch({
    id,
    getSearchfacility,
    clear,
    disable = false,
    label,
}) {
    const productServ = client.service('medicationhelper')
    const [facilities, setFacilities] = useState([])

    const [searchError, setSearchError] = useState(false)

    const [showPanel, setShowPanel] = useState(false)

    const [searchMessage, setSearchMessage] = useState('')

    const [simpa, setSimpa] = useState('')

    const [chosen, setChosen] = useState(false)

    const [count, setCount] = useState(0)
    const inputEl = useRef(null)
    const [val, setVal] = useState('')
    const { user } = useContext(UserContext)
    const { state } = useContext(ObjectContext)
    const [productModal, setProductModal] = useState(false)

    const getInitial = async id => {
        console.log(id)
        if (!!id) {
            let obj = {
                categoryname: id,
            }
            console.log(obj)
            handleRow(obj)
        }
    }

    useEffect(() => {
        getInitial(id)
        return () => {}
    }, [])

    const handleRow = async obj => {
        await setChosen(true)
        //alert("something is chaning")

        await setSimpa(obj.medication)
        getSearchfacility(obj)
        // setSelectedFacility(obj)
        setShowPanel(false)
        await setCount(2)
        /* const    newfacilityModule={
            selectedFacility:facility,
            show :'detail'
        }
   await setState((prevstate)=>({...prevstate, facilityModule:newfacilityModule})) */
        //console.log(state)
    }

    const handleAddproduct = () => {
        let obj = {
            medication: val,
        }
        //console.log(obj);
        setSimpa(val)
        handleRow(obj)

        // setProductModal(true)
    }

    const handleSearch = async value => {
        setVal(value)
        if (value === '') {
            setShowPanel(false)
            getSearchfacility(false)
            return
        }
        const field = 'medication' //field variable

        if (value.length >= 3) {
            productServ
                .find({
                    query: {
                        //service
                        [field]: {
                            $regex: value,
                            $options: 'i',
                        },
                        $limit: 10,
                        $sort: {
                            createdAt: -1,
                        },
                    },
                })
                .then(res => {
                    if (res.total > 0) {
                        setFacilities(res.data)
                        setSearchMessage(' product  fetched successfully')
                        setShowPanel(true)
                    } else {
                        setShowPanel(false)
                        getSearchfacility({
                            medication: value,
                            instruction: '',
                        })
                    }
                })
                .catch(err => {
                    toast({
                        message: 'Error fetching medication ' + err,
                        type: 'is-danger',
                        dismissible: true,
                        pauseOnHover: true,
                    })
                })
        } else {
            setShowPanel(false)
            await setFacilities([])
        }
    }

    const handlecloseModal = () => {
        setProductModal(false)
        handleSearch(val)
    }

    useEffect(() => {
        if (clear) {
            console.log('success has changed', clear)
            setSimpa('')
        }
        return () => {}
    }, [clear])

    return (
        <div>
            <Autocomplete
                size="small"
                value={simpa}
                onChange={(event, newValue, reason) => {
                    if (reason === 'clear') {
                        setSimpa('')
                    } else {
                        if (typeof newValue === 'string') {
                            // timeout to avoid instant validation of the dialog's form.
                            setTimeout(() => {
                                handleAddproduct()
                            })
                        } else if (newValue && newValue.inputValue) {
                            handleAddproduct()
                        } else {
                            handleRow(newValue)
                        }
                    }
                }}
                id="free-solo-dialog-demo"
                options={facilities}
                getOptionLabel={option => {
                    if (typeof option === 'string') {
                        return option
                    }
                    if (option.inputValue) {
                        return option.inputValue
                    }
                    return option.medication
                }}
                isOptionEqualToValue={(option, value) =>
                    value === undefined ||
                    value === '' ||
                    option._id === value._id
                }
                onInputChange={(event, newInputValue) => {
                    handleSearch(newInputValue)
                }}
                filterOptions={(options, params) => {
                    const filtered = options.filter(option =>
                        option.medication
                            .toLowerCase()
                            .includes(params.inputValue.toLowerCase()),
                    )

                    if (params.inputValue !== '') {
                        filtered.push({
                            inputValue: params.inputValue,
                            medication: `Use "${params.inputValue}" as Default`,
                        })
                    }

                    return filtered
                }}
                inputValue={val}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                noOptionsText={
                    val !== '' ? `${val} Not Found` : 'Type something'
                }
                renderOption={(props, option) => (
                    <li {...props} style={{ fontSize: '0.75rem' }}>
                        {option.medication}
                    </li>
                )}
                sx={{
                    width: '100%',
                }}
                freeSolo={false}
                renderInput={params => (
                    <TextField
                        {...params}
                        label={label || 'Search for Product'}
                        ref={inputEl}
                        sx={{
                            fontSize: '0.75rem',
                            backgroundColor: '#ffffff',
                            '& .MuiInputBase-input': {
                                height: '0.9rem',
                            },
                        }}
                        InputLabelProps={{
                            shrink: true,
                            style: { color: '#2d2d2d' },
                        }}
                    />
                )}
            />
        </div>
    )
}
