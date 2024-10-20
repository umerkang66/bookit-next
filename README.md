# BookIt Application with T3 Stack

## To run on Local Environment

Install the Deps.

`npm install`

Initialize the DB

`npx prisma db push`

Start the application create the user and get the user_id from Prisma Studio, and set it in the seed.ts file

`npx prisma studio`

Seed the data

`npx prisma db seed`

Build the Project

`npm run build`

Start the app

`npm start`

Also start the stripe webhook event listener

`stripe listen --forward-to http://localhost:3000/api/payment/webhook --events checkout.session.completed`
