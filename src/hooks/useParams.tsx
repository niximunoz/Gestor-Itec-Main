import { useContext } from 'react'
import { ParamsContext } from 'src/context/ParamsContext'

export const useParams = () => useContext(ParamsContext)
