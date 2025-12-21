import { lazy } from 'react'
const EnquiryMgt = lazy(() => import('../ART/EnquiryMgt'))
const ProfileMgt = lazy(() => import('../ART/ProfileMgt'))
const ProcedureMgt = lazy(() => import('../ART/ProcedureMgt'))
const Appointment = lazy(() => import('../ART/Appointment'))
const Report = lazy(() => import('../ART/Report'))
const ArtDashboard = lazy(
    () => import('../dashBoardUiComponent/@modules/ArtDashboard'),
)
const Documentation = lazy(() => import('../Documentation/Documentation'))
const PrescriptionMgt = lazy(() => import('../ART/PrescriptionMgt'))
const LaboratoryMgt = lazy(() => import('../ART/LaboratoryMgt'))
const Task = lazy(() => import('../ART/Task'))
const CareTeam = lazy(() => import('../ART/CareTeam'))

export const artRoutes = [
    {
        path: '/app/art/dashboard',
        Component: ArtDashboard,
    },
    {
        path: '/app/art/documentation',
        Component: Documentation,
    },
    {
        path: '/app/art/profile-mgt',
        Component: ProfileMgt,
    },
    {
        path: '/app/art/lab-mgt',
        Component: LaboratoryMgt,
    },
    {
        path: '/app/art/enquiry-mgt',
        Component: EnquiryMgt,
    },
    {
        path: '/app/art/prescription-mgt',
        Component: PrescriptionMgt,
    },
    {
        path: '/app/art/procedure-mgt',
        Component: ProcedureMgt,
    },
    {
        path: '/app/art/appointment',
        Component: Appointment,
    },
    {
        path: '/app/art/report',
        Component: Report,
    },
    {
        path: '/app/art/task',
        Component: Task,
    },
    {
        path: '/app/art/care-team',
        Component: CareTeam,
    },
]
