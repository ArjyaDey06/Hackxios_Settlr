import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const Property = mongoose.model('Property', new mongoose.Schema({}, { strict: false }));
    const count = await Property.countDocuments();
    const properties = await Property.find().limit(3);
    
    console.log(`📊 Total properties: ${count}`);
    console.log('📝 Sample data:', JSON.stringify(properties, null, 2));
    
    process.exit();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
