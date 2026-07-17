import mongoose from "mongoose"
import dns from "dns"

// Force Node's own DNS resolver to use Google's DNS servers.
// Fixes ECONNREFUSED on the SRV lookup that some networks/firewalls
// cause when Node's default resolver (c-ares) differs from the OS resolver.
dns.setServers(['8.8.8.8', '8.8.4.4'])

const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log("DB Connected")
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`)
}

export default connectDB