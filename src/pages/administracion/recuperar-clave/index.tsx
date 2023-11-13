import { Card } from '@mui/material'
import { ReactNode } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { CardRecoveryEmailPassword } from 'src/components/administracion'


const Index = () => {
    return (
        <Card>
            <CardRecoveryEmailPassword />
        </Card>
    )
}

Index.guestGuard = true
Index.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Index