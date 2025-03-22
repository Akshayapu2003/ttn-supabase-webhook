const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = https://kzpgnmzyxxcnqrbrtnyp.supabase.co;
const supabaseKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6cGdubXp5eHhjbnFyYnJ0bnlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTY4MTU1NCwiZXhwIjoyMDU3MjU3NTU0fQ.FJE9TKxDHV3BP6LSLlmYfgo4FTaXdSiKd_XLSr7Rqik;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // For debugging - log the entire request body
  console.log('Received webhook data:', JSON.stringify(req.body));

  try {
    // Extract the decoded payload from TTN
    // The exact structure may vary depending on your TTN setup
    const { uplink_message } = req.body;
    
    if (!uplink_message || !uplink_message.decoded_payload) {
      console.error('Invalid payload structure:', JSON.stringify(req.body));
      return res.status(400).json({ error: 'Invalid payload structure' });
    }
    
    // Get the decoded data
    const sensorData = uplink_message.decoded_payload;
    console.log('Sensor data to insert:', JSON.stringify(sensorData));
    
    // Insert the data into your Supabase table
    const { data, error } = await supabase
      .from('sensor_data')
      .insert([sensorData]);
    
    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log('Data successfully inserted into Supabase');
    
    // Return success response
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: error.message });
  }
};
