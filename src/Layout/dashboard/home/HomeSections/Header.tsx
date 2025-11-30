import React from 'react'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { updateActive } from '../../../../../store/stateSlice'
import { RootState } from '../../../../../store'
import { UserRound } from 'lucide-react'

const Header = () => {
    const CDNURL =
      "https://opshqmqagtfidynwftzk.supabase.co/storage/v1/object/public/profile-picture/";
    
    const dispatch = useDispatch()
    const {profilePicture,info, userId } = useSelector((state: RootState) => state.app)
  return (
    <div className="mb-7 px-4 ss:px-8 md:px-0 w-full flex justify-between items-center">
        <div>
          <h1 className="text-2xl ss:text-3xl font-semibold font-karla text-slate-800">
            Hi {info[0]?.name?.split(" ")[0]},
          </h1>
          <p className="text-base text-gray-500">Your health matters!</p>
        </div>
        <button
          onClick={() => dispatch(updateActive("Account"))}
          className="w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer ring-1 ring-gray-400 p-0.5"
          aria-label="View account"
        >
          {profilePicture ? (
            <Image
              key={profilePicture}
              src={CDNURL + userId + "/" + profilePicture}
              width={3000}
              height={3000}
              alt="user"
              quality={100}
              className="size-full object-cover rounded-full"
              priority
            />
          ) : (
            <UserRound
              className="w-full h-full text-navyBlue"
              strokeWidth={1.5}
            />
          )}
        </button>
      </div>
  )
}

export default Header