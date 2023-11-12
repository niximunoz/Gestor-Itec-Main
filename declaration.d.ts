declare module 'react-to-pdf'
declare module 'react-beautiful-dnd'

declare module 'next' {
    export declare type NextPage<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P> & {
      acl?: ACLObj
      authGuard?: boolean
      guestGuard?: boolean
      setConfig?: () => void
      getLayout?: (page: ReactElement) => ReactNode
    }
  }