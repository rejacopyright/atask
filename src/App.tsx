import { FC } from 'react'
import { Outlet } from 'react-router-dom'

const App: FC = () => {
  return (
    <div className='container-fluid vh-100'>
      <div className='row justify-content-center align-items-center h-100'>
        <div className='col col-sm-6 col-md-6 col-lg-4'>
          <div className='border p-3 rounded position-relative' style={{ height: 500 }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
