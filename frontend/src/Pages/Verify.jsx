import React, { useContext, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import axios from 'axios'

const Verify = () => {

    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
    const [searchParams] = useSearchParams()

    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')

    const verifyPayment = async () => {
        try {
            if (!token) {
                return
            }

            const response = await axios.post(
                backendUrl + '/api/order/verifyStripe',
                { success, orderId },
                { headers: { token } }
            )

            if (response.data.success) {
                setCartItems({})
                navigate('/orders')
            } else {
                navigate('/cart')
            }

        } catch (error) {
            console.log(error)
            navigate('/cart')
        }
    }

    useEffect(() => {
        verifyPayment()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    return (
        <div className='flex items-center justify-center min-h-[50vh]'>
            <p className='text-gray-500'>Verifying your payment, please wait...</p>
        </div>
    )
}

export default Verify