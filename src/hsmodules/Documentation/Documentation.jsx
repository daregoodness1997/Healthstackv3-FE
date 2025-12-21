/* eslint-disable */
import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/documentation.scss'
import ClientList from '../Client/clients/ClientList'
import EncounterMain from './EncounterMain'
import ModalBox from '../../components/modal'
import { ObjectContext } from '../../context'
import { Box } from '@mui/material'
import PatientProfile from '../Client/PatientProfile'

export default function Documentation({ standalone }) {
    const { state, setState } = useContext(ObjectContext)
    const [selectedClient, setSelectedClient] = useState()
    const [showModal, setShowModal] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            if (
                Object.keys(state.ClientModule?.selectedClient)?.length === 0 &&
                state.ClientModule?.selectedClient.constructor === Object
            ) {
                let patient = await JSON.parse(localStorage.getItem('client'))
                //need to check for employee location
                if (patient?._id) {
                    await setState(prev => ({
                        ...prev,
                        ClientModule: {
                            ...prev.ClientModule,
                            selectedClient: patient,
                        },
                    }))
                    setSelectedClient(patient)
                }
            } else {
                console.log(' iam here')
                // return navigate("/app");
            }
        }

        fetchData()
        const newDocumentClassModule = {
            selectedDocumentClass: {},
            show: 'detail',
        }
        setState(prevstate => ({
            ...prevstate,
            DocumentClassModule: newDocumentClassModule,
        }))

        return () => {}
    }, [])

    useEffect(() => {
        setSelectedClient(state.ClientModule.selectedClient)
    }, [state.ClientModule])

    return (
        <section className="section remPadTop" style={{ padding: '15px' }}>
            {!standalone && (
                <Box
                    container
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box
                        item
                        sx={{
                            width: '300px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            paddingRight: '8px',
                        }}
                        mt={1}
                    >
                        <PatientProfile />
                    </Box>
                    {/* )} */}

                    <Box
                        item
                        sx={{
                            width: 'calc(100% - 310px)',
                        }}
                    >
                        <EncounterMain chosenClient={selectedClient} />
                    </Box>
                </Box>
            )}

            {standalone && (
                <div>
                    <EncounterMain
                        chosenClient={selectedClient}
                        nopresc={standalone}
                    />
                </div>
            )}

            <ModalBox
                open={showModal}
                onClose={() => setShowModal(false)}
                header="Choose Client"
            >
                <ClientList standalone="true" />
            </ModalBox>
        </section>
    )
}
