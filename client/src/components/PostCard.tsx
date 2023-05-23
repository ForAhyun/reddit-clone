import React from 'react'
import { Post } from '../type'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useAuthState } from '../context/auth'
import axios from 'axios'

interface PostCardProps {
    post: Post
    subMutate?: () => void
    mutate?: () => void
}

const PostCard = ({post: {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
    sub
}, mutate, subMutate
}: PostCardProps) => {

    const router = useRouter();
    const isInSubPage = router.pathname === '/r/[sub]';
    const {authenticated} = useAuthState();

    const vote = async(value: number) => {
        if(!authenticated) router.push("/login");

        if(value === userVote) value = 0;

        try {
            await axios.post("/votes", {identifier, slug, value});
            if(mutate) mutate();
            if(subMutate) subMutate();
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div className='flex mb-4 bg-white rounded'
        id={identifier}
    >
        {/** 좋아요 싫어요 기능 부분 */}
        <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                                {/** 좋아요 */}
                                <div
                                    className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hove:bg-gray-300 hover:text-red-500"
                                    onClick={() => vote(1)}
                                >
                                 {userVote === 1 ? 
                                    <FaArrowUp className="text-red-500"/>
                                    : <FaArrowUp/>    
                                }
                                </div>
                                <p className="text-xs font-bold">{voteScore}</p>
                                {/** 싫어요 */}
                                <div
                                    className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hove:bg-gray-300 hover:text-blue-500"
                                    onClick={() => vote(-1)}
                                >
                                    {userVote === -1 ? 
                                    <FaArrowDown className="text-blue-500"/>
                                    : <FaArrowDown/>    
                                }
                                </div>
                            </div>
                                {/** 포스트 데이터 부분 */}
                                <div className='w-full p-2'>
                                    <div className='flex items-center'>
                                    {!isInSubPage && (
                                        <div className='flex items-center'>
                                            <Link href={`/r/${subName}`}>
                                             <p>
                                                <Image
                                                    src={sub!.imageUrl}
                                                    alt="sub"
                                                    className="rounded-full cursor-pointer"
                                                    width={12}
                                                    height={12}
                                                />
                                            </p>
                                            </Link>
                                            <Link href={`/r/${subName}`}>
                                                <p className='ml-2 text-xs font-bold cursor-pointer hover:underline'>
                                                    /r/{subName}
                                                </p>
                                            </Link>
                                            <span className='mx-1 text-xs text-gray-400'></span>
                                        </div>
                                    )}
                                    
                                    <p className='text-xs text-gray-400'>
                                        Posted by
                                        <Link href={`/u/${username}`}>
                                            <span className='mx-1 hover:underline'>/u/{username}</span>
                                        </Link>
                                        <Link href={url}>
                                            <span className='mx-1 hover:underline'>
                                                {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
                                            </span>
                                        </Link>
                                    </p>
                                    </div>
                                <Link href={url}>
                                    <p className='my-1 text-lg font-medium'>{title}</p>
                                </Link>
                                {body && <p className='my-1 text-sm'></p>}
                                <div className='flex'>
                                    <Link href={url}>
                                        <p>
                                            <i className='mr-1 fas fa-comment-alt fa-xs'></i>
                                            <span>{commentCount}</span>
                                        </p>
                                    </Link>
                                </div>
                            </div>
                            
    </div>
  )
}

export default PostCard