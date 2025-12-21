/* eslint-disable */
import React from 'react'
import { Box, Grid } from '@mui/material'
import TheatreRequestList from './TheatreRequest/TheatreList'
import TheatreCreate from './TheatreRequest/TheatreCreate'

export default function TheatreRequest({ closeModal }) {
    return (
        <Box
            sx={{
                width: '70vw',
                maxHeight: '80vh',
            }}
        >
            <Grid container spacing={2}>
                {/* <Grid item xs={6}>
          <TheatreRequestList />
        </Grid> */}
                <Grid item xs={12}>
                    <TheatreCreate closeModal={closeModal} />
                </Grid>
            </Grid>
        </Box>
    )
}
