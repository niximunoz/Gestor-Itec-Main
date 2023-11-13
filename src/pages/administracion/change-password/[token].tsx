import { Card } from '@mui/material'
import { ReactNode } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { CardChangePassword } from 'src/components/administracion'



const ChangePasswordPage = () => {
    return (
        <Card>
            <CardChangePassword />
        </Card>
    )
}

ChangePasswordPage.guestGuard = true
ChangePasswordPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ChangePasswordPage
