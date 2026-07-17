// import React, { createContext, useState } from 'react'
// import { products } from '../assets/frontend_assets/assets'
// import { toast } from 'react-toastify'
// import { useNavigate } from 'react-router-dom'

// export const ShopContext = createContext()

// const ShopContextProvider = (props) => {

//     const currency = '$'
//     const delivery_fee = 10
//     const [cartItems, setCartItems] = useState({})
//     const [search, setSearch] = useState('')
//     const [showSearch, setShowSearch] = useState(false)
//     const navigate = useNavigate()

//     const addToCart = async (itemId, size) => {
//         if (!size) {
//             toast.error('Select Product Size')
//             return
//         }

//         let cartData = structuredClone(cartItems)

//         if (cartData[itemId]) {
//             if (cartData[itemId][size]) {
//                 cartData[itemId][size] += 1
//             } else {
//                 cartData[itemId][size] = 1
//             }
//         } else {
//             cartData[itemId] = {}
//             cartData[itemId][size] = 1
//         }
//         setCartItems(cartData)
//         toast.success('Added to Cart')
//     }

//     const getCartCount = () => {
//         let totalCount = 0
//         for (const itemId in cartItems) {
//             for (const size in cartItems[itemId]) {
//                 if (cartItems[itemId][size] > 0) {
//                     totalCount += cartItems[itemId][size]
//                 }
//             }
//         }
//         return totalCount
//     }

//     const updateQuantity = async (itemId, size, quantity) => {
//         let cartData = structuredClone(cartItems)
//         cartData[itemId][size] = quantity
//         setCartItems(cartData)
//     }

//     const getCartAmount = () => {
//         let totalAmount = 0
//         for (const itemId in cartItems) {
//             let itemInfo = products.find((product) => product._id === itemId)
//             for (const size in cartItems[itemId]) {
//                 try {
//                     if (cartItems[itemId][size] > 0) {
//                         totalAmount += itemInfo.price * cartItems[itemId][size]
//                     }
//                 } catch (error) {
//                     console.log(error)
//                 }
//             }
//         }
//         return totalAmount
//     }

//     const value = {
//         products,
//         currency,
//         delivery_fee,
//         search,
//         setSearch,
//         showSearch,
//         setShowSearch,
//         cartItems,
//         addToCart,
//         getCartCount,
//         updateQuantity,
//         getCartAmount,
//         navigate
//     }

//     return (
//         <ShopContext.Provider value={value}>
//             {props.children}
//         </ShopContext.Provider>
//     )
// }

// export default ShopContextProvider

import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const ShopContext = createContext()

const ShopContextProvider = (props) => {

    const currency = '$'
    const delivery_fee = 10
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const navigate = useNavigate()

    // ---- Products ----
    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // ---- Cart ----
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size')
            return
        }

        let cartData = structuredClone(cartItems)

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            } else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        setCartItems(cartData)
        toast.success('Added to Cart')

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                if (cartItems[itemId][size] > 0) {
                    totalCount += cartItems[itemId][size]
                }
            }
        }
        return totalCount
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems)
        cartData[itemId][size] = quantity
        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0
        for (const itemId in cartItems) {
            let itemInfo = products.find((product) => product._id === itemId)
            for (const size in cartItems[itemId]) {
                try {
                    if (cartItems[itemId][size] > 0) {
                        totalAmount += itemInfo.price * cartItems[itemId][size]
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        return totalAmount
    }

    const getUserCart = async (userToken) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token: userToken } })
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // ---- Auth ----
    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
        navigate('/login')
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken,
        logout
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider