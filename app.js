// Bring in env
require('dotenv').config();

// Use Lob wrapper
const Lob = require('lob')(process.env.LIVE_KEY);

// Validate an address
// Shape of argument object: {primary_line, city, state, zip_code} (all strings)
const validateAddress = () => {
  // Ask for info using helper function
  console.log('Please enter address information to verify');
  const address = getInput(['primary_line', 'city', 'state', 'zip_code']);

  // Verify via API wrapper
  Lob.usVerifications.verify(address, function (err, res) {
    console.log(err, res);
  });
};

// Gets input from command line
// Takes array of strings representing field names
// Returns object with key: val pairs in format field: response
const getInput = fields => {
  // Take command line input
  const readline = require('readline-sync');

  // Object to hold output
  const result = {};

  // Iterate over fields
  fields.forEach(field => {
    // Ask the question and remember the answer
    const response = readline.question(`${field}: `);
    // Save answer in return object
    result[field] = response;
  });

  // Give back the newly-populated object
  return result;
};

validateAddress({ primary_line: '646 Fernbrook Lane', zip_code: '75672' });

// Close connection
// readline.close();
