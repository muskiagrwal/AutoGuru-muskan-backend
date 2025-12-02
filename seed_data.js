require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Mechanic = require('./models/Mechanic');
const Vehicle = require('./models/Vehicle');
const Quote = require('./models/Quote');
const Review = require('./models/Review');
const Booking = require('./models/Booking');

const seedDatabase = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Create a Test User (Customer)
        console.log('Creating Test Customer...');
        let customer = await User.findOne({ email: 'customer@test.com' });
        if (!customer) {
            customer = await User.create({
                firstName: 'Test',
                lastName: 'Customer',
                email: 'customer@test.com',
                password: 'password123' // In real app this would be hashed
            });
        }

        // 2. Create a Test User (Mechanic)
        console.log('Creating Test Mechanic User...');
        let mechanicUser = await User.findOne({ email: 'mechanic@test.com' });
        if (!mechanicUser) {
            mechanicUser = await User.create({
                firstName: 'Mike',
                lastName: 'Mechanic',
                email: 'mechanic@test.com',
                password: 'password123'
            });
        }

        // 3. Create Mechanic Profile
        console.log('Creating Mechanic Profile...');
        let mechanicProfile = await Mechanic.findOne({ userId: mechanicUser._id });
        if (!mechanicProfile) {
            mechanicProfile = await Mechanic.create({
                userId: mechanicUser._id,
                businessName: "Mike's Auto Repair",
                phone: "0400123456",
                address: {
                    street: "123 Workshop Rd",
                    suburb: "Mechanicville",
                    state: "NSW",
                    postcode: "2000"
                },
                servicesOffered: ["Logbook Service", "Brake Repairs", "Diagnostics"],
                location: {
                    type: "Point",
                    coordinates: [151.2093, -33.8688]
                },
                isVerified: true
            });
        }

        // 4. Create a Vehicle
        console.log('Creating Vehicle...');
        let vehicle = await Vehicle.findOne({ registration: 'TEST01' });
        if (!vehicle) {
            vehicle = await Vehicle.create({
                userId: customer._id,
                make: "Toyota",
                model: "Corolla",
                year: 2020,
                registration: "TEST01",
                vin: "ABC123456789"
            });
        }

        // 5. Create a Quote
        console.log('Creating Quote...');
        const quote = await Quote.create({
            userId: customer._id,
            mechanicId: mechanicProfile._id,
            vehicleId: vehicle._id,
            serviceType: "Logbook Service",
            description: "40,000km service needed",
            status: "Quoted",
            quotedPrice: { amount: 250 },
            estimatedDuration: "2 hours"
        });

        // 6. Create a Booking (Linked)
        console.log('Creating Booking...');
        const booking = await Booking.create({
            userId: customer._id,
            mechanicId: mechanicProfile._id,
            vehicleId: vehicle._id,
            quoteId: quote._id,
            serviceType: "Logbook Service",
            vehicleMake: "Toyota",
            vehicleModel: "Corolla",
            location: "123 Workshop Rd, Mechanicville",
            date: "2025-12-05",
            time: "09:00",
            price: "250",
            status: "Completed"
        });

        // 7. Create a Review
        console.log('Creating Review...');
        await Review.create({
            userId: customer._id,
            mechanicId: mechanicProfile._id,
            bookingId: booking._id,
            rating: 5,
            comment: "Great service, very quick!",
            isVerified: true
        });

        console.log('\nDatabase Seeded Successfully!');
        console.log('You should now see the following new collections in MongoDB Compass:');
        console.log('- mechanics');
        console.log('- vehicles');
        console.log('- quotes');
        console.log('- reviews');

        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedDatabase();
