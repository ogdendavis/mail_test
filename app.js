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
    // If error, print it and stop
    if (err) {
      console.error(err);
      return;
    }
    // Just print the verification object
    console.log(res);
  });
};

// Add an address
const addAddress = () => {
  // Get address info
  console.log('Please enter new address information');
  const addressInput = getInput([
    'name',
    'address line 1',
    'address line 2 (optional)',
    'city',
    'state',
    'zip code',
  ]);

  // Create object in format expected by API
  const formattedAddress = {
    name: addressInput.name,
    address_line1: addressInput['address line 1'],
    address_line2: addressInput['address line 2 (optional)'],
    address_city: addressInput.city,
    address_state: addressInput.state,
    address_zip: addressInput['zip code'],
    address_country: 'US',
  };

  // Hit the API
  Lob.addresses.create(formattedAddress, (err, res) => {
    // If error, print it and stop
    if (err) {
      console.error(err);
      return;
    }
    // Print success message and address info
    console.log('\nNew address created!');
    printAddress(res);
  });
};

// Show all addresses
const listAddresses = () => {
  // All we have to do is hit the endpoint
  Lob.addresses.list(null, (err, res) => {
    // If error, print it and stop
    if (err) {
      console.log(err);
      return;
    }
    // Response object contains data array of address objects
    res.data.forEach(a => {
      // Print the address
      printAddress(a);
      // Blank line between addresses
      console.log();
    });
  });
};

// Print one address
// Takes address object as returned by API
const printAddress = addy => {
  // Format street address for printing
  const streetAddy =
    addy.address_line2 === null
      ? addy.address_line1
      : `${addy.address_line1}, ${addy.address_line2}`;

  // Print output
  console.log(`ID: ${addy.id}`);
  console.log(`Name: ${addy.name}`);
  console.log(
    `Address: \n ${streetAddy} \n ${addy.address_city}, ${addy.address_state} ${addy.address_zip}`
  );
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
  console.log('3: List all addresses');

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
    case '3':
      listAddresses();
      break;
    default:
      console.log("I'm sorry, that's an invalid option!");
  }
})();
