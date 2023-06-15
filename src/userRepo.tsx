import { FC, useEffect, useState } from 'react'
import { ReactComponent as BackImg } from '@media/Arrow-left.svg'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import emptyImg from '@media/empty-box.png'
import star from '@media/Star.svg'
import octo from './octo'
import qs from 'qs'
import { CardLoader } from '@components/loader'

interface RepoProps {
  loading?: boolean
  items?: Array<any>
}

const UserCard: FC<any> = () => {
  const navigate = useNavigate()
  const { user: username } = useParams()
  const [params]: any = useSearchParams()
  let { avatar }: any = qs.parse(params?.toString())
  avatar = avatar ? window.atob(avatar) : avatar
  return (
    <div className='position-absolute top-0 start-0 w-100 p-2 bg-primary text-white'>
      <div className='d-flex align-items-center cursor-pointer' onClick={() => navigate(-1)}>
        <BackImg />
        <div
          className='border ms-2'
          style={{
            width: 35,
            height: 35,
            borderRadius: 35,
            background: `#fff url(${avatar}) center / cover no-repeat`,
          }}
        />
        <div className='ms-3 text-capitalize fw-bold fs-5'>{username}</div>
      </div>
    </div>
  )
}

const Repos: FC<RepoProps> = ({ loading, items }) => {
  return (
    <div className='overflow-auto' style={{ height: 400 }}>
      {loading ? (
        <CardLoader height={35} className='mt-2 mb-3' />
      ) : items?.length === 0 ? (
        <div className='d-flex align-items-center justify-content-center' style={{ height: 350 }}>
          <div className='text-center opacity-50'>
            <img src={emptyImg} height={100} alt='' />
            <div className='mt-3 opacity-75 fw-light fs-7'>No repositories !!!</div>
          </div>
        </div>
      ) : (
        <div className='row m-0'>
          {items?.map(({ name, description, forks_count }: any, key: number) => (
            <div className='col-12 mb-3' key={key}>
              <div className='border rounded p-3' style={{ backgroundColor: '#f9f9f9' }}>
                <div className='row'>
                  <div className='col fw-bold fs-7 text-break'>{name}</div>
                  {Boolean(forks_count) && (
                    <div className='col-auto d-flex align-items-center fw-bold fs-7'>
                      <span>{forks_count}</span>
                      <img src={star} height={15} alt='' />
                    </div>
                  )}
                </div>
                <div className='fw-light fs-7 mt-2 text-break'>{description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const Index: FC = () => {
  const { user: username } = useParams()
  const [loading, setLoading] = useState<boolean>(false)
  const [repos, setRepos] = useState<any>([])
  useEffect(() => {
    setLoading(true)
    if (username) {
      octo(`users/${username}/repos`, { q: username, type: 'all' })
        .then(({ data }: any) => {
          setRepos(
            data?.map(({ name, description, forks_count }: any) => ({
              name,
              description,
              forks_count,
            }))
          )
        })
        .catch(() => setRepos([]))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
      setRepos({})
    }
  }, [username])
  return (
    <div className='pt-5'>
      <UserCard data={{ name: 'haha' }} />
      <Repos loading={loading} items={repos} />
    </div>
  )
}

export default Index
