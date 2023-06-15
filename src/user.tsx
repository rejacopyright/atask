import { ChangeEvent, ChangeEventHandler, FC, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import octo from './octo'
import { UserListLoader } from '@components/loader'
import emptyImg from '@media/empty-box.png'
import { ReactComponent as PrevImg } from '@media/Arrow-right.svg'
import { useNavigate, useSearchParams } from 'react-router-dom'
import qs from 'qs'

interface SearchboxProps {
  onChange?: ChangeEventHandler
  loading?: boolean
  defaultValue?: string
}
interface UserListProps {
  items?: Array<any>
  loading?: boolean
}

const Searchbox: FC<SearchboxProps> = ({ onChange, loading = false, defaultValue = '' }) => {
  const [val, setVal] = useState<string>('')
  useEffect(() => {
    setVal(defaultValue)
  }, [defaultValue])
  return (
    <>
      <div className='form-group position-relative'>
        <input
          type='text'
          defaultValue={val}
          className='form-control'
          placeholder='Enter username'
          onChange={onChange}
        />
        {loading && (
          <div className='position-absolute end-0 bottom-0 pb-2 pe-3'>
            <span className='spinner-border spinner-border-sm border-2 opacity-25'></span>
          </div>
        )}
      </div>
      {/* <button type='button' className='btn w-100 btn-primary'>
        Search
      </button> */}
    </>
  )
}

const UserCard: FC<any> = ({ data }) => {
  const { avatar_url: avatar, login: name } = data || {}
  const navigate = useNavigate()
  const [isHover, setIsHover] = useState<boolean>(false)
  return (
    <div
      onClick={() =>
        navigate({ pathname: `/${name}`, search: qs.stringify({ avatar: window.btoa(avatar) }) })
      }
      className='col-12 py-3 cursor-pointer bg-hover-primary text-hover-white'
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className='d-flex align-items-center'>
        <div
          className='border'
          style={{
            width: 30,
            height: 30,
            borderRadius: 30,
            background: `#fff url(${avatar}) center / cover no-repeat`,
          }}
        />
        <div className='ms-3 text-capitalize fw-bold fs-7 text-break'>{name}</div>
        {isHover && (
          <div className='ms-auto'>
            <PrevImg />
          </div>
        )}
      </div>
    </div>
  )
}

const UserList: FC<UserListProps> = ({ items, loading = false }) => {
  if (loading) {
    return <UserListLoader className='my-2' height={40} count={5} />
  } else if (items?.length === 0) {
    return (
      <div className='d-flex align-items-center justify-content-center' style={{ height: 300 }}>
        <div className='text-center opacity-50'>
          <img src={emptyImg} height={100} alt='' />
          <div className='mt-3 opacity-75 fw-light fs-7'>No user found !!!</div>
        </div>
      </div>
    )
  }
  return (
    <div className='row m-0 zebra'>
      {items?.map((item: any, key: number) => (
        <UserCard data={item} key={key} />
      ))}
    </div>
  )
}

const Index: FC = () => {
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [users, setUsers] = useState<any>([])
  const [userLoading, setUserLading] = useState<boolean>(false)
  const [searchParams, setSearchParams]: any = useSearchParams({ q: '' })
  const { q: keyword }: any = qs.parse(searchParams?.toString()) || {}

  const onSearch = debounce(
    ({ target: { value } }: Event & { target: HTMLInputElement }) => {
      setSearchParams({ q: value }, { replace: true })
      setSearchLoading(false)
    },
    1500,
    { leading: false, trailing: true }
  )

  useEffect(() => {
    setUserLading(true)
    if (keyword) {
      octo('search/users', { q: keyword, per_page: 5 })
        .then(({ data: { items } }: any) => {
          setUsers(items)
        })
        .catch(() => setUsers([]))
        .finally(() => setUserLading(false))
    } else {
      setUserLading(false)
      setUsers([])
    }
  }, [keyword])

  return (
    <>
      <Searchbox
        defaultValue={keyword}
        loading={searchLoading}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const val = e?.target?.value
          if (val) {
            setSearchLoading(true)
            onSearch(e)
          } else {
            setSearchParams({ q: '' }, { replace: true })
            setSearchLoading(false)
            setUserLading(false)
            setUsers([])
          }
        }}
      />
      <div className='d-flex align-items-center justify-content-end fs-8' style={{ height: 30 }}>
        {keyword && (
          <i>
            Showing user for <span className='fw-bold'>&ldquo;{keyword}&rdquo;</span>
          </i>
        )}
      </div>
      <div className='overflow-auto w-100 mt-3' style={{ height: 350 }}>
        <UserList items={users} loading={userLoading} />
      </div>
    </>
  )
}

export default Index
