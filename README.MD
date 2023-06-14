# Game N!ght

## Description
Web store app that utilizes the Braintree Javascript SDK's [Hosted Fields UI](https://developer.paypal.com/braintree/docs/guides/hosted-fields/overview) and [Node server SDK](https://developer.paypal.com/braintree/docs/reference/request/transaction/sale/node). 

## Requirements
- [node](https://nodejs.org/en) 
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Braintree Sandbox - [free sign-up here](https://www.braintreepayments.com/sandbox)

## Instructions
- Install node packages
    - ``` npm install```
- Create `.env` file and enter in your [Braintree API credentials] and sessions secret (https://developer.paypal.com/braintree/articles/control-panel/important-gateway-credentials#api-credentials).
```
SECRET = {{string_of_your_choosing}}

MERCHANT_ID = {{merchant_id}}
PUBLIC_KEY = {{public_api_key}}
PRIVATE_KEY = {{private_api_key}}
```
- Run app
```npm start```

## Resources
- [Testing card values](https://developer.paypal.com/braintree/docs/reference/general/testing/node#valid-card-numbers)