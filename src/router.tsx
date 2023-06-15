import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App'
import User from './user'
import UserRepo from './userRepo'

const BrowserRouter: any = () => {
  const routes: any = [
    {
      path: '/*',
      Component: App,
      children: [
        { index: true, Component: User },
        { path: ':user', Component: UserRepo },
      ],
    },
  ]

  const router: any = createBrowserRouter(routes)
  return <RouterProvider router={router} />
}

export { BrowserRouter }
