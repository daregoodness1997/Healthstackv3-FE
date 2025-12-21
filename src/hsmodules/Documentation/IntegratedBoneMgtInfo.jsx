import React, { useState, useRef } from 'react';
import { Box, Tabs, Tab, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import GlobalCustomButton from '../../components/buttons/CustomButton';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function IntegratedBoneMgtInfo() {
    const [value, setValue] = useState(0);
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', pr: 2 }}>
                <Tabs value={value} onChange={handleChange} aria-label="integrated bone management tabs" variant="scrollable" scrollButtons="auto">
                    <Tab label="Investigation" {...a11yProps(0)} />
                    <Tab label="A. Osteoporosis" {...a11yProps(1)} />
                    <Tab label="B. Osteomalacia / Osteopenia" {...a11yProps(2)} />
                    <Tab label="C. Osteoarthritis (OA)" {...a11yProps(3)} />
                </Tabs>
                <GlobalCustomButton
                    label="Print"
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    sx={{ height: 'fit-content' }}
                >
                    Print
                </GlobalCustomButton>
            </Box>

            <div ref={componentRef} style={{ padding: '20px' }}>
                {/* Investigation Tab */}
                <div style={{ display: value === 0 ? 'block' : 'none' }}>
                    <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                        INVESTIGATIONS
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }} aria-label="investigations table">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Tests</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Purpose</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Interpretation</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>X-Ray</TableCell>
                                    <TableCell>Initial Imaging</TableCell>
                                    <TableCell>
                                        Detects joint space narrowing and osteophytes (Osteoarthritis)<br />
                                        Looser’s zones (Osteomalacia)<br />
                                        Fragility Fractures (Osteoporosis)
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Dual Energy X-Ray Absorptiometer (DEXA)</TableCell>
                                    <TableCell>Gold Standard for Bone Mineral Content/Bone Mineral Density</TableCell>
                                    <TableCell>
                                        T-Score<br />
                                        ≤ -2.5 (Osteoporosis)<br />
                                        -1.0 to -2.5 (Osteomalacia/Osteopenia)
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>CT Scan/MRI</TableCell>
                                    <TableCell>Advanced Imaging</TableCell>
                                    <TableCell>
                                        Detects articular cartilage loss/damage<br />
                                        Detects bone marrow oedema<br />
                                        Detects subchondral bone changes<br />
                                        Assists with Surgical Planning
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Serum Calcium<br />
                                        Serum Phosphate<br />
                                        Serum Alkaline Phosphatase (ALP)
                                    </TableCell>
                                    <TableCell>Bone Profile Assessment</TableCell>
                                    <TableCell>
                                        Low Calcium & High ALP = Osteomalacia
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Vitamin D (25-OH)</TableCell>
                                    <TableCell>Confirms Deficiency</TableCell>
                                    <TableCell>&lt; 20ng/mL confirms Vitamin D Deficiency</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Parathyroid Hormone (PTH)</TableCell>
                                    <TableCell>
                                        Renal Functions<br />
                                        Thyroid Function Test (TFT)<br />
                                        Identify Secondary Causes
                                    </TableCell>
                                    <TableCell>Elevated PTH in Secondary Hyperparathyroidism</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Bone Biopsy</TableCell>
                                    <TableCell>For Doubtful Cases</TableCell>
                                    <TableCell>Confirm by histological examination</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                {/* Osteoporosis Tab */}
                <div style={{ display: value === 1 ? 'block' : 'none' }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        A. Osteoporosis
                    </Typography>

                    <Box mb={3}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Goals of Treatment:</Typography>
                        <ul>
                            <li>Prevent Fragility Fractures</li>
                            <li>Increase Bone Mineral Density</li>
                            <li>Reduce pain</li>
                        </ul>
                    </Box>

                    <Box mb={3}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Management:</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Lifestyle Adjustment</Typography>
                                <ul>
                                    <li>Weight bearing exercise</li>
                                    <li>Cessation of smoking (For smokers)</li>
                                    <li>Moderate alcohol consumption</li>
                                    <li>Prevention of Falls</li>
                                </ul>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Nutrition Support</Typography>
                                <ul>
                                    <li>Calcium requirement 1000 – 1200 mg/day</li>
                                    <li>Vitamin D requirement 800 – 1000 IU/day</li>
                                </ul>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Pharmacotherapy</Typography>
                                <ul>
                                    <li>Biphosphonate (For example Alendronic Acid)</li>
                                    <li>Denosumab</li>
                                    <li>Teriparatide</li>
                                </ul>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Monitoring</Typography>
                                <ul>
                                    <li>Dual Energy X-Ray Absorptiometer Scan every 1-2 years</li>
                                </ul>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Surgery</Typography>
                                <ul>
                                    <li>Vertebroplasty for collapsed vertebrae</li>
                                    <li>Fixation of fractures (For example wrist or neck of femur fractures)</li>
                                </ul>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Rehabilitation</Typography>
                                <ul>
                                    <li>Physiotherapy</li>
                                    <li>Posture correction</li>
                                    <li>Weight Bearing Exercises</li>
                                </ul>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Outcome Measures for Osteoporosis</Typography>
                        <Typography variant="body2">Follow-up DEXA scans at 6 months or 12 months in mild cases</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}><strong>Key Outcome Indicator:</strong></Typography>
                        <ul>
                            <li>Improvement in T-Score</li>
                            <li>Reduction in Fractures</li>
                        </ul>
                    </Box>
                </div>

                {/* Osteomalacia / Osteopenia Tab */}
                <div style={{ display: value === 2 ? 'block' : 'none' }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        B. Osteomalacia / Osteopenia
                    </Typography>

                    <Box mb={3}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Goals of Treatment:</Typography>
                        <ul>
                            <li>Correct underlying deficiency</li>
                            <li>Restore bone mineralization</li>
                        </ul>
                    </Box>

                    <Box mb={3}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Management:</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Treat Underlying Disease</Typography>
                                <ul>
                                    <li>Nutritional Deficiency</li>
                                    <li>Malabsorption</li>
                                    <li>Renal Phosphate Wasting</li>
                                    <li>(Appropriate laboratory investigations)</li>
                                </ul>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Vitamin D Supplement</Typography>
                                <ul>
                                    <li>50,000IU weekly for 6-8 weeks</li>
                                    <li>800-1000IU daily as maintenance</li>
                                    <li>Medication can be oral or intramuscular</li>
                                </ul>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Calcium Supplement</Typography>
                                <ul>
                                    <li>1-1.5 gr daily (In combination with Vitamin D)</li>
                                </ul>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Laboratory Evaluation</Typography>
                                <ul>
                                    <li>Calcium assay</li>
                                    <li>Phosphate assay</li>
                                    <li>Alkaline Phosphatase assay</li>
                                    <li>Vitamin D assay</li>
                                    <li>(Investigations to be carried out every 3 months)</li>
                                </ul>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Surgery</Typography>
                                <ul>
                                    <li>Osteotomies for bony deformities</li>
                                </ul>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Physiotherapy</Typography>
                                <ul>
                                    <li>Muscle strengthening exercises</li>
                                    <li>Gait retraining</li>
                                    <li>Fall prevention</li>
                                </ul>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Outcome Measures for Osteomalacia</Typography>
                        <Typography variant="body2">Follow-up biochemical assessment every 3 months</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}><strong>Key Outcome Indicator:</strong></Typography>
                        <ul>
                            <li>Improvement in Pain scores (Using the Visual Analogue Scale)</li>
                            <li>Improvement in strength</li>
                        </ul>
                    </Box>
                </div>

                {/* Osteoarthritis (OA) Tab */}
                <div style={{ display: value === 3 ? 'block' : 'none' }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        C. Osteoarthritis (OA)
                    </Typography>

                    <Box mb={3}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Goals of Treatment:</Typography>
                        <ul>
                            <li>Pain Relief</li>
                            <li>Joint functional improvement</li>
                            <li>Joint preservation</li>
                            <li>Correction of joint deformities</li>
                        </ul>
                    </Box>

                    <Box mb={3}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Management:</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Non-Pharmacological</Typography>
                                <ul>
                                    <li>Physiotherapy</li>
                                    <li>Muscle Strengthening Exercises</li>
                                    <li>Range-Of-Motion Exercises</li>
                                    <li>Gait Retraining</li>
                                    <li>Weight Reduction</li>
                                    <li>Assistive devices</li>
                                </ul>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Pharmacological</Typography>
                                <ul>
                                    <li>Paracetamol</li>
                                    <li>Non-Steroidal Anti-Inflammatory medications</li>
                                    <li>Intra-Articular Steroid Injection</li>
                                    <li>Intra-Articular Hyaluronic Acid Injection</li>
                                </ul>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Advanced (Current Therapies)</Typography>
                                <ul>
                                    <li>Platelet Rich Plasma (PRP)</li>
                                    <li>Stem Cell Injection (In selected cases and still experimental)</li>
                                </ul>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Surgery</Typography>
                                <ul>
                                    <li>Corrective Osteotomies in selected cases</li>
                                    <li>Joint Replacement Surgeries (Arthroplasties) (For failed non-operative methods)</li>
                                </ul>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Post Operative Physiotherapy</Typography>
                                <ul>
                                    <li>Gait retraining exercises</li>
                                    <li>Muscle strengthening exercises</li>
                                    <li>Range of motion exercises</li>
                                </ul>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Outcome Measures for Osteoarthritis</Typography>
                        <Typography variant="body2">Follow-up every 3 – 6 months</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}><strong>Key Outcome Indicator:</strong></Typography>
                        <ul>
                            <li>Improvement in joint pain (Using the Visual Analogue Scale)</li>
                            <li>Improvement in joint functional mobility (Using various scoring system e.g. WOMAC Scoring System)</li>
                        </ul>
                    </Box>
                </div>
            </div>
        </Box>
    );
}
