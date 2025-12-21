import { lazy } from 'react';

const OrganizationSignup = lazy(
  () =>
    import(
      /* webpackChunkName: "org-signup" */
      '../auth/forms/sign-up/sign-up'
    ),
);

const OrganizationSignupWithType = lazy(
  () =>
    import(
      /* webpackChunkName: "org-signup" */
      '../auth/forms/sign-up/sign-up-with-type'
    ),
);

const OrganizationSignupHMO = lazy(
  () =>
    import(
      /* webpackChunkName: "org-signup" */
      '../auth/forms/sign-up/signupHMO'
    ),
);

const ForgotPassword = lazy(() => import('../auth/ForgotPassword'));
const CreatePassword = lazy(() => import('../auth/CreatePassword'));

const Login = lazy(() => import('../auth'));
const Register = lazy(() => import('../auth/Register'));
const Verifying = lazy(() => import('../auth/Verifying'));

export const authRoutes = [
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/register',
    Component: Register,
  },
  {
    path: '/verify',
    Component: Verifying,
  },
  {
    path: '/signup',
    Component: OrganizationSignup,
  },
  /* {
		path: '/signup/corporate',
		Component: OrganizationSignupWithType,
	},
	{
		path: '/signup/corporate/:id',
		Component: OrganizationSignupWithType,
	},*/
  {
    path: '/signup/:type/:id',
    Component: OrganizationSignupHMO,
  },
  {
    path: '/signup/:type',
    Component: OrganizationSignupWithType,
  },
  /* {
		path: '/signup/Individual',
		Component: IndividualSignup,
	},
	{
		path: '/signup/Individual/:id',
		Component: IndividualSignup,
	}, */
  {
    path: '/forgot-password',
    Component: ForgotPassword,
  },
  {
    path: '/create-password',
    Component: CreatePassword,
  },
];
