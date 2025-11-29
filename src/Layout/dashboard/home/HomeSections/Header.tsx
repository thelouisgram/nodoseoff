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
    <div className="mb-[28px] px-4 ss:px-8 md:px-0 w-full flex justify-between items-center">
        <div>
          <h1 className="text-[24px] ss:text-[32px] font-semibold capitalize">
            Hi {info[0]?.name?.split(" ")[0]},
          </h1>
          <p className="text-[16px] text-grey">Your health matters!</p>
        </div>
        <button
          onClick={() => dispatch(updateActive("Account"))}
          className="w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer ring-2 ring-navyBlue p-0.5"
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