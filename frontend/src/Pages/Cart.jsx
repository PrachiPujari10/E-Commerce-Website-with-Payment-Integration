import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Title from '../Components/Title'
import { assets } from '../assets/frontend_assets/assets'
import CartTotal from '../Components/CartTotal'

const Cart = () => {

    const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext)
    const [cartData, setCartData] = useState([])

    useEffect(() => {
        const tempData = []
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                if (cartItems[itemId][size] > 0) {
                    tempData.push({
                        _id: itemId,
                        size: size,
                        quantity: cartItems[itemId][size]
                    })
                }
            }
        }
        setCartData(tempData)
    }, [cartItems])

    return (
        <div className='border-t pt-14'>

            <div className='text-2xl mb-3'>
                <Title text1={'YOUR'} text2={'CART'} />
            </div>

            <div>
                {cartData.length === 0 && (
                    <p className='text-gray-500 py-10 text-center'>Your cart is empty.</p>
                )}

                {cartData.map((item) => {
                    const productData = products.find((product) => product._id === item._id)

                    if (!productData) return null

                    return (
                        <div key={`${item._id}-${item.size}`} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                            <div className='flex items-start gap-6'>
                                <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                                <div>
                                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                                    <div className='flex items-center gap-5 mt-2'>
                                        <p>{currency}{productData.price}</p>
                                        <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center border max-w-24 sm:max-w-28'>
                                <button
                                    onClick={() => updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))}
                                    className='px-2 py-1 text-lg'
                                    type='button'
                                >
                                    -
                                </button>
                                <input
                                    onChange={(e) => {
                                        const val = e.target.value
                                        if (val === '' ) return
                                        const num = Number(val)
                                        if (num > 0) updateQuantity(item._id, item.size, num)
                                    }}
                                    className='w-10 text-center outline-none'
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                />
                                <button
                                    onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                    className='px-2 py-1 text-lg'
                                    type='button'
                                >
                                    +
                                </button>
                            </div>
                            <img
                                onClick={() => updateQuantity(item._id, item.size, 0)}
                                className='w-4 mr-4 sm:w-5 cursor-pointer'
                                src={assets.bin_icon}
                                alt=""
                            />
                        </div>
                    )
                })}
            </div>

            <div className='flex justify-end my-20'>
                <div className='w-full sm:w-[450px]'>
                    <CartTotal />

                    <div className='w-full text-end'>
                        <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart