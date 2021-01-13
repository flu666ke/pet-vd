import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { MainLayout } from '../../components/MainLayout'

export default function Post({ post: serverPost }: any) {
  const router = useRouter()

  console.log({ router })

  const [post, setPost] = useState(serverPost)

  useEffect(() => {
    async function load() {
      const response = await fetch('http://localhost:5000/vehicles')
      const json = await response.json()
      setPost(json[Number(router.query.id) - 1])
    }


    if (!serverPost) {

      load()
    }
  }, [])

  if (!post) {
    return <MainLayout>
      <p>Loading...</p>
    </MainLayout>
  }

  return (
    <MainLayout>
      <h1>Post {post.vehicle}</h1>
      <p>{post.ownerName}</p>
    </MainLayout>
  )
}

// Post.getInitialProps = async ({ query, req }: any) => {

//   if (!req) {
//     return { post: null }
//   }


//   const response = await fetch(`http://localhost:5000/vehicles`)
//   const posts = await response.json()

//   return {
//     post: posts[query.id - 1]
//   }
// }

interface PostNextPageContext extends NextPageContext {
  query: {
    id: string
  }
}

export async function getServerSideProps({ query, req }: PostNextPageContext) {

  if (!req) {
    return { post: null }
  }

  const response = await fetch(`http://localhost:5000/vehicles`)
  const posts = await response.json()

  return {
    props: {

      post: posts[Number(query.id) - 1]
    }
  }
}