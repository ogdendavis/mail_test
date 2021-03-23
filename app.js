// Bring in env
require('dotenv').config();

// Use Lob wrapper
const Lob = require('lob')(process.env.LIVE_KEY);

// Take command line input
const readline = require('readline-sync');

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

// Add an address
const addAddress = () => {
  // Get address info
  console.log('Please enter new address information');
  const addressInput = getInput([
    'name',
    'address line 1',
    'address line 2',
    'city',
    'state',
    'zip code',
  ]);

  // Create object in format expected by API
  const formattedAddress = {
    name: addressInput.name,
    address_line1: addressInput['address line 1'],
    address_line2: addressInput['address line 2'],
    address_city: addressInput.city,
    address_state: addressInput.state,
    address_zip: addressInput['zip code'],
    address_country: 'US',
  };

  // Hit the API
  Lob.addresses.create(formattedAddress, (err, res) => {
    console.log(err, res);
  });
};

// Gets input from command line
// Takes array of strings representing field names
// Returns object with key: val pairs in format field: response
const getInput = fields => {
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

// Run it!
(() => {
  console.log("Let's do address things!\n");
  // Give options for what to do
  console.log('Here are the things you can do:');
  console.log('1: Verify an address');
  console.log('2: Create a new address');

  // Get input
  const action = readline.question(
    '\nPlease enter the number of your chosen action:\n'
  );

  // Do the thing
  switch (action) {
    case '1':
      validateAddress();
      break;
    case '2':
      addAddress();
      break;
    default:
      console.log("I'm sorry, that's an invalid option!");
  }
})();
